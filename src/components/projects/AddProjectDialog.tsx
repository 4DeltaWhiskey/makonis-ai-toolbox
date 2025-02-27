
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProjectFormFields } from "./ProjectFormFields";

interface AddProjectDialogProps {
  onProjectAdded: () => Promise<void>;
}

export function AddProjectDialog({ onProjectAdded }: AddProjectDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    website: "",
    github: "",
    thumbnailUrl: "",
    developmentHours: undefined as number | undefined
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'developmentHours' ? (value ? parseFloat(value) : undefined) : value,
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
      // Generate thumbnail from website
      const { data: thumbnailData, error: thumbnailError } = await supabase.functions
        .invoke('generate-thumbnail', {
          body: { website: formData.website }
        });

      if (thumbnailError) throw new Error(thumbnailError.message);

      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadVideo();
      }

      // Insert project into database
      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          website: formData.website || null,
          github: formData.github || null,
          video_url: videoUrl,
          thumbnail_url: thumbnailData.thumbnailUrl,
          user_id: user?.id,
          development_hours: formData.developmentHours || null
        });

      if (insertError) throw new Error(insertError.message);

      toast({
        title: "Success",
        description: "Project added successfully",
      });

      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        website: "",
        github: "",
        thumbnailUrl: "",
        developmentHours: undefined
      });
      setVideoFile(null);
      
      // Refresh projects list
      await onProjectAdded();
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ProjectFormFields 
              formData={formData} 
              onChange={handleInputChange} 
            />

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
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Project..." : "Submit Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
