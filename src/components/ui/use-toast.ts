// Copied from https://ui.shadcn.com/docs/components/toast
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
    duration = 3000,
    ...props
  }: ToastProps) => {
    return sonnerToast(title || description || "", {
      description: title ? description : undefined,
      duration,
      className: variant === "destructive" ? "destructive" : "",
      ...props,
    })
  }

  return { toast }
}

export { toast } from "sonner"