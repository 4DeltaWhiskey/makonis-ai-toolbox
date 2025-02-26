
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe, Edit, Trash } from "lucide-react";

interface ProjectActionsProps {
  website?: string;
  github?: string;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectActions = ({
  website,
  github,
  canEdit,
  onEdit,
  onDelete,
}: ProjectActionsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {website && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(website, '_blank')}
        >
          <Globe className="h-4 w-4" />
          Website
        </Button>
      )}
      {github && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(github, '_blank')}
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
            onClick={onEdit}
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
  );
};
