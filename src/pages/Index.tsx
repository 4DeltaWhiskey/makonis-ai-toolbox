
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Project } from "@/types/project";

const sampleProjects: Project[] = [
  {
    id: "1",
    title: "AI Image Generator",
    description: "A deep learning model that generates unique images from text descriptions.",
    website: "https://example.com",
    github: "https://github.com/example/ai-image-gen",
    thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    tags: ["AI", "Deep Learning", "Computer Vision"],
  },
  {
    id: "2",
    title: "Natural Language Processing API",
    description: "REST API for text analysis, sentiment detection, and language translation.",
    website: "https://example.com",
    github: "https://github.com/example/nlp-api",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tags: ["NLP", "API", "Machine Learning"],
  },
];

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen px-6 py-12 animate-slideIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">AI Project Library</h1>
            <p className="text-muted-foreground mt-2">
              Discover and share innovative AI development projects
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">
                  Project submission form coming soon...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map((project) => (
            <div key={project.id} className="animate-slideUpAndFade">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
