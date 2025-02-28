/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { DashboardRightSidebar } from "../dashboard-right-sidebar"
import { format } from "date-fns"
import { act } from "react"

// Mock lucide-react
jest.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="chevron-left" />,
  ChevronRight: () => <div data-testid="chevron-right" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Cloud: () => <div data-testid="cloud-icon" />,
}))

// Mock react-day-picker
jest.mock("react-day-picker", () => ({
  DayPicker: () => <div data-testid="day-picker" />,
}))

// Mock WeatherCard component
jest.mock("../weather-card", () => ({
  WeatherCard: () => <div data-testid="weather-card">Weather</div>,
}))

// Mock shadcn components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe("DashboardRightSidebar", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn()
  })

  it("renders weather card and calendar", async () => {
    // Mock a successful but empty response
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )

    render(<DashboardRightSidebar />)
    
    expect(screen.getByTestId("weather-card")).toBeInTheDocument()
    expect(screen.getByText("Calendar")).toBeInTheDocument()
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument()
  })

  it("shows loading state initially", async () => {
    // Don't resolve the fetch promise immediately
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve([])
          })
        }, 100)
      })
    )

    render(<DashboardRightSidebar />)
    
    // Check for loading state immediately after render
    expect(screen.getAllByText("Loading...")).toHaveLength(3)
  })

  it("handles non-array response data", async () => {
    // Mock an invalid response
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events: "invalid" })
      })
    )

    render(<DashboardRightSidebar />)

    await waitFor(() => {
      expect(screen.getAllByText("No events scheduled")).toHaveLength(3)
    })
  })

  it("handles invalid date in event data", async () => {
    const mockEvents = [
      {
        id: "1",
        title: "Test Event 1",
        startDate: "invalid-date",
        endDate: "invalid-date",
        status: "UPCOMING"
      }
    ]

    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents)
      })
    )

    render(<DashboardRightSidebar />)

    await waitFor(() => {
      expect(screen.getAllByText("No events scheduled")).toHaveLength(3)
    })
  })

  it("fetches and displays events", async () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const mockEvents = [
      {
        id: "1",
        title: "Today's Event",
        startDate: today.toISOString(),
        endDate: today.toISOString(),
        status: "UPCOMING"
      },
      {
        id: "2",
        title: "Tomorrow's Event",
        startDate: tomorrow.toISOString(),
        endDate: tomorrow.toISOString(),
        status: "UPCOMING"
      }
    ]

    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents)
      })
    )

    render(<DashboardRightSidebar />)

    await waitFor(() => {
      // Check for events in the upcoming events section
      const todaySection = screen.getByText("Today").parentElement
      expect(todaySection).toHaveTextContent("Today's Event")

      const tomorrowSection = screen.getByText("Tomorrow").parentElement
      expect(tomorrowSection).toHaveTextContent("Tomorrow's Event")
    })
  })

  it("handles fetch errors gracefully", async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch"))
    )

    render(<DashboardRightSidebar />)

    await waitFor(() => {
      expect(screen.getAllByText("No events scheduled")).toHaveLength(3)
    })
  })
}) 