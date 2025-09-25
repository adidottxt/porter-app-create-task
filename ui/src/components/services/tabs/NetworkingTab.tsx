'use client'

import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import { Info, Globe, Plus, X, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FormData } from '../../../types/form.types'

interface NetworkingTabProps {
  serviceIndex: number
}

export function NetworkingTab({ serviceIndex }: NetworkingTabProps) {
  const {
    control,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `services.${serviceIndex}.config.customDomains` as any,
  })

  const exposeToExternalTraffic = watch(
    `services.${serviceIndex}.config.exposeToExternalTraffic`
  )

  const addCustomDomain = () => {
    append('')
  }

  const removeCustomDomain = (index: number) => {
    remove(index)
  }

  return (
    <div className='space-y-6'>
      {/* Container Port */}
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Label
            htmlFor={`services.${serviceIndex}.config.containerPort`}
            className='text-sm font-medium'
          >
            Container Port
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='w-4 h-4 text-muted-foreground cursor-help' />
            </TooltipTrigger>
            <TooltipContent>
              <p>The port your application listens on inside the container</p>
              <p className='mt-1'>
                Common ports: 80 (HTTP), 3000 (Node.js), 8080 (Java), 5000
                (Python Flask)
              </p>
              <p className='mt-1'>
                Your application must bind to 0.0.0.0, not 127.0.0.1 or
                localhost
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Controller
          name={`services.${serviceIndex}.config.containerPort`}
          control={control}
          rules={{
            required: 'Container port is required for web services',
            min: { value: 1, message: 'Port must be between 1 and 65535' },
            max: { value: 65535, message: 'Port must be between 1 and 65535' },
          }}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                type='number'
                min='1'
                max='65535'
                id={`services.${serviceIndex}.config.containerPort`}
                placeholder='80'
                className={`w-32 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                  errors?.services?.[serviceIndex]?.config?.containerPort
                    ? 'border-[var(--crimson-red-500)]'
                    : ''
                }`}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  field.onChange(isNaN(value) ? '' : value)
                  trigger(`services.${serviceIndex}.config.containerPort`)
                }}
              />
              {errors?.services?.[serviceIndex]?.config?.containerPort && (
                <p className='text-xs text-[var(--crimson-red-500)] mt-1'>
                  {errors.services[serviceIndex].config.containerPort.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Expose to External Traffic */}
      <div className='space-y-2'>
        <Controller
          name={`services.${serviceIndex}.config.exposeToExternalTraffic`}
          control={control}
          render={({ field }) => (
            <div className='flex items-center space-x-3'>
              <Checkbox
                id={`services.${serviceIndex}.config.exposeToExternalTraffic`}
                checked={field.value}
                onCheckedChange={field.onChange}
                className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
              />
              <div className='flex items-center gap-2 flex-1'>
                <Label
                  htmlFor={`services.${serviceIndex}.config.exposeToExternalTraffic`}
                  className='text-sm font-medium cursor-pointer'
                >
                  Expose to External Traffic
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      When enabled: Your service will be accessible from the
                      internet via a public URL and custom domains
                    </p>
                    <p className='mt-1'>
                      When disabled: Your service will only be accessible from
                      within your cluster
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        />
        <p className='text-xs text-muted-foreground ml-6'>
          {exposeToExternalTraffic
            ? 'Your service will be accessible via a public URL and custom domains'
            : 'Your service will only be accessible from within your cluster'}
        </p>
      </div>

      {/* Security Notice */}
      <AnimatePresence>
        {exposeToExternalTraffic && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='p-3 rounded-md bg-[var(--golden-amber-500)]/10 border border-[var(--golden-amber-500)]/20'>
              <div className='flex items-center gap-2 mb-2'>
                <Lock className='w-4 h-4 text-[var(--golden-amber-500)]' />
                <h4 className='text-sm font-medium text-[var(--golden-amber-500)]'>
                  Security Notice
                </h4>
              </div>
              <p className='text-xs text-[var(--golden-amber-100)]'>
                This service will be accessible from the internet. Ensure your
                application has proper authentication and input validation.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Domains */}
      <AnimatePresence>
        {exposeToExternalTraffic && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm font-medium'>Custom Domains</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='w-4 h-4 text-muted-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add custom domains that will route to this service</p>
                      <p className='mt-1'>
                        Custom domains require DNS configuration. You&apos;ll
                        receive setup instructions after deployment.
                      </p>
                      <p className='mt-1'>
                        SSL certificates are automatically managed for custom
                        domains
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={addCustomDomain}
                  className='gap-1'
                >
                  <Plus className='w-4 h-4' />
                  Add Domain
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className='space-y-2'>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {fields.map((field: any, index: number) => (
                    <Controller
                      key={field.id}
                      name={`services.${serviceIndex}.config.customDomains.${index}`}
                      control={control}
                      rules={{
                        pattern: {
                          value:
                            /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
                          message:
                            'Please enter a valid domain (e.g., myapp.com)',
                        },
                      }}
                      render={({ field: domainField }) => (
                        <div className='flex items-center gap-2'>
                          <Input
                            {...domainField}
                            placeholder='myapp.com'
                            className={`flex-1 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)] ${
                              errors?.services?.[serviceIndex]?.config
                                ?.customDomains?.[index]
                                ? 'border-[var(--crimson-red-500)]'
                                : ''
                            }`}
                            onKeyDown={e => {
                              if (
                                e.key === 'Enter' &&
                                domainField.value.trim()
                              ) {
                                e.preventDefault()
                                addCustomDomain()
                              }
                            }}
                          />
                          <Button
                            type='button'
                            variant='minimal'
                            size='sm'
                            onClick={() => removeCustomDomain(index)}
                            className='w-8 h-8 p-0 text-muted-foreground hover:text-[var(--crimson-red-500)]'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      )}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-center py-6 border-2 border-dashed border-[var(--nordic-gray-600)] rounded-lg'>
                  <Globe className='w-8 h-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground mb-2'>
                    No custom domains configured
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Your service will be accessible via the default Porter URL
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
