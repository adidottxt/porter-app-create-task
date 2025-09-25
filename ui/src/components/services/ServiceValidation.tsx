'use client'

import { useFormContext } from 'react-hook-form'
import type { FormData, ServiceConfig } from '../../types/form.types'

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  warnings: string[]
}

export interface ServiceValidationProps {
  serviceIndex: number
  serviceType: ServiceConfig['type']
}

export function useServiceValidation(serviceIndex: number) {
  const {
    getValues,
    formState: { errors },
  } = useFormContext<FormData>()

  const validateService = (service: ServiceConfig): ValidationResult => {
    const result: ValidationResult = {
      isValid: true,
      errors: {},
      warnings: [],
    }

    if (!service.name || service.name.trim() === '') {
      result.errors.name = 'Service name is required'
      result.isValid = false
    }

    if (
      !service.config.startCommand ||
      service.config.startCommand.trim() === ''
    ) {
      result.errors.startCommand = 'Start command is required'
      result.isValid = false
    }

    if (service.type === 'job') {
      if (
        !service.config.cronSchedule ||
        service.config.cronSchedule.trim() === ''
      ) {
        result.errors.cronSchedule = 'Cron schedule is required for cron jobs'
        result.isValid = false
      }
    }

    if (service.type === 'web') {
      if (!service.config.containerPort) {
        result.errors.containerPort =
          'Container port is required for web services'
        result.isValid = false
      }
    }

    if (!service.config.cpuCores || service.config.cpuCores < 0.1) {
      result.errors.cpuCores = 'CPU cores must be at least 0.1'
      result.isValid = false
    }

    if (!service.config.ramMB || service.config.ramMB < 128) {
      result.errors.ramMB = 'RAM must be at least 128 MB'
      result.isValid = false
    }

    if (!service.config.instances || service.config.instances < 1) {
      result.errors.instances = 'Instance count must be at least 1'
      result.isValid = false
    }

    if (
      !service.config.terminationGracePeriod ||
      service.config.terminationGracePeriod < 5
    ) {
      result.errors.terminationGracePeriod =
        'Termination grace period must be at least 5 seconds'
      result.isValid = false
    }

    if (service.config.customDomains) {
      const domainRegex =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
      service.config.customDomains.forEach((domain, index) => {
        if (domain && !domainRegex.test(domain)) {
          result.errors[`customDomain${index}`] =
            `Invalid domain format: ${domain}`
          result.isValid = false
        }
      })
    }

    if (service.config.cpuCores > 4) {
      result.warnings.push('High CPU allocation may increase costs')
    }

    if (service.config.ramMB > 4096) {
      result.warnings.push('High memory allocation may increase costs')
    }

    if (service.config.instances > 5) {
      result.warnings.push('High instance count may increase costs')
    }

    if (
      service.type === 'web' &&
      service.config.exposeToExternalTraffic &&
      !service.config.healthChecks
    ) {
      result.warnings.push('Health checks recommended for public web services')
    }

    return result
  }

  const getServiceValidation = (): ValidationResult => {
    const services = getValues('services')
    if (!services || !services[serviceIndex]) {
      return {
        isValid: false,
        errors: { service: 'Service not found' },
        warnings: [],
      }
    }

    return validateService(services[serviceIndex])
  }

  const hasFormErrors = (): boolean => {
    const serviceErrors = errors?.services?.[serviceIndex]
    if (!serviceErrors) return false

    return !!(
      serviceErrors.name ||
      serviceErrors.config?.startCommand ||
      serviceErrors.config?.cronSchedule ||
      serviceErrors.config?.containerPort ||
      serviceErrors.config?.cpuCores ||
      serviceErrors.config?.ramMB ||
      serviceErrors.config?.instances ||
      serviceErrors.config?.terminationGracePeriod ||
      serviceErrors.config?.timeout ||
      serviceErrors.config?.customDomains
    )
  }

  return {
    validateService,
    getServiceValidation,
    hasFormErrors,
  }
}

export function getServiceCompletionStatus(service: ServiceConfig): {
  isComplete: boolean
  completionPercentage: number
  missingFields: string[]
} {
  const requiredFields: {
    field: string
    label: string
    condition?: () => boolean
  }[] = [
    { field: 'name', label: 'Service name' },
    { field: 'config.startCommand', label: 'Start command' },
    { field: 'config.cpuCores', label: 'CPU cores' },
    { field: 'config.ramMB', label: 'RAM' },
    { field: 'config.instances', label: 'Instance count' },
    {
      field: 'config.terminationGracePeriod',
      label: 'Termination grace period',
    },
  ]

  if (service.type === 'job') {
    requiredFields.push({
      field: 'config.cronSchedule',
      label: 'Cron schedule',
    })
  }

  if (service.type === 'web') {
    requiredFields.push({
      field: 'config.containerPort',
      label: 'Container port',
    })
  }

  const missingFields: string[] = []
  let completedFields = 0

  requiredFields.forEach(({ field, label, condition }) => {
    if (condition && !condition()) return

    const value = field
      .split('.')
      .reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], service)
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (typeof value === 'number' && isNaN(value))
    ) {
      missingFields.push(label)
    } else {
      completedFields++
    }
  })

  const totalFields = requiredFields.length
  const completionPercentage = Math.round((completedFields / totalFields) * 100)
  const isComplete = missingFields.length === 0

  return {
    isComplete,
    completionPercentage,
    missingFields,
  }
}
