
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

const Index = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        website,
        github,
        thumbnail_url,
        video_url,
        development_hours,
        user_id,
        profiles (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch projects",
      });
      return;
    }

    setProjects(data?.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      website: project.website || undefined,
      github: project.github || undefined,
      thumbnailUrl: project.thumbnail_url,
      videoUrl: project.video_url || undefined,
      developmentHours: project.development_hours || undefined,
      userId: project.user_id,
      userEmail: project.profiles?.email
    })) || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 animate-slideIn">
      <div className="max-w-7xl mx-auto">
        <ProjectsHeader onProjectAdded={fetchProjects} />
        <ProjectsGrid projects={projects} onDelete={fetchProjects} />
      </div>
    </div>
  );
};

export default Index;
