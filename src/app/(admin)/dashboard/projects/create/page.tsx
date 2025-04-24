"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProjectForm } from "@/components/projects/project-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert dates to ISO strings
      const projectData = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : null,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to create project";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't valid JSON, use the text as error or default
          if (errorText) errorMessage = errorText;
        }
        toast.error(errorMessage);
        console.error("Project creation error:", errorMessage);
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Project created successfully");
        router.push("/dashboard/projects");
      } else {
        toast.error(result.message || "Failed to create project");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred during project creation";
      toast.error(errorMessage);
      console.error("Project creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/projects");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Please log in to create projects</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
          <CardDescription>
            Create a new project to organize your tasks and collaborate with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            isSubmitting={isSubmitting} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
