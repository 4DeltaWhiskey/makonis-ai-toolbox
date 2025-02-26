
import { AddProjectDialog } from "./AddProjectDialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface ProjectsHeaderProps {
  onProjectAdded: () => Promise<void>;
}

export function ProjectsHeader({ onProjectAdded }: ProjectsHeaderProps) {
  const { signOut, isAdmin } = useAuth();

  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI Project Library
          {isAdmin && <Badge variant="secondary" className="ml-2">Admin</Badge>}
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover and share innovative AI development projects
        </p>
      </div>
      <div className="flex items-center gap-4">
        <AddProjectDialog onProjectAdded={onProjectAdded} />
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
