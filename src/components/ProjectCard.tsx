
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
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
      </CardFooter>
    </Card>
  );
};
