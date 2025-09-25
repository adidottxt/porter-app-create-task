import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  className?: string
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 rounded-lg bg-[var(--nordic-gray-900)] text-center',
        className
      )}
    >
      <h3 className='text-lg font-medium text-card-foreground mb-2'>{title}</h3>
      <p className='text-muted-foreground text-sm max-w-md'>{description}</p>
    </div>
  )
}
