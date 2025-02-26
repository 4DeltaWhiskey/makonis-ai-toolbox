
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GithubIcon, Globe, Trash, Edit } from "lucide-react";
import type { Project } from "@/types/project";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    website: project.website || "",
    github: project.github || "",
    tags: project.tags.join(", ")
  });
  
  const canModify = isAdmin || user?.id === project.userId;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          website: formData.website || null,
          github: formData.github || null,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        })
        .eq('id', project.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      setIsEditDialogOpen(false);
      // Refresh the projects list
      onDelete(); // Using onDelete as a refresh trigger
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      
      onDelete();
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <Card className="project-card overflow-hidden bg-white">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-xl tracking-tight">{project.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        </CardContent>
        <CardFooter className="gap-2">
          {project.website && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(project.website, '_blank')}
            >
              <Globe className="h-4 w-4" />
              Website
            </Button>
          )}
          {project.github && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(project.github, '_blank')}
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </Button>
          )}
          {canModify && (
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
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
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
