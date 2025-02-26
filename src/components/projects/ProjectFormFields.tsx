
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormFieldsProps {
  formData: {
    title: string;
    description: string;
    website: string;
    github: string;
    developmentHours?: number;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProjectFormFields = ({ formData, onChange }: ProjectFormFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
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
          onChange={onChange}
          placeholder="Describe your project..."
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website">Website URL *</Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          placeholder="https://your-project.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          name="github"
          type="url"
          value={formData.github}
          onChange={onChange}
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="developmentHours">Development Time (hours)</Label>
        <Input
          id="developmentHours"
          name="developmentHours"
          type="number"
          min="0"
          step="0.5"
          value={formData.developmentHours || ""}
          onChange={onChange}
          placeholder="Enter development time in hours"
        />
      </div>
    </>
  );
};
