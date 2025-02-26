
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe, Edit, Video, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [showVideo, setShowVideo] = useState(false);

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
            onClick={() => setShowVideo(true)}
          >
            <Video className="h-4 w-4" />
            Video
          </Button>
        )}
      </div>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="aspect-video w-full">
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full rounded-lg"
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
