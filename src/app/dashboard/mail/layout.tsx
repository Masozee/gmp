import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mail Management",
  description: "Manage your organization's physical mail",
}

export default function MailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 