"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, Clock, Users, CheckSquare, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
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
  };
  currentUserId: string;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500 hover:bg-green-600";
    case "COMPLETED":
      return "bg-blue-500 hover:bg-blue-600";
    case "ARCHIVED":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
};

export function ProjectCard({ project, currentUserId, onDelete }: ProjectCardProps) {
  const isOwner = project.ownerId === currentUserId;
  const formattedDate = project.dueDate 
    ? formatDistanceToNow(new Date(project.dueDate), { addSuffix: true }) 
    : "No due date";

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div className="flex-1">
          <Link href={`/dashboard/projects/${project.id}`} passHref>
            <h3 className="text-xl font-semibold mb-1 hover:underline">{project.title}</h3>
          </Link>
          <Badge 
            className={`${getStatusColor(project.status)} text-white`}
          >
            {project.status}
          </Badge>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${project.id}/edit`}>
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onDelete(project.id)}
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          {project.description ? (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {project.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm italic">No description</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" /> 
                <span>{project.memberCount} Members</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project team members</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckSquare className="h-4 w-4 mr-1" /> 
                <span>{project.completedTaskCount}/{project.taskCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Completed tasks</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between border-t text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
        </div>
        
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>Due {formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
