import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Return Home
      </Link>
    </div>
  )
} 