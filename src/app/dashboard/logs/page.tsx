import { Metadata } from "next"
import { ErrorLogsTable } from "@/components/error-logs-table"

export const metadata: Metadata = {
  title: "Error Logs",
  description: "View system error logs",
}

export default function ErrorLogsPage() {
  return (
    <div className="container mx-auto py-10">
      <ErrorLogsTable />
    </div>
  )
} 