'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { FormData } from '../../types/form.types'

export function Step1ApplicationSetup() {
  const {
    control,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<FormData>()

  const isMonorepo = watch('isMonorepo')

  return (
    <div className='max-w-6xl mx-auto pr-8 py-4'>
      <div className='max-w-2xl'>
        <div className='space-y-3'>
          <div>
            <Label
              htmlFor='applicationName'
              className='text-sm font-medium text-foreground gap-0.5'
            >
              Application Name
              <span className='text-[var(--crimson-red-500)]'>*</span>
            </Label>
            <p className='text-xs text-muted-foreground mt-1 mb-2'>
              Lowercase letters, numbers, and &quot;-&quot; only. 31 character
              limit.
            </p>
            <Controller
              name='applicationName'
              control={control}
              rules={{
                required: 'Application name is required',
                minLength: {
                  value: 2,
                  message: 'Application name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Application name cannot exceed 50 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9]([a-zA-Z0-9\-_]*[a-zA-Z0-9])?$/,
                  message:
                    'Application name can only contain letters, numbers, hyphens, and underscores. Must start and end with alphanumeric characters.',
                },
              }}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    onChange={async e => {
                      field.onChange(e.target.value)
                      await trigger('applicationName')
                    }}
                    id='applicationName'
                    placeholder='my-awesome-app'
                    className={`
                      bg-[var(--nordic-gray-900)]
                      border-[var(--nordic-gray-700)]
                      text-foreground
                      placeholder:text-muted-foreground
                      focus:border-[var(--magic-blue-500)]
                      focus:ring-[var(--magic-blue-500)]/20
                      ${errors.applicationName ? 'border-[var(--crimson-red-500)] focus:border-[var(--crimson-red-500)] focus:ring-[var(--crimson-red-500)]/20' : ''}
                    `}
                    aria-describedby={
                      errors.applicationName
                        ? 'applicationName-error'
                        : undefined
                    }
                  />
                  <div className='h-6 mt-2'>
                    <AnimatePresence>
                      {errors.applicationName && (
                        <motion.div
                          id='applicationName-error'
                          className='flex items-center gap-1.5 text-[var(--crimson-red-500)] text-xs'
                          role='alert'
                          initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                          transition={{ duration: 0.15, ease: 'easeInOut' }}
                        >
                          <AlertTriangle className='h-3 w-3' />
                          <span>{errors.applicationName.message}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Monorepo Checkbox */}
          <div className='mt-3'>
            <Controller
              name='isMonorepo'
              control={control}
              render={({ field }) => (
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='isMonorepo'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
                  />
                  <Label
                    htmlFor='isMonorepo'
                    className='text-sm font-medium text-foreground cursor-pointer'
                  >
                    Are you trying to deploy a monorepo?
                  </Label>
                </div>
              )}
            />
          </div>

          {/* Monorepo Warning Alert */}
          <div className='min-h-[80px] mt-2'>
            <AnimatePresence>
              {isMonorepo && (
                <motion.div
                  initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                >
                  <Alert className='border-[var(--golden-amber-500)] bg-[var(--golden-amber-500)]/10'>
                    <AlertCircle
                      className='h-4 w-4'
                      style={{ color: 'var(--golden-amber-100)' }}
                    />
                    <AlertDescription className='text-[var(--golden-amber-100)]'>
                      Porter apps cannot deploy monorepos as a single app.
                      Please build each part of the monorepo as its own app.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
