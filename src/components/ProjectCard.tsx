
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types/project";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectActions } from "./projects/ProjectActions";
import { EditProjectForm } from "./projects/EditProjectForm";
import { ChevronRight, Edit, User } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectCardProps {
  project: Project;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const { user, isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  
  const canEdit = Boolean(
    user && (
      isAdmin || 
      user.id === project.userId
    )
  );

  return (
    <>
      <Card className="project-card overflow-hidden bg-white relative h-[420px] w-full flex flex-col">
        {canEdit && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <div className="relative h-[210px] overflow-hidden">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardHeader className="space-y-2 flex-none py-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-xl tracking-tight line-clamp-1">{project.title}</h3>
            {project.userEmail && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{project.userEmail}</span>
              </div>
            )}
          </div>
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
            videoUrl={project.videoUrl}
            canEdit={canEdit}
            onEdit={() => setShowEditDialog(true)}
          />
        </CardFooter>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            {project.userEmail && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Created by {project.userEmail}</span>
              </div>
            )}
          </DialogHeader>
          <EditProjectForm
            project={project}
            onSuccess={() => {
              setShowEditDialog(false);
              onDelete();
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
