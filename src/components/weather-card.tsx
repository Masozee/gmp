"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, CloudSun, Loader2 } from "lucide-react"

interface WeatherData {
  temperature: number
  condition: string
  location: string
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(null)
      } catch (err) {
        setError("Failed to fetch weather data")
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
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "partly cloudy":
        return <CloudSun className="h-8 w-8 text-blue-400" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <CloudSun className="h-8 w-8 text-blue-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 py-2">{error}</div>
    )
  }

  if (!weather) return null

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-2xl font-bold">{weather.temperature}°C</div>
        <div className="text-sm text-muted-foreground">{weather.location}</div>
      </div>
      <div className="flex items-center space-x-2">
        {getWeatherIcon(weather.condition)}
        <span className="text-sm text-muted-foreground">{weather.condition}</span>
      </div>
    </div>
  )
} 