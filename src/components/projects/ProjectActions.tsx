
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GithubIcon, Globe, Edit, Video } from "lucide-react";
import { useState } from "react";

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
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  return (
    <>
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
            onClick={() => setShowVideoDialog(true)}
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

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="sm:max-w-[66%] sm:max-h-[66vh]">
          <div className="aspect-video w-full">
            <video
              src={videoUrl}
              controls
              className="w-full h-full"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
