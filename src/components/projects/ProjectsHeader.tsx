
import { AddProjectDialog } from "./AddProjectDialog";

interface ProjectsHeaderProps {
  onProjectAdded: () => Promise<void>;
}

export function ProjectsHeader({ onProjectAdded }: ProjectsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">AI Project Library</h1>
        <p className="text-muted-foreground mt-2">
          Discover and share innovative AI development projects
        </p>
      </div>
      <AddProjectDialog onProjectAdded={onProjectAdded} />
    </div>
  );
}
