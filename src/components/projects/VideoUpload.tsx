
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { useRef } from "react";

interface VideoUploadProps {
  videoPreviewUrl: string | null;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  videoFile: File | null;
}

export const VideoUpload = ({
  videoPreviewUrl,
  onVideoChange,
  onVideoRemove,
  videoFile,
}: VideoUploadProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="grid gap-2">
      <Label htmlFor="video">Project Video</Label>
      <div className="flex gap-2 items-center">
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={onVideoChange}
          className="flex-1"
        />
        {videoFile && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onVideoRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {videoPreviewUrl && (
        <div className="mt-2">
          <video
            ref={videoRef}
            src={videoPreviewUrl}
            controls
            className="w-full rounded-md max-h-[200px] object-contain bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};
