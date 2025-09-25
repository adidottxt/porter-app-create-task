import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        primary: 'border-primary',
        secondary: 'border-muted-foreground',
        accent: 'border-accent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export function Spinner({ size, variant, className }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant }), className)}
      role='status'
      aria-label='Loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
