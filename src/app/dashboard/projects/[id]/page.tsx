import { ProjectDetail } from "@/components/projects/project-detail"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="container mx-auto py-6">
      <ProjectDetail projectId={params.id} />
    </div>
  )
} 