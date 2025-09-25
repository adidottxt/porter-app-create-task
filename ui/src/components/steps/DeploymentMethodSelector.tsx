'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { GitBranch, Container } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { FormData } from '../../types/form.types'

export function DeploymentMethodSelector() {
  const { control, setValue } = useFormContext<FormData>()

  const deploymentMethods = [
    {
      id: 'git' as const,
      title: 'Git Repository',
      description:
        'Deploy directly from your Git repository (GitHub, GitLab, etc.)',
      icon: GitBranch,
      available: true,
      recommended: true,
    },
    {
      id: 'docker' as const,
      title: 'Docker Registry',
      description: 'Deploy pre-built Docker images from a registry',
      icon: Container,
      available: false,
      recommended: false,
    },
  ]

  return (
    <div className='space-y-4'>
      <Controller
        name='sourceConfig.deploymentMethod'
        control={control}
        render={({ field }) => (
          <div className='space-y-3'>
            {deploymentMethods.map(method => (
              <motion.div
                key={method.id}
                className={`relative border rounded-lg p-4 cursor-pointer ${
                  !method.available
                    ? 'border-[var(--nordic-gray-700)] bg-[var(--nordic-gray-900)] opacity-60 cursor-not-allowed'
                    : field.value === method.id
                      ? 'border-[var(--magic-blue-500)] bg-[var(--magic-blue-500)]/10'
                      : 'border-[var(--nordic-gray-700)] bg-[var(--nordic-gray-900)]'
                }`}
                animate={{
                  opacity: !method.available
                    ? 0.6
                    : field.value === method.id
                      ? 1
                      : 0.8,
                }}
                transition={{
                  duration: 0.2,
                  ease: 'easeIn',
                }}
                onClick={() => {
                  if (method.available) {
                    if (field.value === method.id) {
                      // Unselect if already selected
                      field.onChange('')
                      setValue('sourceConfig.deploymentMethod', '')
                    } else {
                      // Select the method
                      field.onChange(method.id)
                      setValue('sourceConfig.deploymentMethod', method.id)
                    }
                  }
                }}
              >
                {/* Selection Indicator */}
                <div className='absolute top-4 right-4'>
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      field.value === method.id && method.available
                        ? 'border-[var(--magic-blue-500)] bg-[var(--magic-blue-500)]'
                        : 'border-[var(--nordic-gray-500)] bg-transparent'
                    }`}
                  >
                    {field.value === method.id && method.available && (
                      <div className='w-full h-full rounded-full bg-white scale-50' />
                    )}
                  </div>
                </div>

                <div className='flex items-start space-x-3 pr-8'>
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      method.available
                        ? field.value === method.id
                          ? 'bg-[var(--magic-blue-500)]/20'
                          : 'bg-[var(--nordic-gray-600)]'
                        : 'bg-[var(--nordic-gray-600)]/50'
                    }`}
                  >
                    <method.icon
                      className={`w-4 h-4 ${
                        method.available
                          ? field.value === method.id
                            ? 'text-[var(--magic-blue-500)]'
                            : 'text-[var(--nordic-gray-300)]'
                          : 'text-[var(--nordic-gray-500)]'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      <h4
                        className={`text-sm font-medium ${
                          method.available
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {method.title}
                      </h4>
                      {method.recommended && (
                        <Badge className='bg-[var(--forest-green-500)]/20 text-[var(--forest-green-300)] border-[var(--forest-green-500)]/40 font-mono'>
                          Recommended
                        </Badge>
                      )}
                      {!method.available && (
                        <Badge
                          variant='outline'
                          className='bg-[var(--nordic-gray-600)] text-[var(--nordic-gray-300)] border-[var(--nordic-gray-600)] font-mono'
                        >
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        method.available
                          ? 'text-muted-foreground'
                          : 'text-[var(--nordic-gray-500)]'
                      }`}
                    >
                      {method.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      />
    </div>
  )
}
