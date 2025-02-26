
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface UseVideoUploadProps {
  initialVideoUrl: string;
}

export const useVideoUpload = ({ initialVideoUrl }: UseVideoUploadProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialVideoUrl) {
      setVideoPreviewUrl(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    setVideoPreviewUrl(initialVideoUrl);
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;

    const fileExt = videoFile.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, videoFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return {
    videoFile,
    videoPreviewUrl,
    handleVideoChange,
    handleVideoRemove,
    uploadVideo,
  };
};
