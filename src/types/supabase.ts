
export type Project = {
  id: string;
  title: string;
  description: string;
  website?: string | null;
  github?: string | null;
  video_url?: string | null;
  thumbnail_url: string;
  tags: string[];
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
