'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Info, Timer } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FormData, ServiceConfig } from '../../../types/form.types'

interface AdvancedTabProps {
  serviceIndex: number
  serviceType: ServiceConfig['type']
}

export function AdvancedTab({ serviceIndex, serviceType }: AdvancedTabProps) {
  const {
    control,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<FormData>()

  const healthChecks = watch(`services.${serviceIndex}.config.healthChecks`)
  const allowConcurrent = watch(
    `services.${serviceIndex}.config.allowConcurrent`
  )
  const isCronJob = serviceType === 'job'
  const isWebService = serviceType === 'web'

  return (
    <div className='space-y-6'>
      {/* Health Checks */}
      {isWebService && (
        <div className='space-y-3'>
          <Controller
            name={`services.${serviceIndex}.config.healthChecks`}
            control={control}
            render={({ field }) => (
              <div className='flex items-center space-x-3'>
                <Checkbox
                  id={`services.${serviceIndex}.config.healthChecks`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
                />
                <div className='flex items-center gap-2 flex-1'>
                  <Label
                    htmlFor={`services.${serviceIndex}.config.healthChecks`}
                    className='text-sm font-medium cursor-pointer'
                  >
                    Enable Health Checks
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        When enabled: Porter will check /health endpoint and
                        restart if unhealthy
                      </p>
                      <p className='mt-1'>
                        When disabled: No automatic health monitoring (not
                        recommended for production)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          />
          <p className='text-xs text-muted-foreground ml-6'>
            {healthChecks
              ? ''
              : 'No automatic health monitoring (not recommended for production)'}
          </p>
        </div>
      )}

      {/* Termination Grace Period */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.terminationGracePeriod`}
            className='text-sm font-medium'
          >
            Termination Grace Period (seconds)
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Time your service has to finish processing and close connections
                cleanly before being forcefully stopped
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.terminationGracePeriod`}
          control={control}
          rules={{
            required: 'Termination grace period is required',
            min: { value: 5, message: 'Minimum 5 seconds' },
            max: { value: 300, message: 'Maximum 300 seconds (5 minutes)' },
          }}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                type='number'
                min='5'
                max='300'
                id={`services.${serviceIndex}.config.terminationGracePeriod`}
                className={`w-32 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                  errors?.services?.[serviceIndex]?.config
                    ?.terminationGracePeriod
                    ? 'border-[var(--crimson-red-500)]'
                    : ''
                }`}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  field.onChange(isNaN(value) ? '' : value)
                  trigger(
                    `services.${serviceIndex}.config.terminationGracePeriod`
                  )
                }}
              />
              {errors?.services?.[serviceIndex]?.config
                ?.terminationGracePeriod && (
                <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                  {
                    errors.services[serviceIndex].config.terminationGracePeriod
                      .message
                  }
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* IAM Role Connection */}
      <div className='space-y-2'>
        <Controller
          name={`services.${serviceIndex}.config.enableIamRole`}
          control={control}
          render={({ field }) => (
            <div className='flex items-center space-x-3'>
              <Checkbox
                id={`services.${serviceIndex}.config.enableIamRole`}
                checked={field.value}
                onCheckedChange={field.onChange}
                className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
              />
              <div className='flex items-center gap-2 flex-1'>
                <Label
                  htmlFor={`services.${serviceIndex}.config.enableIamRole`}
                  className='text-sm font-medium cursor-pointer'
                >
                  IAM Role Connection
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      When enabled: Securely access AWS services using IAM roles
                      without storing credentials
                    </p>
                    <p className='mt-1'>
                      When disabled: Use AWS access keys stored in environment
                      variables (less secure)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        />
      </div>

      {/* Autoscaling */}
      {!isCronJob && (
        <div className='space-y-3'>
          <Controller
            name={`services.${serviceIndex}.config.enableAutoscaling`}
            control={control}
            render={({ field }) => (
              <div className='flex items-center space-x-3'>
                <Checkbox
                  id={`services.${serviceIndex}.config.enableAutoscaling`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
                />
                <div className='flex items-center gap-2 flex-1'>
                  <Label
                    htmlFor={`services.${serviceIndex}.config.enableAutoscaling`}
                    className='text-sm font-medium cursor-pointer'
                  >
                    Enable Autoscaling
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        When enabled: Automatically scale instances between 1
                        and your max instance count based on CPU and memory
                        usage
                      </p>
                      <p className='mt-1'>
                        When disabled: Fixed number of instances (recommended
                        for predictable workloads)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Cron Job Specific Settings */}
      {isCronJob && (
        <>
          {/* Timeout */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Label
                htmlFor={`services.${serviceIndex}.config.timeout`}
                className='text-sm font-medium'
              >
                Timeout (seconds)
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Timer className='w-4 h-4 text-muted-foreground cursor-help' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maximum time allowed for the cron job to complete</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Controller
              name={`services.${serviceIndex}.config.timeout`}
              control={control}
              rules={{
                required: false, // Optional for cron jobs
                min: { value: 60, message: 'Minimum 60 seconds' },
                max: {
                  value: 86400,
                  message: 'Maximum 86400 seconds (24 hours)',
                },
              }}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    type='number'
                    min='60'
                    max='86400'
                    placeholder='3600'
                    id={`services.${serviceIndex}.config.timeout`}
                    className={`w-32 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                      errors?.services?.[serviceIndex]?.config?.timeout
                        ? 'border-[var(--crimson-red-500)]'
                        : ''
                    }`}
                    onChange={e => {
                      const value = parseInt(e.target.value)
                      field.onChange(isNaN(value) ? '' : value)
                      trigger(`services.${serviceIndex}.config.timeout`)
                    }}
                  />
                  {errors?.services?.[serviceIndex]?.config?.timeout && (
                    <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                      {errors.services[serviceIndex].config.timeout.message}
                    </p>
                  )}
                </div>
              )}
            />
            <p className='text-xs text-muted-foreground'>
              Job will be terminated if it runs longer than this time. Default:
              1 hour
            </p>
          </div>

          {/* Allow Concurrent Execution */}
          <div className='space-y-2'>
            <Controller
              name={`services.${serviceIndex}.config.allowConcurrent`}
              control={control}
              render={({ field }) => (
                <div className='flex items-center space-x-3'>
                  <Checkbox
                    id={`services.${serviceIndex}.config.allowConcurrent`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
                  />
                  <div className='flex items-center gap-2 flex-1'>
                    <Label
                      htmlFor={`services.${serviceIndex}.config.allowConcurrent`}
                      className='text-sm font-medium cursor-pointer'
                    >
                      Allow Concurrent Execution
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          When enabled: Multiple job instances can run
                          simultaneously if schedule overlaps
                        </p>
                        <p className='mt-1'>
                          When disabled: New job instances wait for previous
                          ones to complete (recommended)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            />
            <p className='text-xs text-muted-foreground ml-6'>
              {allowConcurrent
                ? 'Multiple job instances can run simultaneously if schedule overlaps'
                : 'New job instances wait for previous ones to complete (recommended)'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
