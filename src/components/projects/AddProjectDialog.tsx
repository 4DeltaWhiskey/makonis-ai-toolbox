
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface AddProjectDialogProps {
  onProjectAdded: () => Promise<void>;
}

export function AddProjectDialog({ onProjectAdded }: AddProjectDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    website: "",
    github: "",
    thumbnailUrl: "",
    tags: "",
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

      // Insert project into database
      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          website: formData.website || null,
          github: formData.github || null,
          thumbnail_url: thumbnailData.thumbnailUrl,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          user_id: user?.id
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
        tags: "",
      });
      
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
