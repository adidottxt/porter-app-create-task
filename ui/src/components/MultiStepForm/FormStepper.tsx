'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Github,
  GitBranch,
  Globe,
  Cpu,
  Clock,
  Settings,
  Link,
  Play,
} from 'lucide-react'
import type { FormData, ContextChip } from '../../types/form.types'

const serviceColors = {
  web: 'var(--ocean-teal-500)',
  worker: 'var(--forest-green-500)',
  job: 'var(--golden-amber-500)',
}

interface Step {
  title: string
  key: string
}

interface FormStepperProps {
  steps: Step[]
  currentStep: number
  isStepCompleted: (stepNumber: number) => boolean
  isStepValid: (stepNumber: number) => boolean
  onStepClick: (stepNumber: number) => void
  formData: FormData
}

function generateStepChips(
  stepNumber: number,
  formData: FormData,
  currentStep: number,
  forStepHeader: boolean = false
): ContextChip[] {
  const chips: ContextChip[] = []

  switch (stepNumber) {
    case 1:
      if (formData.applicationName && !forStepHeader) {
        chips.push({
          id: 'app-name',
          icon: <Package className='h-3 w-3' />,
          label: formData.applicationName,
        })
      }
      break
    case 2:
      if (formData.sourceConfig.repository && !forStepHeader) {
        chips.push({
          id: 'repository',
          icon: <Github className='h-3 w-3' />,
          label: formData.sourceConfig.repository.FullName,
        })
      }
      if (formData.sourceConfig.branch && !forStepHeader) {
        chips.push({
          id: 'branch',
          icon: <GitBranch className='h-3 w-3' />,
          label: formData.sourceConfig.branch,
        })
      }
      break
    case 3:
      if (!forStepHeader) {
        formData.services.forEach(service => {
          const hasError =
            service.type === 'job' && !service.config.cronSchedule?.trim()
          const Icon =
            service.type === 'web'
              ? Globe
              : service.type === 'worker'
                ? Cpu
                : Clock
          chips.push({
            id: `service-${service.id}`,
            icon: <Icon className='h-3 w-3' />,
            label: service.name,
            hasError,
            serviceType: service.type,
          })
        })
      }
      break
    case 4:
      if (formData.optionalConfig.environmentVars.length > 0) {
        chips.push({
          id: 'env-vars',
          icon: <Settings className='h-3 w-3' />,
          label: `${formData.optionalConfig.environmentVars.length} env vars`,
        })
      }
      if (formData.optionalConfig.syncGroups.length > 0) {
        chips.push({
          id: 'sync-groups',
          icon: <Link className='h-3 w-3' />,
          label: `${formData.optionalConfig.syncGroups.length} sync groups`,
        })
      }
      if (formData.optionalConfig.preDeployJobs.length > 0) {
        chips.push({
          id: 'pre-deploy-jobs',
          icon: <Play className='h-3 w-3' />,
          label: `${formData.optionalConfig.preDeployJobs.length} pre-deploy jobs`,
        })
      }
      break
  }

  return chips
}

const StepSection = React.memo<{
  step: Step
  stepNumber: number
  currentStep: number
  isCompleted: boolean
  isValid: boolean
  isClickable: boolean
  onStepClick: (stepNumber: number) => void
  chips: ContextChip[]
}>(({ step, stepNumber, currentStep, isClickable, onStepClick, chips }) => {
  const isCurrent = stepNumber === currentStep
  const isPast = stepNumber < currentStep

  return (
    <div className='flex-1'>
      <div
        onClick={() => isClickable && onStepClick(stepNumber)}
        className={cn(
          'w-full text-left px-3 pb-2 pt-8 transition-colors relative h-24 flex flex-col justify-end',
          isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
          isCurrent && 'bg-gradient-nordic-subtle'
        )}
      >
        <div className='flex items-center gap-3 mb-1'>
          <span className='text-xs text-muted-foreground font-medium'>
            {stepNumber}.
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              isCurrent && 'text-white',
              isPast && 'text-foreground',
              !isCurrent && !isPast && 'text-muted-foreground'
            )}
          >
            {step.title}
          </span>
        </div>

        {chips.length > 0 && !isCurrent && (
          <div className='flex items-center gap-1 flex-wrap'>
            {chips.slice(0, 3).map(chip => (
              <Badge
                key={chip.id}
                variant={chip.hasError ? 'destructive' : 'secondary'}
                className={`text-xs px-2 py-0.5 flex items-center gap-1 font-mono ${
                  chip.id === 'app-name'
                    ? 'bg-[var(--magic-blue-500)] text-white border-[var(--magic-blue-500)]'
                    : ['repository', 'branch'].includes(chip.id)
                      ? 'bg-[var(--crimson-red-500)] text-white border-[var(--crimson-red-500)]'
                      : chip.serviceType
                        ? 'text-white border-none'
                        : [
                              'env-vars',
                              'sync-groups',
                              'pre-deploy-jobs',
                            ].includes(chip.id)
                          ? 'bg-[var(--golden-amber-700)] text-white border-[var(--golden-amber-700)]'
                          : ''
                }`}
                style={
                  chip.serviceType
                    ? {
                        backgroundColor: serviceColors[chip.serviceType],
                      }
                    : {}
                }
              >
                {chip.icon}
                {chip.label}
              </Badge>
            ))}
            {chips.length > 3 && (
              <Badge
                variant='outline'
                className='text-xs px-2 py-0.5 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] text-white'
              >
                +{chips.length - 3}
              </Badge>
            )}
          </div>
        )}

        {isCurrent && (
          <div className='absolute -bottom-1 left-0 right-0 h-1 bg-gradient-magic-complex' />
        )}
      </div>
    </div>
  )
})

StepSection.displayName = 'StepSection'

export const FormStepper = React.memo<FormStepperProps>(
  ({
    steps,
    currentStep,
    isStepCompleted,
    isStepValid,
    onStepClick,
    formData,
  }) => {
    return (
      <>
        <div style={{ backgroundColor: 'var(--nordic-gray-900)' }}>
          <div className='max-w-6xl mx-auto'>
            <div className='flex'>
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isCompleted = isStepCompleted(stepNumber)
                const isValid = isStepValid(stepNumber)
                const isClickable = isCompleted || stepNumber === currentStep
                const chips = generateStepChips(
                  stepNumber,
                  formData,
                  currentStep,
                  true
                )

                return (
                  <React.Fragment key={step.key}>
                    <StepSection
                      step={step}
                      stepNumber={stepNumber}
                      currentStep={currentStep}
                      isCompleted={isCompleted}
                      isValid={isValid}
                      isClickable={isClickable}
                      onStepClick={onStepClick}
                      chips={chips}
                    />
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--nordic-gray-900)' }}>
          <div className='max-w-6xl mx-auto'>
            <div className='flex'>
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const chips = generateStepChips(
                  stepNumber,
                  formData,
                  currentStep
                )
                const hasContent = chips.length > 0
                const isActive = stepNumber === currentStep

                return (
                  <div
                    key={step.key}
                    className={`flex-1 px-3 py-3 ${
                      isActive
                        ? 'min-h-[64px] bg-[var(--nordic-gray-700)]'
                        : stepNumber < currentStep
                          ? 'min-h-[64px] bg-[var(--nordic-gray-700)] border-r border-dashed border-[var(--nordic-gray-600)]'
                          : hasContent
                            ? 'bg-[var(--nordic-gray-800)] border-t border-[var(--nordic-gray-700)]'
                            : stepNumber === steps.length
                              ? 'min-h-[64px] border border-dashed border-[var(--nordic-gray-600)] bg-transparent'
                              : 'min-h-[64px] border-t border-b border-l border-dashed border-[var(--nordic-gray-600)] bg-transparent'
                    }`}
                  >
                    <div className='flex items-center gap-1 flex-wrap'>
                      {chips.slice(0, 2).map(chip => (
                        <Badge
                          key={chip.id}
                          variant={chip.hasError ? 'destructive' : 'secondary'}
                          className={`text-xs px-2 py-0.5 flex items-center gap-1 font-mono ${
                            chip.id === 'app-name'
                              ? 'bg-[var(--magic-blue-500)] text-white border-[var(--magic-blue-500)]'
                              : ['repository', 'branch'].includes(chip.id)
                                ? 'bg-[var(--crimson-red-500)] text-white border-[var(--crimson-red-500)]'
                                : chip.serviceType
                                  ? 'text-white border-none'
                                  : [
                                        'env-vars',
                                        'sync-groups',
                                        'pre-deploy-jobs',
                                      ].includes(chip.id)
                                    ? 'bg-[var(--golden-amber-700)] text-white border-[var(--golden-amber-700)]'
                                    : ''
                          }`}
                          style={
                            chip.serviceType
                              ? {
                                  backgroundColor:
                                    serviceColors[chip.serviceType],
                                }
                              : {}
                          }
                        >
                          {chip.icon}
                          {chip.label}
                        </Badge>
                      ))}
                      {chips.length > 2 && (
                        <Badge
                          variant='outline'
                          className='text-xs px-2 py-0.5 bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] text-white'
                        >
                          +{chips.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </>
    )
  }
)

FormStepper.displayName = 'FormStepper'
