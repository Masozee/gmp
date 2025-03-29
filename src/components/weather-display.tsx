"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, CloudSun, Sun, Loader2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface WeatherData {
  temperature: number
  condition: string
  location: string
  icon: string
}

export function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/weather")
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        
        const data = await response.json()
        setWeather(data)
      } catch (err) {
        setError("Could not load weather")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-4 w-4" />
    
    switch (weather.icon) {
      case "sun":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "cloud-rain":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      case "cloud-sun":
        return <CloudSun className="h-4 w-4 text-yellow-400" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    )
  }

  if (error) {
    return <span className="text-xs text-muted-foreground">Weather unavailable</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      {getWeatherIcon()}
      <span className="text-xs font-medium">
        {weather?.temperature}°C
      </span>
    </div>
  )
} 