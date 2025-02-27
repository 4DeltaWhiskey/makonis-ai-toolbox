
export interface Project {
  id: string;
  title: string;
  description: string;
  website?: string;
  github?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  userId?: string;
  userEmail?: string;
  developmentHours?: number;
}
