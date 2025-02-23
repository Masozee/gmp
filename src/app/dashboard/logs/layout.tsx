import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Error Logs",
  description: "View system error logs",
}

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 