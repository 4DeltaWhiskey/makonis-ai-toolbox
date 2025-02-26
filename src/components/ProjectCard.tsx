
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe, Edit, Trash } from "lucide-react";
import type { Project } from "@/types/project";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const { user, isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Calculate if user can edit the project
  const canEdit = Boolean(
    user && (
      isAdmin || // Admin can edit all projects
      user.id === project.userId // User can edit their own projects
    )
  );

  // Detailed logging for debugging auth state and permissions
  console.log('Project permissions debug:', {
    user: {
      id: user?.id,
      isLoggedIn: !!user,
    },
    project: {
      id: project.id,
      userId: project.userId,
    },
    permissions: {
      isAdmin,
      isOwner: user?.id === project.userId,
      canEdit,
    }
  });

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  return (
    <>
      <Card className="project-card overflow-hidden bg-white relative">
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
        <CardFooter className="flex flex-row justify-between items-center p-6 pt-0">
          <div className="flex gap-2 flex-wrap">
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
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {/* Add edit form content here */}
        </DialogContent>
      </Dialog>
    </>
  );
};
