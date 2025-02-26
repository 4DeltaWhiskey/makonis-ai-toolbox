
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    website: "",
    github: "",
    thumbnailUrl: "",
    tags: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we'll later add the actual submission logic
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      website: formData.website || undefined,
      github: formData.github || undefined,
      thumbnailUrl: formData.thumbnailUrl,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    console.log("New project:", newProject);
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      website: "",
      github: "",
      thumbnailUrl: "",
      tags: "",
    });
  };

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
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project..."
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://your-project.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL *</Label>
                    <Input
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags *</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="AI, Machine Learning, Computer Vision"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Project</Button>
                </DialogFooter>
              </form>
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
