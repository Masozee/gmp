"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// Define a User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the form schema with Zod
const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED"], {
    required_error: "Please select a status.",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Please select a priority.",
  }),
  dueDate: z.date().optional(),
  // Person who will perform the task (Person B)
  assignedTo: z.string().optional(),
  agentId: z.string().optional(),
  tags: z.string().optional(),
  // Shared files (comma-separated URLs or file paths)
  sharedFiles: z.string().optional(),
})

// Infer the types from the schema
type TaskFormValues = z.infer<typeof taskFormSchema>

// Default values for the form
const defaultValues: Partial<TaskFormValues> = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assignedTo: "",
  tags: "",
  sharedFiles: "",
}

interface TaskFormProps {
  initialData?: Partial<TaskFormValues>
  onSubmit: (data: TaskFormValues) => void
  onCancel?: () => void
  isSubmitting?: boolean
  hideButtons?: boolean
}

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  hideButtons = false,
}: TaskFormProps) {
  // State for users search
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // Fetch users for assignment dropdown
  useEffect(() => {
    async function fetchUsers() {
      if (!debouncedSearch && debouncedSearch !== "") return;
      
      setIsLoadingUsers(true);
      try {
        const response = await fetch(`/api/users/list${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ""}`);  
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    
    fetchUsers();
  }, [debouncedSearch]);
  // Initialize the form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  })

  // Handle form submission
  const handleSubmit = async (values: TaskFormValues) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task title" {...field} />
                </FormControl>
                <FormDescription>
                  A clear and concise title for the task.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The priority level of this task.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The current status of this task.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-full pl-3 text-left font-normal"}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When this task should be completed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the task"
                  {...field}
                  value={field.value || ""}
                  className="min-h-32"
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of what this task involves.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Assign To (Person B)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between text-left font-normal"
                      >
                        {field.value ? (
                          <span className="truncate">
                            {users.find(user => String(user.id) === field.value)
                              ? (users.find(user => String(user.id) === field.value)?.name || 
                                 users.find(user => String(user.id) === field.value)?.email)
                              : "Select a user to assign"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Select a user to assign</span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput 
                          placeholder="Search users..." 
                          className="h-9"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            type="button"
                            className="h-8 px-2"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <CommandList>
                        <CommandEmpty className="py-6 text-center text-sm">
                          {isLoadingUsers ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-4 w-4 animate-spin mb-2" />
                              <span>Loading users...</span>
                            </div>
                          ) : (
                            "No users found."
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={() => {
                                // Ensure user ID is always treated as a string
                                const stringId = String(user.id);
                                field.onChange(stringId === field.value ? "" : stringId);
                              }}
                              className="flex items-center space-x-2 p-2"
                            >
                              <Checkbox
                                checked={field.value === String(user.id)}
                                className="mr-2"
                                id={`user-${user.id}`}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{user.name || "Unnamed user"}</div>
                                <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                              </div>
                              {field.value === String(user.id) && (
                                <Check className="ml-auto h-4 w-4 text-primary" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The person who will be responsible for completing this task.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated tags" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Add tags separated by commas (e.g., "urgent, documentation, bug").
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>









        <FormField
          control={form.control}
          name="sharedFiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shared Files</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Comma-separated file URLs or paths"
                  {...field} 
                  value={field.value || ""}
                  className="min-h-20"
                />
              </FormControl>
              <FormDescription>
                Add URLs or file paths separated by commas to share with assignee.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hideButtons && (
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData?.title ? "Update Task" : "Create Task"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
} 