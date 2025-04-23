"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, BarChart } from "lucide-react"
import { isPast } from "date-fns"

interface TaskStats {
  total: number
  inProgress: number
  completed: number
  overdue: number
}

export function TaskStats() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      try {
        // Fetch all tasks
        const response = await fetch('/api/tasks')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        
        const data = await response.json()
        const tasks = data.tasks || []
        
        // Calculate stats
        const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length
        const completed = tasks.filter(task => task.status === 'COMPLETED').length
        
        // Calculate overdue tasks (due date is in the past and not completed)
        const overdue = tasks.filter(task => {
          if (!task.dueDate || task.status === 'COMPLETED') return false
          return isPast(new Date(task.dueDate))
        }).length
        
        setStats({
          total: tasks.length,
          inProgress,
          completed,
          overdue
        })
      } catch (error) {
        console.error('Error fetching task stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
        <CardDescription>
          Status of all tasks in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="flex justify-center py-4">Loading task statistics...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs font-medium">Total Tasks</div>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="text-xs font-medium">In Progress</div>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats.inProgress}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="text-xs font-medium">Completed</div>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats.completed}</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div className="text-xs font-medium">Overdue</div>
              </div>
              <div className="mt-1 text-2xl font-bold">{stats.overdue}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 