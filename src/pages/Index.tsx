
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
    // Using simpler join syntax
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
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

    if (!data) return;

    const formattedProjects: Project[] = data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      website: project.website || undefined,
      github: project.github || undefined,
      thumbnailUrl: project.thumbnail_url,
      tags: project.tags || [],
      userId: project.user_id,
      owner: project.profiles ? {
        email: project.profiles.email
      } : null
    }));

    setProjects(formattedProjects);
    console.log('Fetched projects:', formattedProjects);
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
