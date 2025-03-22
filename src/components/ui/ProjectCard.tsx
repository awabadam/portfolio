import Link from "next/link";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block w-full transition-all duration-300 hover:opacity-90"
    >
      <Card className="h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-border hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-lg font-medium">
              {project.title}
            </CardTitle>
            <Badge variant="outline" className="border-border/60">
              {project.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
