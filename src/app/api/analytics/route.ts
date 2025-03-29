import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { addDays, format, subDays, subMonths } from "date-fns"

// Generate random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate random data for the past n days
const generateDailyData = (days: number) => {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    data.push({
      date: format(date, "yyyy-MM-dd"),
      visitors: randomNumber(500, 2500),
      pageViews: randomNumber(1500, 7500),
      bounceRate: randomNumber(20, 65),
      avgSessionDuration: randomNumber(60, 300),
      newUsers: randomNumber(200, 1200),
    })
  }
  
  return data
}

// Generate random data for traffic sources
const generateTrafficSources = () => {
  return [
    { source: "Direct", visitors: randomNumber(5000, 15000), percentage: randomNumber(25, 40) },
    { source: "Organic Search", visitors: randomNumber(4000, 12000), percentage: randomNumber(20, 35) },
    { source: "Social Media", visitors: randomNumber(2000, 8000), percentage: randomNumber(10, 25) },
    { source: "Referral", visitors: randomNumber(1000, 5000), percentage: randomNumber(5, 15) },
    { source: "Email", visitors: randomNumber(500, 3000), percentage: randomNumber(3, 10) },
    { source: "Other", visitors: randomNumber(200, 1000), percentage: randomNumber(1, 5) },
  ]
}

// Generate random data for device categories
const generateDeviceCategories = () => {
  return [
    { device: "Desktop", visitors: randomNumber(10000, 25000), percentage: randomNumber(40, 60) },
    { device: "Mobile", visitors: randomNumber(8000, 20000), percentage: randomNumber(30, 50) },
    { device: "Tablet", visitors: randomNumber(1000, 5000), percentage: randomNumber(5, 15) },
  ]
}

// Generate random data for top pages
const generateTopPages = async () => {
  try {
    // Try to fetch real event titles from the database using raw SQL
    const events = await sqlite.all<{ title: string }>(
      `SELECT title FROM events ORDER BY createdAt DESC LIMIT 5`
    );
    
    const topPages = [
      { path: "/", title: "Home Page", pageViews: randomNumber(5000, 15000), avgTimeOnPage: randomNumber(60, 180) },
      { path: "/dashboard", title: "Dashboard", pageViews: randomNumber(3000, 10000), avgTimeOnPage: randomNumber(120, 300) },
      { path: "/dashboard/events", title: "Events List", pageViews: randomNumber(2000, 8000), avgTimeOnPage: randomNumber(90, 240) },
    ]
    
    // Add real event pages if available
    if (events && events.length > 0) {
      events.forEach((event, index) => {
        topPages.push({
          path: `/events/${index + 1}`,
          title: event.title,
          pageViews: randomNumber(1000, 5000),
          avgTimeOnPage: randomNumber(60, 240)
        })
      })
    } else {
      // Add dummy event pages if no real events
      topPages.push(
        { path: "/events/1", title: "AI and Machine Learning Workshop", pageViews: randomNumber(1000, 5000), avgTimeOnPage: randomNumber(60, 240) },
        { path: "/events/2", title: "Deep Learning Conference 2025", pageViews: randomNumber(800, 4000), avgTimeOnPage: randomNumber(60, 240) },
        { path: "/events/3", title: "Data Science Symposium", pageViews: randomNumber(600, 3000), avgTimeOnPage: randomNumber(60, 240) },
        { path: "/events/4", title: "Blockchain Technology Summit", pageViews: randomNumber(400, 2000), avgTimeOnPage: randomNumber(60, 240) }
      )
    }
    
    return topPages
  } catch (error) {
    console.error("Error fetching event titles:", error)
    // Return dummy data if there's an error
    return [
      { path: "/", title: "Home Page", pageViews: randomNumber(5000, 15000), avgTimeOnPage: randomNumber(60, 180) },
      { path: "/dashboard", title: "Dashboard", pageViews: randomNumber(3000, 10000), avgTimeOnPage: randomNumber(120, 300) },
      { path: "/dashboard/events", title: "Events List", pageViews: randomNumber(2000, 8000), avgTimeOnPage: randomNumber(90, 240) },
      { path: "/events/1", title: "AI and Machine Learning Workshop", pageViews: randomNumber(1000, 5000), avgTimeOnPage: randomNumber(60, 240) },
      { path: "/events/2", title: "Deep Learning Conference 2025", pageViews: randomNumber(800, 4000), avgTimeOnPage: randomNumber(60, 240) },
      { path: "/events/3", title: "Data Science Symposium", pageViews: randomNumber(600, 3000), avgTimeOnPage: randomNumber(60, 240) },
      { path: "/events/4", title: "Blockchain Technology Summit", pageViews: randomNumber(400, 2000), avgTimeOnPage: randomNumber(60, 240) }
    ]
  }
}

// Generate random data for event engagement
const generateEventEngagement = async () => {
  try {
    // Try to fetch real event data from the database using raw SQL
    const events = await sqlite.all<{ id: string, title: string, status: string }>(
      `SELECT id, title, status FROM events ORDER BY startDate DESC LIMIT 10`
    );
    
    if (events && events.length > 0) {
      return events.map(event => ({
        id: event.id,
        title: event.title,
        status: event.status,
        views: randomNumber(500, 5000),
        registrations: randomNumber(50, 500),
        conversionRate: randomNumber(5, 25),
        shareCount: randomNumber(10, 200)
      }))
    } else {
      // Return dummy data if no events found
      return [
        { id: "1", title: "AI and Machine Learning Workshop", status: "UPCOMING", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
        { id: "2", title: "Deep Learning Conference 2025", status: "UPCOMING", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
        { id: "3", title: "Data Science Symposium", status: "COMPLETED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
        { id: "4", title: "Blockchain Technology Summit", status: "CANCELLED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
        { id: "5", title: "Web Development Bootcamp", status: "COMPLETED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) }
      ]
    }
  } catch (error) {
    console.error("Error fetching event data:", error)
    // Return dummy data if there's an error
    return [
      { id: "1", title: "AI and Machine Learning Workshop", status: "UPCOMING", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
      { id: "2", title: "Deep Learning Conference 2025", status: "UPCOMING", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
      { id: "3", title: "Data Science Symposium", status: "COMPLETED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
      { id: "4", title: "Blockchain Technology Summit", status: "CANCELLED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) },
      { id: "5", title: "Web Development Bootcamp", status: "COMPLETED", views: randomNumber(500, 5000), registrations: randomNumber(50, 500), conversionRate: randomNumber(5, 25), shareCount: randomNumber(10, 200) }
    ]
  }
}

// Generate monthly comparison data
const generateMonthlyComparison = () => {
  const currentMonth = new Date()
  const previousMonth = subMonths(currentMonth, 1)
  
  return {
    current: {
      month: format(currentMonth, "MMMM"),
      visitors: randomNumber(30000, 80000),
      pageViews: randomNumber(100000, 250000),
      avgSessionDuration: randomNumber(120, 300),
      bounceRate: randomNumber(30, 60)
    },
    previous: {
      month: format(previousMonth, "MMMM"),
      visitors: randomNumber(25000, 70000),
      pageViews: randomNumber(80000, 200000),
      avgSessionDuration: randomNumber(100, 280),
      bounceRate: randomNumber(35, 65)
    }
  }
}

// Generate geographic data
const generateGeographicData = () => {
  return [
    { country: "United States", visitors: randomNumber(10000, 30000), percentage: randomNumber(25, 40) },
    { country: "United Kingdom", visitors: randomNumber(5000, 15000), percentage: randomNumber(10, 20) },
    { country: "Germany", visitors: randomNumber(3000, 10000), percentage: randomNumber(8, 15) },
    { country: "Canada", visitors: randomNumber(2000, 8000), percentage: randomNumber(5, 12) },
    { country: "Australia", visitors: randomNumber(1500, 6000), percentage: randomNumber(4, 10) },
    { country: "France", visitors: randomNumber(1000, 5000), percentage: randomNumber(3, 8) },
    { country: "Japan", visitors: randomNumber(800, 4000), percentage: randomNumber(2, 7) },
    { country: "India", visitors: randomNumber(500, 3000), percentage: randomNumber(1, 5) },
    { country: "Brazil", visitors: randomNumber(300, 2000), percentage: randomNumber(1, 4) },
    { country: "Other", visitors: randomNumber(1000, 5000), percentage: randomNumber(3, 10) }
  ]
}

// Cache results for better performance 
// This avoids generating random data on every request
let cachedAnalytics: { [key: string]: any } = {};
let cacheTime: { [key: string]: number } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "30d"
    
    // Check cache first
    const now = Date.now();
    if (cachedAnalytics[period] && cacheTime[period] && (now - cacheTime[period] < CACHE_TTL)) {
      console.log("Returning cached analytics data for period:", period);
      return NextResponse.json(cachedAnalytics[period]);
    }
    
    let days = 30
    switch (period) {
      case "7d":
        days = 7
        break
      case "14d":
        days = 14
        break
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
    }
    
    console.log("Generating fresh analytics data for period:", period);
    
    const [dailyData, trafficSources, deviceCategories, topPages, eventEngagement, monthlyComparison, geographicData] = await Promise.all([
      generateDailyData(days),
      generateTrafficSources(),
      generateDeviceCategories(),
      generateTopPages(),
      generateEventEngagement(),
      generateMonthlyComparison(),
      generateGeographicData()
    ])
    
    // Calculate summary metrics
    const totalVisitors = dailyData.reduce((sum, day) => sum + day.visitors, 0)
    const totalPageViews = dailyData.reduce((sum, day) => sum + day.pageViews, 0)
    const avgBounceRate = Math.round(dailyData.reduce((sum, day) => sum + day.bounceRate, 0) / dailyData.length)
    const avgSessionDuration = Math.round(dailyData.reduce((sum, day) => sum + day.avgSessionDuration, 0) / dailyData.length)
    const totalNewUsers = dailyData.reduce((sum, day) => sum + day.newUsers, 0)
    
    const result = {
      summary: {
        totalVisitors,
        totalPageViews,
        avgBounceRate,
        avgSessionDuration,
        totalNewUsers
      },
      dailyData,
      trafficSources,
      deviceCategories,
      topPages,
      eventEngagement,
      monthlyComparison,
      geographicData
    };
    
    // Save to cache
    cachedAnalytics[period] = result;
    cacheTime[period] = now;
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to generate analytics data:", error)
    return NextResponse.json(
      { error: "Failed to generate analytics data" },
      { status: 500 }
    )
  }
} 