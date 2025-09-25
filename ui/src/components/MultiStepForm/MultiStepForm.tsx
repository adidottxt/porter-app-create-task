'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { FormData } from '../../types/form.types'
import { FormStepper } from './FormStepper'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  createApplication,
  isApiError,
  getErrorMessage,
} from '../../services/api'
import {
  transformFormDataToApi,
  validateFormData,
} from '../../utils/formDataTransformer'
import { Step1ApplicationSetup } from '../steps/Step1ApplicationSetup'
import { Step2SourceConfig } from '../steps/Step2SourceConfig'
import {
  Step3ServiceConfig,
  validateStep3 as validateServiceConfig,
} from '../steps/Step3ServiceConfig'
import {
  Step4OptionalConfig,
  validateStep4 as validateOptionalConfig,
} from '../steps/Step4OptionalConfig'
import { getServiceCompletionStatus } from '../services/ServiceValidation'

const defaultFormData: FormData = {
  currentStep: 1,
  applicationName: '',
  isMonorepo: false,
  sourceConfig: {
    deploymentMethod: '',
    isMonorepo: false,
    buildpack: 'auto-detected',
    advancedSettings: {
      rootPath: '',
      porterYamlPath: '',
    },
  },
  services: [],
  optionalConfig: {
    environmentVars: [],
    syncGroups: [],
    preDeployJobs: [],
  },
}

const steps = [
  { title: 'Application Setup', key: 'setup' },
  { title: 'Source Configuration', key: 'source' },
  { title: 'Service Configuration', key: 'services' },
  { title: 'Optional Configuration', key: 'optional' },
]

const validateStep1 = (formData: FormData): boolean => {
  return formData.applicationName.trim().length >= 2
}

const validateStep2 = (formData: FormData): boolean => {
  if (formData.sourceConfig.deploymentMethod === 'git') {
    return !!(
      formData.sourceConfig.gitProvider &&
      formData.sourceConfig.repository &&
      formData.sourceConfig.branch
    )
  }
  return formData.sourceConfig.deploymentMethod === 'docker'
}

const validateStep3 = (formData: FormData): boolean => {
  return validateServiceConfig(formData.services)
}

const validateStep4 = (): boolean => validateOptionalConfig()

const getValidationTooltip = (
  stepNumber: number,
  formData: FormData
): string => {
  if (stepNumber === 3 && !validateStep3(formData)) {
    if (formData.services.length === 0) {
      return 'Please add at least one service to continue'
    }

    const incompleteServices = formData.services.filter(service => {
      const status = getServiceCompletionStatus(service)
      return !status.isComplete
    })

    if (incompleteServices.length > 0) {
      const cronJobsWithIssues = incompleteServices.filter(
        service =>
          service.type === 'job' &&
          (!service.config.cronSchedule ||
            service.config.cronSchedule.trim() === '')
      )

      if (cronJobsWithIssues.length > 0) {
        if (cronJobsWithIssues.length === 1) {
          return `Please configure the cron schedule for ${cronJobsWithIssues[0].name}`
        }
        return `Please configure cron schedules for ${cronJobsWithIssues.length} cron job${cronJobsWithIssues.length > 1 ? 's' : ''}`
      }

      const serviceWithMissingFields = incompleteServices[0]
      const status = getServiceCompletionStatus(serviceWithMissingFields)
      if (status.missingFields.length > 0) {
        return `Please complete configuration for ${serviceWithMissingFields.name}: ${status.missingFields[0]} required`
      }
    }

    return 'Please complete all service configurations to continue'
  }

  return ''
}

type SubmissionState =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'success'
  | 'error'

export function MultiStepForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('idle')
  const [, setCreatedApp] = useState<{
    id: number
    name: string
  } | null>(null)

  const methods = useForm<FormData>({
    defaultValues: defaultFormData,
    mode: 'onBlur',
  })

  const { watch, trigger, getValues } = methods
  const formData = watch()

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return validateStep1(formData)
      case 2:
        return validateStep2(formData)
      case 3:
        return validateStep3(formData)
      case 4:
        return validateStep4()
      default:
        return false
    }
  }

  const isStepCompleted = (stepNumber: number): boolean => {
    return (
      stepNumber < currentStep ||
      (stepNumber === currentStep && isStepValid(stepNumber))
    )
  }

  const navigateToStep = async (stepNumber: number) => {
    if (
      stepNumber <= currentStep ||
      (stepNumber === currentStep + 1 && isStepValid(currentStep))
    ) {
      const isValid = await trigger()
      if (isValid || stepNumber < currentStep) {
        resetErrorState()
        setCurrentStep(stepNumber)
      }
    }
  }

  const nextStep = async () => {
    console.log('nextStep called - current step:', currentStep)
    const isValid = await trigger()
    console.log('nextStep validation result:', isValid)
    if (isValid && currentStep < steps.length) {
      console.log('nextStep proceeding to next step')
      resetErrorState()
      setCurrentStep(currentStep + 1)
    } else {
      console.log('nextStep blocked - validation failed or at last step')
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      resetErrorState()
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    console.log(
      'onSubmit called - currentStep:',
      currentStep,
      'total steps:',
      steps.length
    )
    console.trace('Form submission stack trace')

    if (currentStep < steps.length) {
      console.log('Preventing submission - not on last step')
      return
    }

    console.log('Proceeding with deployment...')
    try {
      setSubmissionState('validating')

      validateFormData(data)

      setSubmissionState('submitting')
      const apiData = transformFormDataToApi(data)

      console.log(
        'Submitting application data:',
        JSON.stringify(apiData, null, 2)
      )

      if (!apiData.name || apiData.name.trim() === '') {
        throw new Error('Application name is required')
      }
      if (!apiData.services || apiData.services.length === 0) {
        throw new Error('At least one service is required')
      }

      for (const service of apiData.services) {
        if (!service.name || service.name.trim() === '') {
          throw new Error(`Service name is required`)
        }
        if (!service.type || !['web', 'worker', 'job'].includes(service.type)) {
          throw new Error(`Invalid service type: ${service.type}`)
        }
        if (
          service.type === 'job' &&
          (!service.cron_schedule || service.cron_schedule.trim() === '')
        ) {
          throw new Error(
            `Cron schedule is required for job service: ${service.name}`
          )
        }
        if (
          (service.type === 'web' || service.type === 'worker') &&
          (!(service as unknown as { run?: string }).run || ((service as unknown as { run?: string }).run || '').trim() === '')
        ) {
          throw new Error(
            `Start command is required for ${service.type} service: ${service.name}`
          )
        }
      }

      const response = await createApplication(apiData)

      if (isApiError(response)) {
        console.error(
          'Full API Error Response:',
          JSON.stringify(response, null, 2)
        )

        let errorMessage = getErrorMessage(response)

        if (response.status === 422) {
          const errorDetails = response.error || 'Unknown validation error'
          errorMessage = `Validation failed: ${errorDetails}`

          if (response.data && typeof response.data === 'object') {
            console.error('Additional error details:', response.data)
            errorMessage += `. Check console for details.`
          }
        }

        throw new Error(errorMessage)
      }

      setCreatedApp(response.data!)
      setSubmissionState('success')

      toast.success('Deployment Successful!', {
        description: `Application "${response.data?.name || formData.applicationName}" has been deployed successfully.`,
      })

      const appData = {
        id: response.data!.id,
        name: response.data!.name || formData.applicationName,
        repository:
          formData.sourceConfig.repository?.FullName || 'Unknown repository',
        lastDeploy: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }),
        status: 'pending',
      }

      const existingApps = JSON.parse(
        localStorage.getItem('deployedApps') || '[]'
      )
      existingApps.push(appData)
      localStorage.setItem('deployedApps', JSON.stringify(existingApps))

      setTimeout(() => {
        router.push('/applications')
      }, 2000)
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      toast.error('Deployment Failed', {
        description: errorMessage,
      })

      setSubmissionState('error')
    }
  }

  const resetErrorState = () => {
    if (submissionState === 'error') {
      setSubmissionState('idle')
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ApplicationSetup />
      case 2:
        return <Step2SourceConfig />
      case 3:
        return <Step3ServiceConfig />
      case 4:
        return <Step4OptionalConfig />
      default:
        return <div>Invalid step</div>
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed on step:', currentStep, 'of', steps.length)
      if (currentStep < steps.length) {
        e.preventDefault()
        console.log(
          'Prevented form submission via Enter key - not on last step'
        )
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          return false
        }}
        onKeyDown={handleKeyDown}
        onChange={resetErrorState}
        className='min-h-screen bg-background'
      >
        <div className='sticky top-0 z-50 bg-background'>
          <div className='max-w-6xl mx-auto'>
            <FormStepper
              steps={steps}
              currentStep={currentStep}
              isStepCompleted={isStepCompleted}
              isStepValid={isStepValid}
              onStepClick={navigateToStep}
              formData={formData}
            />
          </div>
        </div>

        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center py-8'>
            <div className='w-full max-w-2xl'>{renderCurrentStep()}</div>
          </div>

          <div className='max-w-6xl mx-auto'>
            <div className='flex justify-center py-2 pb-32'>
              <div className='w-full max-w-2xl flex justify-end items-center gap-2 pr-8'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    onClick={previousStep}
                    variant='secondary'
                    size='xs'
                    className='gap-0.5 pl-1.5'
                  >
                    <ChevronLeft className='w-4 h-4' />
                    Back
                  </Button>
                )}
                {currentStep < steps.length ? (
                  (() => {
                    const isValid = isStepValid(currentStep)
                    const tooltipMessage = getValidationTooltip(
                      currentStep,
                      formData
                    )
                    const nextButton = (
                      <Button
                        type='button'
                        onClick={nextStep}
                        disabled={!isValid}
                        variant='primary'
                        size='xs'
                        className='gap-0.5 pr-1.5'
                      >
                        <span className='flex items-center gap-1'>
                          Next <ChevronRight className='h-4 w-4' />
                        </span>
                      </Button>
                    )

                    if (!isValid && tooltipMessage) {
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>{nextButton}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltipMessage}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return nextButton
                  })()
                ) : (
                  <Button
                    type='button'
                    onClick={async () => {
                      const data = getValues()
                      await onSubmit(data)
                    }}
                    variant='primary'
                    size='xs'
                    disabled={
                      submissionState === 'validating' ||
                      submissionState === 'submitting'
                    }
                    className='gap-2'
                  >
                    {submissionState === 'validating' && (
                      <>
                        <Spinner className='h-4 w-4' />
                        Validating...
                      </>
                    )}
                    {submissionState === 'submitting' && (
                      <>
                        <Spinner className='h-4 w-4' />
                        Deploying...
                      </>
                    )}
                    {(submissionState === 'idle' ||
                      submissionState === 'error') &&
                      'Deploy'}
                    {submissionState === 'success' && (
                      <>
                        <CheckCircle className='h-4 w-4' />
                        Deployed!
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
