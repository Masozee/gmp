"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Users,
  CheckSquare,
  ListTodo,
  FileText,
  Edit,
  Trash2,
  Flag,
  Loader2,
} from "lucide-react";
import { format, formatDistance } from "date-fns";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>(); // params can be { id: string } | null
  const id = params?.id; // Use optional chaining. id is string | undefined
  const { user, isLoading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user && id) {
      fetchProject();
    }
  }, [isLoading, user, id]);

  const fetchProject = async () => {
    // Add explicit check for id
    if (!id) {
      console.error("Project ID missing, cannot fetch.");
      toast.error("Project ID is missing.");
      setLoading(false);
      // Optional: redirect or show specific error UI
      // router.push('/dashboard/projects'); 
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch project details";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't valid JSON, use default error message
        }
        toast.error(errorMessage);
        console.error("Project fetch error:", errorMessage);
        return;
      }
      
      const data = await response.json();

      if (data.success) {
        setProject(data.data);
      } else {
        toast.error(data.message || "Failed to fetch project");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred while fetching project details";
      toast.error(errorMessage);
      console.error("Project fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    // Add explicit check for id before making API call
    if (!id) {
      console.error("Project ID missing, cannot delete.");
      toast.error("Cannot delete project: ID is missing.");
      setDeleteConfirmOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to delete project";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't valid JSON, use default error message
        }
        toast.error(errorMessage);
        console.error("Project deletion error:", errorMessage);
        setDeleteConfirmOpen(false);
        return;
      }
      
      const data = await response.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        router.push("/dashboard/projects");
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred while deleting the project";
      toast.error(errorMessage);
      console.error("Project deletion error:", err);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Please log in to view project details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link href="/dashboard/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === project.ownerId;
  const statusColorMap: Record<string, string> = {
    ACTIVE: "bg-green-500 hover:bg-green-600",
    COMPLETED: "bg-blue-500 hover:bg-blue-600",
    ARCHIVED: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center mt-2 gap-3">
            <Badge className={`${statusColorMap[project.status]} text-white`}>
              {project.status}
            </Badge>
            {project.dueDate && (
              <span className="text-sm text-muted-foreground flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Due {format(new Date(project.dueDate), "PPP")}
              </span>
            )}
            <span className="text-sm text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {project.members?.length || 0} members
            </span>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/projects/${id}/edit`}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="whitespace-pre-line">
                  {project.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Progress</h3>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="h-2 flex-1" />
                  <span className="text-sm">{project.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {format(new Date(project.createdAt), "PPP")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm">
                  {project.startDate 
                    ? format(new Date(project.startDate), "PPP")
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm">
                  {project.dueDate 
                    ? format(new Date(project.dueDate), "PPP")
                    : "Not set"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tasks</span>
                <span className="text-sm">{project.completedTaskCount}/{project.taskCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <span className="text-sm">{project.members?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Milestones</span>
                <span className="text-sm">{project.milestones?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks" className="flex gap-1">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="flex gap-1">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex gap-1">
            <Flag className="h-4 w-4" /> Milestones
          </TabsTrigger>
          <TabsTrigger value="files" className="flex gap-1">
            <FileText className="h-4 w-4" /> Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage tasks for this project</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/tasks/create?projectId=${id}`}>
                  Create Task
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {project.tasks && project.tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Title</th>
                        <th className="text-left py-2 px-4">Status</th>
                        <th className="text-left py-2 px-4">Assigned To</th>
                        <th className="text-left py-2 px-4">Due Date</th>
                        <th className="text-left py-2 px-4">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.tasks.map((task: any) => (
                        <tr key={task.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">
                            <Link 
                              href={`/dashboard/tasks/${task.id}`}
                              className="font-medium hover:underline"
                            >
                              {task.title}
                            </Link>
                          </td>
                          <td className="py-2 px-4">
                            <Badge variant="outline" className="capitalize">
                              {task.status.toLowerCase().replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-2 px-4">
                            {task.assignedTo || "Unassigned"}
                          </td>
                          <td className="py-2 px-4">
                            {task.dueDate ? format(new Date(task.dueDate), "PP") : "Not set"}
                          </td>
                          <td className="py-2 px-4 capitalize">
                            {task.priority.toLowerCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium mb-1">No tasks yet</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
                  <Button asChild>
                    <Link href={`/dashboard/tasks/create?projectId=${id}`}>
                      Create Task
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People working on this project</CardDescription>
              </div>
              {isOwner && (
                <Button>Add Team Member</Button>
              )}
            </CardHeader>
            <CardContent>
              {project.members && project.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.members.map((member: any) => (
                    <Card key={member.id} className="flex items-center p-4">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={member.profileImage} alt={member.name} />
                        <AvatarFallback>
                          {member.name?.charAt(0) || member.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name || member.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      {isOwner && member.userId !== user?.id && (
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium mb-1">No team members yet</h3>
                  <p className="text-muted-foreground mb-4">Add people to your project team</p>
                  {isOwner && (
                    <Button>Add Team Member</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Track important project milestones</CardDescription>
              </div>
              {isOwner && (
                <Button>Add Milestone</Button>
              )}
            </CardHeader>
            <CardContent>
              {project.milestones && project.milestones.length > 0 ? (
                <div className="space-y-4">
                  {project.milestones.map((milestone: any) => (
                    <Card key={milestone.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        </div>
                        <Badge variant={milestone.status === "COMPLETED" ? "default" : "outline"}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-4">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {milestone.dueDate 
                          ? format(new Date(milestone.dueDate), "PPP")
                          : "No due date"
                        }
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium mb-1">No milestones yet</h3>
                  <p className="text-muted-foreground mb-4">Define key objectives for your project</p>
                  {isOwner && (
                    <Button>Add Milestone</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Files & Documents</CardTitle>
                <CardDescription>Project related files and documentation</CardDescription>
              </div>
              <Button>Upload File</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="font-medium mb-1">No files uploaded yet</h3>
                <p className="text-muted-foreground mb-4">Share documents and files with your team</p>
                <Button>Upload File</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
