'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FormData } from '../../../types/form.types'

interface ResourcesTabProps {
  serviceIndex: number
}

export function ResourcesTab({ serviceIndex }: ResourcesTabProps) {
  const {
    control,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<FormData>()

  const cpuCores = watch(`services.${serviceIndex}.config.cpuCores`)
  const ramMB = watch(`services.${serviceIndex}.config.ramMB`)
  const instances = watch(`services.${serviceIndex}.config.instances`)

  return (
    <div className='space-y-6'>
      {/* CPU Cores */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.cpuCores`}
            className='text-sm font-medium'
          >
            CPU Cores
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Number of CPU cores allocated to your service. CPU-intensive
                tasks need more CPU cores.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.cpuCores`}
          control={control}
          rules={{
            required: 'CPU cores is required',
            min: { value: 0.1, message: 'Minimum 0.1 CPU cores' },
            max: { value: 8, message: 'Maximum 8 CPU cores' },
          }}
          render={({ field }) => (
            <div>
              <div className='flex items-center gap-3'>
                <Input
                  {...field}
                  type='number'
                  step='0.1'
                  min='0.1'
                  max='8'
                  id={`services.${serviceIndex}.config.cpuCores`}
                  className={`w-24 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                    errors?.services?.[serviceIndex]?.config?.cpuCores
                      ? 'border-[var(--crimson-red-500)]'
                      : ''
                  }`}
                  onChange={e => {
                    const value = parseFloat(e.target.value)
                    field.onChange(isNaN(value) ? '' : value)
                    trigger(`services.${serviceIndex}.config.cpuCores`)
                  }}
                />
                <div className='flex-1'>
                  <div className='flex justify-between text-xs text-muted-foreground mb-2 font-mono'>
                    <span>0.1</span>
                    <span>8.0</span>
                  </div>
                  <Slider
                    value={[cpuCores || 0.5]}
                    onValueChange={([value]) => {
                      field.onChange(value)
                      trigger(`services.${serviceIndex}.config.cpuCores`)
                    }}
                    max={8}
                    min={0.1}
                    step={0.1}
                    className='w-full'
                  />
                </div>
              </div>
              {errors?.services?.[serviceIndex]?.config?.cpuCores && (
                <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                  {errors.services[serviceIndex].config.cpuCores.message}
                </p>
              )}
            </div>
          )}
        />
        <p className='text-xs text-muted-foreground'>
          Recommended: 0.5-1 CPU for small apps, 1-2 CPU for medium workloads
        </p>
      </div>

      {/* RAM */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.ramMB`}
            className='text-sm font-medium'
          >
            RAM (MB)
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Amount of memory allocated to your service. Memory-heavy tasks
                need more RAM.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.ramMB`}
          control={control}
          rules={{
            required: 'RAM is required',
            min: { value: 128, message: 'Minimum 128 MB' },
            max: { value: 8192, message: 'Maximum 8192 MB (8 GB)' },
          }}
          render={({ field }) => (
            <div>
              <div className='flex items-center gap-3'>
                <Input
                  {...field}
                  type='number'
                  step='64'
                  min='128'
                  max='8192'
                  id={`services.${serviceIndex}.config.ramMB`}
                  className={`w-24 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                    errors?.services?.[serviceIndex]?.config?.ramMB
                      ? 'border-[var(--crimson-red-500)]'
                      : ''
                  }`}
                  onChange={e => {
                    const value = parseInt(e.target.value)
                    field.onChange(isNaN(value) ? '' : value)
                    trigger(`services.${serviceIndex}.config.ramMB`)
                  }}
                />
                <div className='flex-1'>
                  <div className='flex justify-between text-xs text-muted-foreground mb-2 font-mono'>
                    <span>128 MB</span>
                    <span>8 GB</span>
                  </div>
                  <Slider
                    value={[ramMB || 512]}
                    onValueChange={([value]) => {
                      field.onChange(value)
                      trigger(`services.${serviceIndex}.config.ramMB`)
                    }}
                    max={8192}
                    min={128}
                    step={64}
                    className='w-full'
                  />
                </div>
              </div>
              {errors?.services?.[serviceIndex]?.config?.ramMB && (
                <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                  {errors.services[serviceIndex].config.ramMB.message}
                </p>
              )}
            </div>
          )}
        />
        <p className='text-xs text-muted-foreground'>
          Recommended: 512 MB for small apps, 1-2 GB for medium workloads
        </p>
      </div>

      {/* Instance Count */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.instances`}
            className='text-sm font-medium'
          >
            Instance Count
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Number of instances to run for high availability and load
                distribution. Multiple instances provide redundancy but use more
                resources.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.instances`}
          control={control}
          rules={{
            required: 'Instance count is required',
            min: { value: 1, message: 'Minimum 1 instance' },
            max: { value: 10, message: 'Maximum 10 instances' },
          }}
          render={({ field }) => (
            <div>
              <div className='flex items-center gap-3'>
                <Input
                  {...field}
                  type='number'
                  min='1'
                  max='10'
                  id={`services.${serviceIndex}.config.instances`}
                  className={`w-24 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                    errors?.services?.[serviceIndex]?.config?.instances
                      ? 'border-[var(--crimson-red-500)]'
                      : ''
                  }`}
                  onChange={e => {
                    const value = parseInt(e.target.value)
                    field.onChange(isNaN(value) ? '' : value)
                    trigger(`services.${serviceIndex}.config.instances`)
                  }}
                />
                <div className='flex-1'>
                  <div className='flex justify-between text-xs text-muted-foreground mb-2 font-mono'>
                    <span>1</span>
                    <span>10</span>
                  </div>
                  <Slider
                    value={[instances || 1]}
                    onValueChange={([value]) => {
                      field.onChange(value)
                      trigger(`services.${serviceIndex}.config.instances`)
                    }}
                    max={10}
                    min={1}
                    step={1}
                    className='w-full'
                  />
                </div>
              </div>
              {errors?.services?.[serviceIndex]?.config?.instances && (
                <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                  {errors.services[serviceIndex].config.instances.message}
                </p>
              )}
            </div>
          )}
        />
        <p className='text-xs text-muted-foreground'>
          Start with 1 instance. Scale up for high availability and load
          handling.
        </p>
      </div>

      {/* Sleep Service */}
      <div className='space-y-2'>
        <Controller
          name={`services.${serviceIndex}.config.sleep`}
          control={control}
          render={({ field }) => (
            <div className='flex items-center space-x-3'>
              <Checkbox
                id={`services.${serviceIndex}.config.sleep`}
                checked={field.value}
                onCheckedChange={field.onChange}
                className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
              />
              <div className='flex items-center gap-2 flex-1'>
                <Label
                  htmlFor={`services.${serviceIndex}.config.sleep`}
                  className='text-sm font-medium cursor-pointer'
                >
                  Sleep Service
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Automatically sleep after 5 minutes of inactivity to save
                      resources. Sleep mode saves costs during inactive periods.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        />
        <p className='text-xs text-muted-foreground ml-6'>
          Recommended for development services. Production services should
          typically stay awake.
        </p>
      </div>
    </div>
  )
}
