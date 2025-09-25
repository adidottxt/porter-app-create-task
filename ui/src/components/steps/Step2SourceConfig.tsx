'use client'

import { useFormContext } from 'react-hook-form'
import { Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DeploymentMethodSelector } from './DeploymentMethodSelector'
import { GitRepositorySelector } from './GitRepositorySelector'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { FormData } from '../../types/form.types'

export function Step2SourceConfig() {
  const { watch } = useFormContext<FormData>()

  const deploymentMethod = watch('sourceConfig.deploymentMethod')

  return (
    <div className='max-w-6xl mx-auto pr-8 py-4'>
      <div className='max-w-2xl'>
        <div className='space-y-6'>
          {/* Deployment Method Selection */}
          <div>
            <DeploymentMethodSelector />
          </div>

          {/* Git Configuration Section with Fixed Height */}
          <div className='min-h-[240px]'>
            <AnimatePresence>
              {deploymentMethod === 'git' && (
                <motion.div
                  className='space-y-4'
                  initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <div>
                    <h4 className='text-base font-medium text-foreground mb-2'>
                      Git Repository Configuration
                    </h4>
                    <div className='flex items-center gap-2 mb-4'>
                      <p className='text-sm text-muted-foreground'>
                        Connect your Git repository to deploy your code
                        automatically.
                      </p>
                      <TooltipPrimitive.Provider delayDuration={0}>
                        <TooltipPrimitive.Root>
                          <TooltipPrimitive.Trigger asChild>
                            <Info className='h-4 w-4 text-[var(--nordic-gray-400)] hover:text-[var(--magic-blue-500)] cursor-pointer transition-colors' />
                          </TooltipPrimitive.Trigger>
                          <TooltipPrimitive.Portal>
                            <TooltipPrimitive.Content
                              className='z-50 max-w-xs rounded-md bg-[var(--nordic-gray-900)] px-3 py-2 text-sm text-foreground shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                              sideOffset={8}
                            >
                              <p className='text-sm'>
                                Porter will automatically build and deploy your
                                code whenever you push to your selected branch.
                                This includes dependency installation, build
                                processes, and deployment orchestration.
                              </p>
                            </TooltipPrimitive.Content>
                          </TooltipPrimitive.Portal>
                        </TooltipPrimitive.Root>
                      </TooltipPrimitive.Provider>
                    </div>
                  </div>

                  <div className='rounded-lg p-6 bg-[var(--nordic-gray-900)]'>
                    <GitRepositorySelector />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Docker Configuration Section (Disabled) */}
          {deploymentMethod === 'docker' && (
            <div className='space-y-4'>
              <div className='border border-dashed border-[var(--nordic-gray-600)] rounded-lg p-6 bg-[var(--nordic-gray-700)]/30 opacity-60'>
                <h4 className='text-base font-medium text-foreground mb-2'>
                  Docker Registry Configuration
                </h4>
                <p className='text-sm text-muted-foreground'>
                  Docker registry deployment is currently not available. Please
                  use Git deployment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
