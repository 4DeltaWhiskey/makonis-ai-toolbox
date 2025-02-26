
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trash, Upload } from "lucide-react";
import type { Project } from "@/types/project";

interface EditProjectFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const EditProjectForm = ({ project, onSuccess, onCancel, onDelete }: EditProjectFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    website: project.website || "",
    github: project.github || "",
    tags: project.tags.join(", "),
    videoUrl: project.videoUrl || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;

    const fileExt = videoFile.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, videoFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
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
          video_url: videoUrl,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
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
        <div className="grid gap-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your project..."
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website URL *</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://your-project.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            name="github"
            type="url"
            value={formData.github}
            onChange={handleInputChange}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="video">Project Video</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="flex-1"
            />
            {videoFile && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setVideoFile(null)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          {formData.videoUrl && !videoFile && (
            <p className="text-sm text-muted-foreground">
              Current video: {formData.videoUrl}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags *</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="AI, Machine Learning, Computer Vision"
            required
          />
          <p className="text-sm text-muted-foreground">
            Separate tags with commas
          </p>
        </div>
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
