import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/images/logo/logo.png"
              alt="Yayasan Partisipasi Muda"
              width={32}
              height={32}
              className="rounded-md"
            />
            Yayasan Partisipasi Muda
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg"
          alt="Login Background Image"
          fill
          style={{ objectFit: 'cover' }}
          className="dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
