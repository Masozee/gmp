"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { TaskList } from "@/components/tasks/task-list"
import { TaskStats } from "@/components/tasks/task-stats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TaskForm } from "@/components/tasks/task-form"
import { toast } from "sonner"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TaskDelegationPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("delegated")
  
  // Fetch current user ID 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setCurrentUserId(data.id)
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error)
      }
    }
    
    fetchCurrentUser()
  }, [])
  
  // Handle task form submission
  interface TaskFormData {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: Date;
    assignedTo?: string;
    agentId?: string;
    tags?: string;
    sharedFiles?: string;
    [key: string]: any;
  }

  const handleCreateTask = async (data: TaskFormData) => {
    setIsSubmitting(true)
    
    // Create a new data object with a proper copy to avoid reference issues
    const submissionData = { ...data }
    
    // Convert Date object to ISO string for API submission
    if (data.dueDate) {
      submissionData.dueDate = data.dueDate.toISOString()
    }
    
    // Convert shared files to a JSON-friendly format if provided
    if (data.sharedFiles) {
      const files = data.sharedFiles.split(',').map((file: string) => file.trim()).filter(Boolean)
      if (files.length > 0) {
        submissionData.sharedFiles = JSON.stringify(files)
      }
    }
    
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }
      
      toast.success("Task created successfully.")
      
      // Close dialog and refresh tasks
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle task update
  const handleTaskUpdate = () => {
    router.refresh()
    toast.success("Task updated successfully.")
  }
  
  // Handle task deletion
  const handleTaskDelete = () => {
    router.refresh()
    toast.success("Task deleted successfully.")
  }
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Delegation</h2>
          <p className="text-muted-foreground">
            Delegate tasks, review work, and collaborate with team members
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
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
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Task Management</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter(undefined)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("TODO")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("IN_PROGRESS")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("REVIEW")}>
                  In Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setPriorityFilter(undefined)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("LOW")}>
                  Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("MEDIUM")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("HIGH")}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("CRITICAL")}>
                  Critical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>
            Manage tasks you've delegated and tasks assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="delegated" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="delegated">Tasks I Delegated</TabsTrigger>
              <TabsTrigger value="assigned">Tasks Assigned to Me</TabsTrigger>
            </TabsList>
            <TabsContent value="delegated" className="pt-4">
              <TaskList 
                initialFilter={{
                  status: statusFilter,
                  priority: priorityFilter
                }}
                filterBy={{
                  type: "delegated",
                  userId: currentUserId || ""
                }}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                currentUserId={currentUserId || undefined}
              />
            </TabsContent>
            <TabsContent value="assigned" className="pt-4">
              <TaskList 
                initialFilter={{
                  status: statusFilter,
                  priority: priorityFilter
                }}
                filterBy={{
                  type: "assigned",
                  userId: currentUserId || ""
                }}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                currentUserId={currentUserId || undefined}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
