"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  Users, 
  FileText,
  Plus
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"

interface ProjectDetailProps {
  projectId: string
}

interface Project {
  id: string
  name: string
  description: string | null
  startDate: string
  endDate: string | null
  status: string
  createdAt: string
  updatedAt: string
  createdBy: string
  managedBy: string
  members?: ProjectMember[]
  tasks?: Task[]
  budgetItems?: BudgetItem[]
  expenses?: Expense[]
  goals?: Goal[]
  reports?: ProjectReport[]
}

interface ProjectMember {
  id: string
  role: string
  joinedAt: string
  leftAt: string | null
  userId: string
}

interface Task {
  id: string
  title: string
  description: string | null
  priority: string
  status: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  projectId: string
  parentTaskId: string | null
  subtasks?: Task[]
  assignees?: ProjectMember[]
}

interface BudgetItem {
  id: string
  name: string
  amount: number
  category: string
  description: string | null
  projectId: string
  expenses?: Expense[]
}

interface Expense {
  id: string
  title: string
  amount: number
  date: string
  receipt: string | null
  status: string
  description: string | null
  projectId: string
  budgetItemId: string | null
  submittedBy: string
  approvedBy: string | null
}

interface Goal {
  id: string
  title: string
  description: string | null
  targetDate: string | null
  status: string
  progress: number
  projectId: string
}

interface ProjectReport {
  id: string
  title: string
  content: string
  type: string
  period: string | null
  createdAt: string
  projectId: string
  createdBy: string
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/api/projects/${projectId}`)
        const data = await response.json()
        
        if (data.success) {
          setProject(data.data)
        } else {
          setError(data.error || "Failed to fetch project")
        }
      } catch (err) {
        setError("An error occurred while fetching the project")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProject()
  }, [projectId])
  
  // Function to delete the project
  const handleDelete = async () => {
    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/api/projects/${projectId}`, {
        method: "DELETE"
      })
      const data = await response.json()
      
      if (data.success) {
        router.push("/dashboard/projects")
      } else {
        setError(data.error || "Failed to delete project")
        setDeleteLoading(false)
      }
    } catch (err) {
      setError("An error occurred while deleting the project")
      console.error(err)
      setDeleteLoading(false)
    }
  }
  
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to get task status color
  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-yellow-100 text-yellow-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  if (!project) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Project not found
          </div>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Calculate project progress based on tasks
  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0
    
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / project.tasks.length) * 100)
  }

  const projectProgress = calculateProgress()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/dashboard/projects")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                Last updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Project Progress</h3>
                <div className="flex items-center mt-1">
                  <Progress value={projectProgress} className="w-[200px]" />
                  <span className="ml-2 text-sm text-muted-foreground">{projectProgress}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project
                        and all associated data including tasks, budget items, and reports.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Calendar className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="budget">
            <DollarSign className="h-4 w-4 mr-2" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Basic information about the project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{project.description || "No description provided"}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p className="mt-1">{format(new Date(project.startDate), 'MMMM d, yyyy')}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p className="mt-1">
                    {project.endDate 
                      ? format(new Date(project.endDate), 'MMMM d, yyyy')
                      : "Not specified"}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                  <p className="mt-1">{project.createdBy || "Unknown"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Managed By</h3>
                  <p className="mt-1">{project.managedBy || "Unknown"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p className="mt-1">
                  {format(new Date(project.createdAt), 'MMMM d, yyyy')}
                  ({formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })})
                </p>
              </div>
            </CardContent>
          </Card>

          {project.goals && project.goals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Goals</CardTitle>
                <CardDescription>
                  Key objectives and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{goal.title}</h3>
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </Badge>
                      </div>
                      {goal.description && <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>}
                      <div className="flex items-center mt-2">
                        <Progress value={goal.progress} className="flex-1" />
                        <span className="ml-2 text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      {goal.targetDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage project tasks and subtasks
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {!project.tasks || project.tasks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No tasks have been created for this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </p>
                      )}
                      
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-4 pl-4 border-l">
                          <h4 className="text-sm font-medium mb-2">Subtasks</h4>
                          <div className="space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm">{subtask.title}</p>
                                </div>
                                <Badge variant="outline" className={getTaskStatusColor(subtask.status)}>
                                  {subtask.status.charAt(0).toUpperCase() + subtask.status.slice(1)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget</CardTitle>
                <CardDescription>
                  Track project budget and expenses
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget Item
              </Button>
            </CardHeader>
            <CardContent>
              {!project.budgetItems || project.budgetItems.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No budget items have been created for this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {project.budgetItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            ${item.amount.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </p>
                      
                      {item.expenses && item.expenses.length > 0 && (
                        <div className="mt-4 pl-4 border-l">
                          <h4 className="text-sm font-medium mb-2">Expenses</h4>
                          <div className="space-y-2">
                            {item.expenses.map((expense) => (
                              <div key={expense.id} className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm">{expense.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(expense.date), 'MMM d, yyyy')}
                                  </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    ${expense.amount.toFixed(2)}
                                  </Badge>
                                  <Badge variant="outline">
                                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  People working on this project
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              {!project.members || project.members.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No team members have been assigned to this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">User ID: {member.userId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Joined: {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        {member.leftAt && (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            Left
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Reports</CardTitle>
                <CardDescription>
                  Documentation and progress reports
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </CardHeader>
            <CardContent>
              {!project.reports || project.reports.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No reports have been created for this project yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {project.reports.map((report) => (
                    <div key={report.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {format(new Date(report.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                        {report.period && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {report.period.charAt(0).toUpperCase() + report.period.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 