
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trash } from "lucide-react";
import type { Project } from "@/types/project";
import { VideoUpload } from "./VideoUpload";
import { ProjectFormFields } from "./ProjectFormFields";
import { useVideoUpload } from "./hooks/useVideoUpload";

interface EditProjectFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const EditProjectForm = ({ project, onSuccess, onCancel, onDelete }: EditProjectFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    website: project.website || "",
    github: project.github || "",
    videoUrl: project.videoUrl || ""
  });

  const { 
    videoFile,
    videoPreviewUrl,
    handleVideoChange,
    handleVideoRemove,
    uploadVideo 
  } = useVideoUpload({ initialVideoUrl: formData.videoUrl });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let videoUrl = formData.videoUrl;
      
      if (videoFile) {
        videoUrl = await uploadVideo();
      }

      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          website: formData.website || null,
          github: formData.github || null,
          video_url: videoUrl
        })
        .eq('id', project.id);

      if (error) throw new Error(error.message);

      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <ProjectFormFields 
          formData={formData} 
          onChange={handleInputChange} 
        />
        
        <VideoUpload
          videoPreviewUrl={videoPreviewUrl}
          onVideoChange={handleVideoChange}
          onVideoRemove={handleVideoRemove}
          videoFile={videoFile}
        />
      </div>

      <DialogFooter className="flex justify-between space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
};
