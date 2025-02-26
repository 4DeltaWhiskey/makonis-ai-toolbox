
export interface Project {
  id: string;
  title: string;
  description: string;
  website?: string;
  github?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  tags: string[];
  userId?: string;
  userEmail?: string;
}
