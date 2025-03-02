import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This is a simple mock weather API response
    // In a real application, you would fetch from a weather API service
    const weatherData = {
      temperature: Math.floor(Math.random() * 15) + 10, // Random temperature between 10-25°C
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      location: "San Francisco",
      icon: ["sun", "cloud", "cloud-rain", "cloud-sun"][Math.floor(Math.random() * 4)],
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
} 