import { ProjectForm } from "@/components/projects/project-form"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Project</h1>
      <ProjectForm projectId={params.id} />
    </div>
  )
} 