'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Play, Terminal } from 'lucide-react'
import type { FormData } from '../../types/form.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function PreDeployJobs() {
  const { control, watch } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'optionalConfig.preDeployJobs',
  })

  const preDeployJobs = watch('optionalConfig.preDeployJobs')

  const addPreDeployJob = () => {
    append({ name: '', command: '' })
  }

  const removePreDeployJob = (index: number) => {
    remove(index)
  }

  return (
    <div className='p-6 rounded-lg bg-[var(--nordic-gray-900)]'>
      <div className='space-y-4'>
        {/* Pre-Deploy Jobs List */}
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='space-y-3 p-4 border-[var(--nordic-gray-800)] border rounded-lg'
            >
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium text-foreground'>
                  Pre-Deploy Job {index + 1}
                </h4>
                <Button
                  type='button'
                  variant='minimal'
                  size='sm'
                  onClick={() => removePreDeployJob(index)}
                  className='p-2 text-muted-foreground hover:text-[var(--crimson-red-500)] hover:bg-[var(--crimson-red-500)]/10'
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Remove job {index + 1}</span>
                </Button>
              </div>

              <div className='space-y-2'>
                <div>
                  <Label
                    htmlFor={`job-name-${index}`}
                    className='text-sm font-medium'
                  >
                    Job Name
                  </Label>
                  <Input
                    id={`job-name-${index}`}
                    placeholder='e.g., database-migration, build-assets'
                    {...control.register(
                      `optionalConfig.preDeployJobs.${index}.name`
                    )}
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`job-command-${index}`}
                    className='text-sm font-medium'
                  >
                    Command
                  </Label>
                  <Input
                    id={`job-command-${index}`}
                    placeholder='e.g., npm run migrate, python manage.py migrate'
                    {...control.register(
                      `optionalConfig.preDeployJobs.${index}.command`
                    )}
                    className='mt-1 font-mono text-sm'
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground space-y-4'>
              <div>
                <Terminal className='h-8 w-8 mx-auto mb-2 opacity-50' />
                <p className='text-base font-medium'>
                  No pre-deploy jobs configured
                </p>
                <p className='text-xs'>
                  Add jobs that should run before your application deploys
                </p>
              </div>
              <div className='flex justify-center'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={addPreDeployJob}
                  className='gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Pre-Deploy Job
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add Pre-Deploy Job Button - Only shown when jobs exist */}
        {fields.length > 0 && (
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={addPreDeployJob}
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Pre-Deploy Job
          </Button>
        )}

        {preDeployJobs && preDeployJobs.length > 0 && (
          <div className='flex items-center gap-2'>
            <div className='text-xs text-muted-foreground'>
              {preDeployJobs.length} pre-deploy job
              {preDeployJobs.length !== 1 ? 's' : ''} configured
            </div>
            <Badge
              variant='secondary'
              className='text-xs bg-[var(--golden-amber-500)]/20 text-[var(--golden-amber-300)] border-[var(--golden-amber-500)]/40'
            >
              <Play className='h-3 w-3 mr-1' />
              Pre-Deploy
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
