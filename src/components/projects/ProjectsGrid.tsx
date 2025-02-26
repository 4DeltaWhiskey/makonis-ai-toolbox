
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types/project";

interface ProjectsGridProps {
  projects: Project[];
  onDelete: () => void;
}

export function ProjectsGrid({ projects, onDelete }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="animate-slideUpAndFade">
          <ProjectCard project={project} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
