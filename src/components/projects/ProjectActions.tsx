
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe, Edit, Video } from "lucide-react";

interface ProjectActionsProps {
  website?: string;
  github?: string;
  videoUrl?: string;
  canEdit: boolean;
  onEdit: () => void;
}

export const ProjectActions = ({
  website,
  github,
  videoUrl,
  canEdit,
  onEdit,
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
      {videoUrl && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(videoUrl, '_blank')}
        >
          <Video className="h-4 w-4" />
          Video
        </Button>
      )}
      {canEdit && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      )}
    </div>
  );
};
