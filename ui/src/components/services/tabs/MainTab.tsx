'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Info, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FormData, ServiceConfig } from '../../../types/form.types'

interface MainTabProps {
  serviceIndex: number
  serviceType: ServiceConfig['type']
}

export function MainTab({ serviceIndex, serviceType }: MainTabProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext<FormData>()

  const isCronJob = serviceType === 'job'

  return (
    <div className='space-y-6'>
      {/* Start Command */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.startCommand`}
            className='text-sm font-medium'
          >
            Start Command
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>The command that will be executed to start your service</p>
              <p className='mt-1'>
                Leave empty to use the default entrypoint from your Dockerfile
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.startCommand`}
          control={control}
          rules={{
            required: 'Start command is required',
          }}
          render={({ field }) => (
            <Input
              {...field}
              id={`services.${serviceIndex}.config.startCommand`}
              placeholder={
                isCronJob
                  ? 'python scripts/backup.py'
                  : serviceType === 'worker'
                    ? 'python worker.py'
                    : 'npm start'
              }
              className='bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)]'
            />
          )}
        />
      </div>

      {/* Cron Schedule (Cron Jobs Only) */}
      {isCronJob && (
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Label
              htmlFor={`services.${serviceIndex}.config.cronSchedule`}
              className='text-sm font-medium'
            >
              Cron Schedule
              <span className='text-[var(--crimson-red-500)]'>*</span>
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock className='w-4 h-4 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Schedule in cron format (e.g., &quot;0 2 * * *&quot; for daily
                  at 2 AM)
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Controller
            name={`services.${serviceIndex}.config.cronSchedule`}
            control={control}
            rules={{
              required: 'Cron schedule is required for cron jobs',
              pattern: {
                value:
                  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/[0-6])$/,
                message: 'Please enter a valid cron expression',
              },
            }}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  id={`services.${serviceIndex}.config.cronSchedule`}
                  placeholder='0 2 * * *'
                  className={`bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                    errors?.services?.[serviceIndex]?.config?.cronSchedule
                      ? 'border-[var(--crimson-red-500)]'
                      : ''
                  }`}
                  onChange={async e => {
                    field.onChange(e.target.value)
                    await trigger(
                      `services.${serviceIndex}.config.cronSchedule`
                    )
                  }}
                />
                {errors?.services?.[serviceIndex]?.config?.cronSchedule && (
                  <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                    {errors.services[serviceIndex].config.cronSchedule.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className='text-xs text-muted-foreground space-y-1'>
            <p>Cron format: minute hour day month weekday</p>
            <p className='font-mono'>
              Examples: &quot;0 2 * * *&quot; (daily at 2 AM), &quot;0 */6 * *
              *&quot; (every 6 hours)
            </p>
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div className='p-3 rounded-md bg-[var(--nordic-gray-800)] border border-[var(--nordic-gray-700)]'>
        <h4 className='text-sm font-medium text-foreground mb-2'>💡 Tips</h4>
        <ul className='text-xs text-muted-foreground space-y-1'>
          {isCronJob ? (
            <>
              <li>
                • Cron jobs run on a schedule and automatically stop when
                complete
              </li>
              <li>• Use absolute paths in your commands for reliability</li>
              <li>
                • Test your cron expression at{' '}
                <span className='font-mono'>crontab.guru</span>
              </li>
            </>
          ) : serviceType === 'worker' ? (
            <>
              <li>
                • Workers typically run continuously processing background tasks
              </li>
              <li>
                • Make sure your worker process handles graceful shutdowns
              </li>
              <li>• Workers don&apos;t receive HTTP traffic directly</li>
            </>
          ) : (
            <>
              <li>
                • Web services handle HTTP requests and should expose a port
              </li>
              <li>
                • Make sure your application binds to 0.0.0.0, not localhost
              </li>
              <li>
                • Health checks will verify your service is responding correctly
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
