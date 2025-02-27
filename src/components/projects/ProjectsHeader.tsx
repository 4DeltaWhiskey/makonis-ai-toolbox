
import { AddProjectDialog } from "./AddProjectDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ProjectsHeaderProps {
  onProjectAdded: () => Promise<void>;
}

export function ProjectsHeader({ onProjectAdded }: ProjectsHeaderProps) {
  const { session, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

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
        {session ? (
          <>
            <AddProjectDialog onProjectAdded={onProjectAdded} />
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => navigate('/auth')}>
            <LogIn className="h-4 w-4 mr-2" />
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
