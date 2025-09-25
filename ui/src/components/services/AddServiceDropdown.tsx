'use client'

import { Plus, Globe, Cpu, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ServiceConfig } from '../../types/form.types'

interface AddServiceDropdownProps {
  onAddService: (type: ServiceConfig['type']) => void
}

const serviceTypes = [
  {
    type: 'web' as const,
    label: 'Web Service',
    description: 'HTTP API, web server, or frontend application',
    icon: Globe,
  },
  {
    type: 'worker' as const,
    label: 'Worker',
    description: 'Background processes and queue workers',
    icon: Cpu,
  },
  {
    type: 'job' as const,
    label: 'Cron Job',
    description: 'Scheduled tasks and batch jobs',
    icon: Clock,
  },
]

export function AddServiceDropdown({ onAddService }: AddServiceDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='primary' size='sm' className='gap-1.5'>
          <Plus className='w-4 h-4' />
          Add Service
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-[280px] bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'
      >
        {serviceTypes.map(service => {
          const Icon = service.icon
          return (
            <DropdownMenuItem
              key={service.type}
              className='py-3 px-3 focus:bg-[var(--nordic-gray-800)] hover:bg-[var(--nordic-gray-800)] cursor-pointer'
              onClick={() => onAddService(service.type)}
            >
              <div className='flex items-start gap-3 w-full'>
                <div className='mt-0.5 p-1.5 rounded-md bg-[var(--magic-blue-500)]/10'>
                  <Icon className='w-4 h-4 text-[var(--magic-blue-500)]' />
                </div>
                <div className='flex flex-col gap-1 flex-1'>
                  <span className='font-medium text-foreground text-sm'>
                    {service.label}
                  </span>
                  <span className='text-xs text-muted-foreground leading-relaxed'>
                    {service.description}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
