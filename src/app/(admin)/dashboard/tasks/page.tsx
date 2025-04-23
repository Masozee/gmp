"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskList } from "@/components/tasks/task-list"
import { TaskStats } from "@/components/tasks/task-stats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TaskForm } from "@/components/tasks/task-form"
import { useToast } from "@/components/ui/use-toast"

export default function TasksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Handle task form submission
  type TaskFormData = {
    dueDate?: Date;
    [key: string]: any;
  };

  const handleCreateTask = async (data: TaskFormData) => {
    setIsSubmitting(true)
    
    // Convert date object to ISO string
    if (data.dueDate) {
      data.dueDate = data.dueDate.toISOString()
    }
    
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create task")
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })
      
      // Close dialog and refresh tasks
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle task update
  const handleTaskUpdate = () => {
    router.refresh()
    toast({
      title: "Task updated",
      description: "The task has been updated successfully.",
    })
  }
  
  // Handle task deletion
  const handleTaskDelete = () => {
    router.refresh()
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    })
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
          <p className="text-muted-foreground">
            Manage AI agent tasks and track their progress
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <TaskForm 
                onSubmit={handleCreateTask} 
                onCancel={() => setOpen(false)} 
                isSubmitting={isSubmitting}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
          <TaskStats />
        </div>
      </div>
      
      <TaskList 
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  )
} 