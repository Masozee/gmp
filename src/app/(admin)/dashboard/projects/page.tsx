"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, LayoutGrid, List, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate?: string;
  dueDate?: string;
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
  progress: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      fetchProjects();
    }
  }, [isLoading, user, statusFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/projects";
      if (statusFilter !== "all") {
        url += `?status=${statusFilter}`;
      }
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to fetch projects";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't valid JSON, use default error message
        }
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.data || []);
      } else {
        setError(data.message || "Failed to fetch projects");
        toast.error(data.message || "Failed to fetch projects");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred while fetching projects";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Project fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
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
        return;
      }
      
      const data = await response.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectToDelete)
        );
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred while deleting the project";
      toast.error(errorMessage);
      console.error("Project delete error:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  const filteredProjects = searchTerm
    ? projects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Please log in to view projects</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Projects</CardTitle>
              <CardDescription>
                Manage and organize your projects
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/dashboard/projects/create")}>
              <Plus className="mr-1 h-4 w-4" /> New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? "Try a different search term" : "Create your first project"}
              </p>
              {!searchTerm && (
                <Button 
                  className="mt-4"
                  onClick={() => router.push("/dashboard/projects/create")}
                >
                  <Plus className="mr-1 h-4 w-4" /> Create Project
                </Button>
              )}
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      currentUserId={user?.id || ""}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Progress</th>
                        <th className="text-left p-2">Due Date</th>
                        <th className="text-left p-2">Members</th>
                        <th className="text-left p-2">Tasks</th>
                        <th className="text-right p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">
                            <a 
                              href={`/dashboard/projects/${project.id}`}
                              className="hover:underline"
                            >
                              {project.title}
                            </a>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="p-2 text-sm">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-2 text-sm">
                            {project.memberCount}
                          </td>
                          <td className="p-2 text-sm">
                            {project.completedTaskCount}/{project.taskCount}
                          </td>
                          <td className="p-2 text-right">
                            {project.ownerId === user?.id && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteClick(project.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
