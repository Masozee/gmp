"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, CloudSun, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherData {
  temperature: number
  condition: string
  location: string
}

export function WeatherCompact() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // For testing purposes, we'll use a mock response
        // In production, you would replace this with a real API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setWeather({
          temperature: 22,
          condition: "Partly Cloudy",
          location: "San Francisco"
        })
      } catch (err) {
        console.error("Error fetching weather:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-4 w-4" />
      case "partly cloudy":
        return <CloudSun className="h-4 w-4" />
      case "cloudy":
        return <Cloud className="h-4 w-4" />
      case "rainy":
        return <CloudRain className="h-4 w-4" />
      default:
        return <CloudSun className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-auto px-3 flex gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!weather) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-auto px-3 flex gap-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-sm">{weather.temperature}°C</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>{weather.location}</span>
            <span>·</span>
            <span>{weather.condition}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 