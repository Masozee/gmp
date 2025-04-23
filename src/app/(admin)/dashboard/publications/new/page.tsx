import { PublicationForm } from "@/components/publications/publication-form"

export default function NewPublicationPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Create New Publication</h1>
      <PublicationForm />
    </div>
  )
} 