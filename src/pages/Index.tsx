
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
    // First, let's check if we can fetch projects without the join
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch projects",
      });
      return;
    }

    // Now let's fetch profiles separately for debugging
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      console.log('Profiles data:', profilesData);
    }

    if (!projectsData) return;

    const formattedProjects: Project[] = projectsData.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      website: project.website || undefined,
      github: project.github || undefined,
      thumbnailUrl: project.thumbnail_url,
      tags: project.tags || [],
      userId: project.user_id,
      owner: null // We'll handle this separately once we debug the issue
    }));

    setProjects(formattedProjects);
    
    // Log detailed information for debugging
    console.log('Projects:', projectsData);
    console.log('Formatted Projects:', formattedProjects);
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
