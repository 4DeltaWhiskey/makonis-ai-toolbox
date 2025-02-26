
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectActions } from "./projects/ProjectActions";
import { EditProjectForm } from "./projects/EditProjectForm";
import { ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const { user, isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  
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

  return (
    <>
      <Card className="project-card overflow-hidden bg-white relative h-[420px] w-full flex flex-col">
        <div className="relative h-[210px] overflow-hidden">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardHeader className="space-y-2 flex-none py-3">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-semibold text-xl tracking-tight line-clamp-1">{project.title}</h3>
        </CardHeader>
        <CardContent className="flex-1">
          <div>
            <div className="relative">
              <p className={`text-muted-foreground ${expandDescription ? '' : 'line-clamp-2'}`}>
                {project.description}
              </p>
              {!expandDescription && project.description.length > 100 && (
                <button
                  onClick={() => setExpandDescription(true)}
                  className="text-primary inline-flex items-center gap-1 text-sm absolute bottom-0 right-0 bg-white pl-1 hover:underline"
                >
                  more <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between items-center p-6 pt-0 flex-none">
          <ProjectActions
            website={project.website}
            github={project.github}
            canEdit={canEdit}
            onEdit={() => setShowEditDialog(true)}
          />
        </CardFooter>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <EditProjectForm
            project={project}
            onSuccess={() => {
              setShowEditDialog(false);
              onDelete(); // Using onDelete as a refresh trigger
            }}
            onCancel={() => setShowEditDialog(false)}
            onDelete={() => {
              setShowEditDialog(false);
              onDelete();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
