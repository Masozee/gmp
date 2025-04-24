"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CheckCircle2, X, AlertCircle, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Review schema
const reviewSchema = z.object({
  reviewStatus: z.enum(["PENDING", "NEEDS_UPDATE", "ACCEPTED"]),
  reviewComment: z.string().optional(),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

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

interface TaskReviewProps {
  task: Task
  onReviewSubmit: (taskId: string, reviewData: ReviewFormValues) => Promise<void>
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TaskReview({
  task,
  onReviewSubmit,
  isOpen,
  onOpenChange,
}: TaskReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewStatus: task.reviewStatus || "PENDING",
      reviewComment: task.reviewComment || "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true)
    try {
      await onReviewSubmit(task.id, values)
      setDialogOpen(false)
      if (onOpenChange) {
        onOpenChange(false)
      }
      toast.success("Task review has been submitted successfully")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status badge color
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

  // Get status icon
  const getReviewStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="h-4 w-4" />
      case "NEEDS_UPDATE":
        return <X className="h-4 w-4" />
      case "ACCEPTED":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  // Controlled dialog state if isOpen and onOpenChange are provided
  const actualDialogOpen = isOpen !== undefined ? isOpen : dialogOpen
  const handleDialogOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setDialogOpen(open)
    }
  }

  return (
    <Dialog open={actualDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" /> Review Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Review Task</DialogTitle>
          <DialogDescription>
            Review the completed task and provide feedback
          </DialogDescription>
        </DialogHeader>

        {/* Task summary */}
        <Card className="border-none shadow-none">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge>{task.status.replace("_", " ")}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Assigned to:</span>
                <span className="text-sm">{task.assignedTo || "Not assigned"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current review status:</span>
                <Badge className={getReviewStatusColor(task.reviewStatus)}>
                  <span className="flex items-center gap-1">
                    {getReviewStatusIcon(task.reviewStatus)}
                    {task.reviewStatus.replace("_", " ")}
                  </span>
                </Badge>
              </div>
              {task.reviewDate && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Last reviewed:</span>
                  <span className="text-sm">
                    {format(new Date(task.reviewDate), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reviewStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a review status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending Review</SelectItem>
                      <SelectItem value="NEEDS_UPDATE">Needs Update</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your feedback or comments here..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
