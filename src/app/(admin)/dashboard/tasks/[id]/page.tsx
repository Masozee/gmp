"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import Link from "next/link"
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Edit, 
  FileText, 
  Trash2, 
  UserCheck, 
  ArrowLeft 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { TaskReview } from "@/components/tasks/task-review"

// Task type
interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate: string | null
  completedDate: string | null
  assignedTo: string | null
  delegatedBy: string
  reviewStatus: "PENDING" | "NEEDS_UPDATE" | "ACCEPTED"
  reviewComment: string | null
  reviewDate: string | null
  createdBy: string | null
  agentId: string | null
  tags: string | null
  sharedFiles: string | null
  createdAt: string
  updatedAt: string
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
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
        setTask(data.task)

        // Try to get current user info from cookies (simplified approach)
        try {
          const userResponse = await fetch('/api/auth/me')
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setCurrentUser(userData.user || null)
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
  
  // Handle status change
  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (!task) return
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error("Failed to update task status")
      }
      
      const data = await response.json()
      setTask(data.task)
      toast(`Task status changed to ${newStatus}`)
    } catch (err) {
      console.error("Error updating task:", err)
      toast.error("Failed to update task status")
    }
  }
  
  // Handle task deletion
  const handleDelete = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      
      toast.success("Task deleted successfully")
      router.push("/dashboard/tasks")
    } catch (err) {
      console.error("Error deleting task:", err)
      toast.error("Failed to delete task")
    }
  }
  
  // Handle task review
  const handleTaskReview = async (taskId: string, reviewData: { reviewStatus: string, reviewComment?: string }) => {
    try {
      const response = await fetch(`/api/tasks/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskId,
          reviewStatus: reviewData.reviewStatus,
          reviewComment: reviewData.reviewComment
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to submit review")
      }
      
      // Refresh task data
      const taskResponse = await fetch(`/api/tasks/${taskId}`)
      if (taskResponse.ok) {
        const data = await taskResponse.json()
        setTask(data.task)
      }
      
      return Promise.resolve()
    } catch (error) {
      console.error("Error submitting review:", error)
      throw error
    }
  }
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-slate-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      case "REVIEW":
        return "bg-yellow-500"
      case "COMPLETED":
        return "bg-green-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }
  
  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-slate-400"
      case "MEDIUM":
        return "bg-blue-400"
      case "HIGH":
        return "bg-orange-400"
      case "CRITICAL":
        return "bg-red-500"
      default:
        return "bg-slate-400"
    }
  }
  
  // Review status badge color
  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500"
      case "NEEDS_UPDATE":
        return "bg-red-500"
      case "ACCEPTED":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }
  
  // Format shared files
  const getSharedFiles = () => {
    if (!task?.sharedFiles) return []
    
    try {
      const files = JSON.parse(task.sharedFiles)
      return Array.isArray(files) ? files : []
    } catch (e) {
      return []
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
  if (error || !task) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-10">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Task</h2>
              <p className="text-muted-foreground mb-4">{error || "Task not found"}</p>
              <Button asChild>
                <Link href="/dashboard/tasks">Back to Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Check if current user is the delegator
  const isDelegator = currentUser && currentUser.id === task.delegatedBy
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link 
          href="/dashboard/tasks" 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Task Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  <CardDescription>
                    Created {format(new Date(task.createdAt), "PPP")}
                    {task.updatedAt && task.updatedAt !== task.createdAt && 
                      ` · Updated ${format(new Date(task.updatedAt), "PPP")}`}
                  </CardDescription>
                </div>
                
                {isDelegator && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/tasks/${task.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {task.sharedFiles && <TabsTrigger value="files">Files</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                      {task.dueDate ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(task.dueDate), "PPP")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No due date</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Completion Date</h3>
                      {task.completedDate ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {format(new Date(task.completedDate), "PPP")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not completed</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Delegated By</h3>
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        {task.delegatedBy || "Unknown"}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h3>
                      {task.assignedTo ? (
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2" />
                          {task.assignedTo}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    
                    {task.tags && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                          {task.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="description">
                  <div className="prose max-w-none">
                    {task.description ? (
                      <div className="whitespace-pre-wrap">{task.description}</div>
                    ) : (
                      <p className="text-muted-foreground">No description provided</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="files">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Shared Files</h3>
                    {getSharedFiles().length > 0 ? (
                      <ul className="space-y-2">
                        {getSharedFiles().map((file: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <a 
                              href={file} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline truncate"
                            >
                              {file.split('/').pop() || file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No files shared</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={task.status === "COMPLETED"}
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                  >
                    Mark In Progress
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={task.status === "REVIEW"}
                    onClick={() => handleStatusChange("REVIEW")}
                  >
                    Mark Ready for Review
                  </Button>
                </div>
                <div>
                  {task.status !== "COMPLETED" ? (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleStatusChange("COMPLETED")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("TODO")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Reopen Task
                    </Button>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Side Panel: Review & Status */}
        <div className="space-y-6">
          {/* Review Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Review Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Status</h3>
                  <Badge className={getReviewStatusColor(task.reviewStatus)}>
                    {task.reviewStatus.replace("_", " ")}
                  </Badge>
                </div>
                
                {task.reviewDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Reviewed</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(task.reviewDate), "PPP 'at' h:mm a")}
                    </div>
                  </div>
                )}
                
                {task.reviewComment && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Review Comments</h3>
                    <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                      {task.reviewComment}
                    </div>
                  </div>
                )}
                
                {isDelegator && (task.status === "REVIEW" || task.status === "COMPLETED") && (
                  <div className="pt-2">
                    <TaskReview
                      task={task}
                      onReviewSubmit={handleTaskReview}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Timeline (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Task created</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(task.createdAt), "PPP 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task updated</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.updatedAt), "PPP 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
                
                {task.reviewDate && (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task reviewed</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.reviewDate), "PPP 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
