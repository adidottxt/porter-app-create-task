'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { EmptyState } from '@/components/ui/empty-state'
import { AddServiceDropdown } from '../services/AddServiceDropdown'
import { ServiceCard } from '../services/ServiceCard'
import { getServiceCompletionStatus } from '../services/ServiceValidation'
import type { FormData, ServiceConfig } from '../../types/form.types'

export function Step3ServiceConfig() {
  const { control, watch } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  })

  const services = watch('services')

  const generateServiceName = (type: ServiceConfig['type']): string => {
    const typePrefix =
      type === 'web' ? 'web-service' : type === 'worker' ? 'worker' : 'cron-job'
    const existingNames = services.map(s => s.name)
    let counter = 1
    let name = `${typePrefix}-${counter}`

    while (existingNames.includes(name)) {
      counter++
      name = `${typePrefix}-${counter}`
    }

    return name
  }

  const addService = (type: ServiceConfig['type']) => {
    const newService: ServiceConfig = {
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: generateServiceName(type),
      type,
      config: {
        startCommand: '',
        cpuCores: 1,
        ramMB: 512,
        instances: 1,
        sleep: false,
        healthChecks: true,
        terminationGracePeriod: 30,
        enableIamRole: false,
        enableAutoscaling: false,
        ...(type === 'web' && {
          containerPort: 80,
          exposeToExternalTraffic: true,
          customDomains: [],
        }),
        ...(type === 'job' && {
          cronSchedule: '',
          timeout: 3600,
          allowConcurrent: false,
        }),
      },
    }

    append(newService)
  }

  const removeService = (index: number) => {
    remove(index)
  }

  const hasServices = fields.length > 0

  return (
    <div className='max-w-6xl mx-auto pr-8 py-4'>
      <div className='max-w-2xl'>
        <div className='space-y-4'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-medium text-foreground'>
                Service Configuration
              </h2>
              <p className='text-sm text-muted-foreground'>
                Configure your application services and settings.
              </p>
            </div>
            <AddServiceDropdown onAddService={addService} />
          </div>

          {/* Services List or Empty State */}
          {!hasServices ? (
            <EmptyState
              title='No services configured'
              description='Configure your application services and settings'
              className='min-h-[300px]'
            />
          ) : (
            <div className='space-y-4'>
              {fields.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service as ServiceConfig}
                  index={index}
                  onRemove={() => removeService(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export validation function for use in MultiStepForm
export function validateStep3(services: ServiceConfig[]): boolean {
  if (!services || services.length === 0) {
    return false // At least one service is required
  }

  return services.every(service => {
    const completionStatus = getServiceCompletionStatus(service)
    return completionStatus.isComplete
  })
}
