"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { TaskForm } from "@/components/tasks/task-form"

// Task form values type
interface TaskFormValues {
  title: string
  description?: string
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate?: Date
  assignedTo?: string
  agentId?: string
  tags?: string
  sharedFiles?: string
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [initialData, setInitialData] = useState<TaskFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{id: string, role: string} | null>(null)
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tasks/${resolvedParams.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch task: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Convert string date to Date object for the form
        const formValues: TaskFormValues = {
          title: data.task.title,
          description: data.task.description || "",
          status: data.task.status,
          priority: data.task.priority,
          dueDate: data.task.dueDate ? new Date(data.task.dueDate) : undefined,
          assignedTo: data.task.assignedTo || "",
          agentId: data.task.agentId || "",
          tags: data.task.tags || "",
          sharedFiles: data.task.sharedFiles || "",
        }
        
        setInitialData(formValues)
        
        // Try to get current user info
        try {
          const userResponse = await fetch('/api/auth/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setCurrentUser(userData.user || null)
            
            // Check permissions - only delegator can edit
            if (userData.user && userData.user.id !== data.task.delegatedBy) {
              setError("You don't have permission to edit this task")
            }
          }
        } catch (userError) {
          console.error("Could not fetch current user:", userError)
        }
      } catch (err) {
        console.error("Error fetching task:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }
    
    fetchTask()
  }, [resolvedParams.id])
  
  // Handle form submission
  const handleSubmit = async (values: TaskFormValues) => {
    setSubmitting(true)
    
    try {
      // Convert Date object to ISO string for API
      const apiValues = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      }
      
      const response = await fetch(`/api/tasks/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiValues),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      
      toast.success("Task updated successfully")
      router.push(`/dashboard/tasks/${resolvedParams.id}`)
    } catch (err) {
      console.error("Error updating task:", err)
      toast.error("Failed to update task")
    } finally {
      setSubmitting(false)
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-10 flex justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p>Loading task details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Error state
  if (error || !initialData) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-10">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground mb-4">{error || "Failed to load task"}</p>
              <Button asChild>
                <Link href="/dashboard/tasks">Back to Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link 
          href={`/dashboard/tasks/${resolvedParams.id}`}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Task
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/tasks/${resolvedParams.id}`)}
            isSubmitting={submitting}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Only the task delegator can edit task details. The task will be updated immediately when you save changes.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
