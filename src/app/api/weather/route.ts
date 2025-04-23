import { NextRequest, NextResponse } from "next/server"

// Mock weather data (replace with actual API integration in production)
const weatherConditions = [
  { condition: "Clear", icon: "sun", minTemp: 20, maxTemp: 35 },
  { condition: "Partly Cloudy", icon: "cloud-sun", minTemp: 15, maxTemp: 28 },
  { condition: "Cloudy", icon: "cloud", minTemp: 10, maxTemp: 25 },
  { condition: "Rainy", icon: "cloud-rain", minTemp: 8, maxTemp: 20 }
]

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we're not requiring authentication for weather data
    // In a production application, you would use the user's location or IP
    // to get their local weather from a weather API service
    
    // Generate random weather data
    const randomIndex = Math.floor(Math.random() * weatherConditions.length)
    const weather = weatherConditions[randomIndex]
    
    // Generate a random temperature within the range
    const temperature = Math.floor(
      Math.random() * (weather.maxTemp - weather.minTemp) + weather.minTemp
    )

    return NextResponse.json({
      temperature,
      condition: weather.condition,
      location: "San Francisco, CA", // Mock location
      icon: weather.icon
    })
  } catch (error) {
    console.error("Failed to fetch weather:", error)
    
    // Even on error, return a fallback response
    return NextResponse.json({
      temperature: 22,
      condition: "Clear",
      location: "San Francisco, CA",
      icon: "sun"
    })
  }
} 