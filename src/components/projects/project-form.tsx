"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProjectFormProps {
  projectId?: string
}

interface ProjectFormData {
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
  managedBy: string
}

interface ProjectGoal {
  id: string
  title: string
  description: string
  targetDate: string
  status: string
  progress: number
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter()
  const isEditing = !!projectId
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "planning",
    managedBy: "" // This would typically be set to the current user's ID
  })
  
  const [goals, setGoals] = useState<ProjectGoal[]>([])
  const [newGoal, setNewGoal] = useState<Omit<ProjectGoal, 'id'>>({
    title: "",
    description: "",
    targetDate: "",
    status: "active",
    progress: 0
  })
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("details")
  
  // Fetch project data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/api/projects/${projectId}`)
          const data = await response.json()
          
          if (data.success) {
            setFormData({
              name: data.data.name,
              description: data.data.description || "",
              startDate: new Date(data.data.startDate).toISOString().split("T")[0],
              endDate: data.data.endDate ? new Date(data.data.endDate).toISOString().split("T")[0] : "",
              status: data.data.status,
              managedBy: data.data.managedBy || ""
            })
            
            // Set goals if available
            if (data.data.goals && Array.isArray(data.data.goals)) {
              setGoals(data.data.goals.map((goal: any) => ({
                id: goal.id,
                title: goal.title,
                description: goal.description || "",
                targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : "",
                status: goal.status,
                progress: goal.progress
              })))
            }
          } else {
            setError(data.error || "Failed to fetch project")
          }
        } catch (err) {
          setError("An error occurred while fetching the project")
          console.error(err)
        } finally {
          setFetchLoading(false)
        }
      }
      
      fetchProject()
    }
  }, [projectId, isEditing])
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  // Handle new goal input changes
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewGoal(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle new goal select changes
  const handleGoalSelectChange = (name: string, value: string) => {
    setNewGoal(prev => ({ ...prev, [name]: value }))
  }
  
  // Add a new goal
  const handleAddGoal = () => {
    if (!newGoal.title) {
      setValidationErrors(prev => ({ ...prev, goalTitle: "Goal title is required" }))
      return
    }
    
    const goal: ProjectGoal = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced by server
      ...newGoal
    }
    
    setGoals(prev => [...prev, goal])
    
    // Reset new goal form
    setNewGoal({
      title: "",
      description: "",
      targetDate: "",
      status: "active",
      progress: 0
    })
    
    // Clear validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.goalTitle
      return newErrors
    })
  }
  
  // Remove a goal
  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Project name is required"
    }
    
    if (!formData.startDate) {
      errors.startDate = "Start date is required"
    }
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "End date cannot be before start date"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        // Convert empty string to null for optional fields
        description: formData.description || null,
        endDate: formData.endDate || null,
        // Include goals if any
        goals: goals.length > 0 ? goals.map(goal => ({
          ...goal,
          description: goal.description || null,
          targetDate: goal.targetDate || null,
          progress: parseInt(goal.progress.toString(), 10)
        })) : undefined
      }
      
      // Make API request
      const url = isEditing 
        ? `/api/api/projects/${projectId}` 
        : "/api/api/projects"
      
      const method = isEditing ? "PATCH" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Redirect to projects list on success
        router.push(isEditing ? `/dashboard/projects/${projectId}` : "/dashboard/projects")
      } else {
        throw new Error(data.error || "Failed to save project")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      window.scrollTo(0, 0) // Scroll to top to show error
    } finally {
      setLoading(false)
    }
  }
  
  if (fetchLoading) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push(isEditing ? `/dashboard/projects/${projectId}` : "/dashboard/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{isEditing ? "Edit Project" : "Create Project"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update project details" : "Add a new project to your dashboard"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Project Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  disabled={loading}
                  className={validationErrors.name ? "border-destructive" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-destructive">{validationErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  disabled={loading}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-1">
                    Start Date
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={loading}
                    className={validationErrors.startDate ? "border-destructive" : ""}
                  />
                  {validationErrors.startDate && (
                    <p className="text-sm text-destructive">{validationErrors.startDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={loading}
                    className={validationErrors.endDate ? "border-destructive" : ""}
                  />
                  {validationErrors.endDate && (
                    <p className="text-sm text-destructive">{validationErrors.endDate}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-1">
                  Status
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="managedBy">Project Manager</Label>
                <Input
                  id="managedBy"
                  name="managedBy"
                  value={formData.managedBy}
                  onChange={handleChange}
                  placeholder="Enter project manager ID"
                  disabled={loading}
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("goals")}
                  disabled={loading}
                >
                  Next: Goals & Objectives
                </Button>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="goals">
            <CardContent className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium">Project Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Define key objectives and milestones for this project
                </p>
              </div>
              
              {/* Existing goals */}
              {goals.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Current Goals</h4>
                  {goals.map((goal, index) => (
                    <div key={goal.id} className="rounded-md border p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{goal.title}</h5>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveGoal(goal.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Target Date</p>
                          <p className="text-sm">
                            {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="text-sm">{goal.progress}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new goal */}
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-4">Add New Goal</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalTitle" className="flex items-center gap-1">
                      Goal Title
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="goalTitle"
                      name="title"
                      value={newGoal.title}
                      onChange={handleGoalChange}
                      placeholder="Enter goal title"
                      disabled={loading}
                      className={validationErrors.goalTitle ? "border-destructive" : ""}
                    />
                    {validationErrors.goalTitle && (
                      <p className="text-sm text-destructive">{validationErrors.goalTitle}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goalDescription">Description</Label>
                    <Textarea
                      id="goalDescription"
                      name="description"
                      value={newGoal.description}
                      onChange={handleGoalChange}
                      placeholder="Enter goal description"
                      disabled={loading}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="goalTargetDate">Target Date (Optional)</Label>
                      <Input
                        id="goalTargetDate"
                        name="targetDate"
                        type="date"
                        value={newGoal.targetDate}
                        onChange={handleGoalChange}
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goalStatus">Status</Label>
                      <Select
                        value={newGoal.status}
                        onValueChange={(value) => handleGoalSelectChange("status", value)}
                        disabled={loading}
                      >
                        <SelectTrigger id="goalStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="achieved">Achieved</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goalProgress">Progress (%)</Label>
                    <Input
                      id="goalProgress"
                      name="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={newGoal.progress}
                      onChange={handleGoalChange}
                      disabled={loading}
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={handleAddGoal}
                    disabled={loading}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("details")}
                  disabled={loading}
                >
                  Back to Details
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isEditing ? `/dashboard/projects/${projectId}` : "/dashboard/projects")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 