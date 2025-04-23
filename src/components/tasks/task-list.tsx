"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, XCircle, Edit, Trash2 } from "lucide-react"
import { format, isPast, isToday, isTomorrow } from "date-fns"

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
  createdBy: string | null
  agentId: string | null
  tags: string | null
  createdAt: string
  updatedAt: string
}

// Pagination type
interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

interface TaskListProps {
  initialFilter?: {
    status?: string
    priority?: string
    assignedTo?: string
    agentId?: string
    tag?: string
  }
  onTaskUpdate?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}

export function TaskList({ 
  initialFilter = {}, 
  onTaskUpdate, 
  onTaskDelete 
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pagination, setPagination] = useState<Pagination>({ 
    total: 0, 
    page: 1, 
    limit: 10, 
    pages: 0 
  })
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState(initialFilter)
  
  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      
      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append("page", pagination.page.toString())
        params.append("limit", pagination.limit.toString())
        
        if (filter.status) params.append("status", filter.status)
        if (filter.priority) params.append("priority", filter.priority)
        if (filter.assignedTo) params.append("assignedTo", filter.assignedTo)
        if (filter.agentId) params.append("agentId", filter.agentId)
        if (filter.tag) params.append("tag", filter.tag)
        
        // Fetch tasks
        const response = await fetch(`/api/tasks?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        
        const data = await response.json()
        
        setTasks(data.tasks || [])
        setPagination(data.pagination || { 
          total: 0, 
          page: 1, 
          limit: 10, 
          pages: 0 
        })
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTasks()
  }, [filter, pagination.page, pagination.limit])
  
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
  
  // Due date formatter
  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return "No due date"
    
    const date = new Date(dueDate)
    
    if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else if (isPast(date)) {
      return `Overdue: ${format(date, "MMM d, yyyy")}`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }
  
  // Handle status change
  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
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
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? data.task : task
      ))
      
      // Call parent handler if provided
      if (onTaskUpdate) {
        onTaskUpdate(data.task)
      }
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }
  
  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      
      // Update local state
      setTasks(tasks.filter(task => task.id !== taskId))
      
      // Call parent handler if provided
      if (onTaskDelete) {
        onTaskDelete(taskId)
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>
          Manage your tasks and track progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="py-4 text-center">No tasks found</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      {task.title}
                      {task.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {task.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDueDate(task.dueDate)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {task.status !== "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStatusChange(task.id, "COMPLETED")}
                          title="Mark as Complete"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {task.status === "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStatusChange(task.id, "TODO")}
                          title="Mark as Todo"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete Task"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{tasks.length}</span> of{" "}
                <span className="font-medium">{pagination.total}</span> tasks
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 