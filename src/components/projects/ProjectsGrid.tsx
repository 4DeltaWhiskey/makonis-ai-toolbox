
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types/project";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="animate-slideUpAndFade">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
