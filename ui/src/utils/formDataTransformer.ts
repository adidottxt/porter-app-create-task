import type { FormData } from '../types/form.types'
import type { CreateAppRequest, PreDeployJob } from '../types'

export function transformFormDataToApi(
  formData: FormData
): Record<string, unknown> {
  if (!formData.applicationName?.trim()) {
    throw new Error('Application name is required')
  }

  if (!formData.services || formData.services.length === 0) {
    throw new Error('At least one service is required')
  }

  const request = {
    name: formData.applicationName.trim(),
    build_method: getBuildMethod(formData),
    services: transformServices(formData.services) as Record<string, unknown>[],

    image: {
      repository: formData.sourceConfig.repository?.FullName || 'unknown/repo',
      tag: 'latest',
    },
    build: {
      context: '.',
      method: 'pack',
      dockerfile: 'Dockerfile',
      repository: formData.sourceConfig.repository?.FullName || 'unknown/repo',
    },
    variables: transformEnvironmentVariables(
      formData.optionalConfig.environmentVars || []
    ),
    environment_groups:
      formData.optionalConfig.syncGroups
        ?.map(group => group.name?.trim())
        .filter(Boolean) || [],
    deployment_target_id: 'default',
    secrets: [],
  }

  if (formData.sourceConfig.deploymentMethod === 'git') {
    if (
      formData.sourceConfig.gitProvider &&
      formData.sourceConfig.repository &&
      formData.sourceConfig.branch
    ) {
      request.git_repo_id = formData.sourceConfig.gitProvider.id
      request.git_branch = formData.sourceConfig.branch
      request.source = {
        repo_name: formData.sourceConfig.repository.FullName.split('/')[1],
        owner: formData.sourceConfig.repository.FullName.split('/')[0],
        branch: formData.sourceConfig.branch,
      }
    } else {
      throw new Error('Git configuration is incomplete')
    }
  }

  if (formData.sourceConfig.deploymentMethod === 'docker') {
    request.dockerfile_path =
      formData.sourceConfig.advancedSettings?.porterYamlPath || 'Dockerfile'
  }

  if (
    formData.optionalConfig.preDeployJobs &&
    formData.optionalConfig.preDeployJobs.length > 0
  ) {
    request.predeploy = transformPreDeployJobs(
      formData.optionalConfig.preDeployJobs
    )
  }

  return request
}

function getBuildMethod(formData: FormData): string {
  if (formData.sourceConfig.deploymentMethod === 'docker') {
    return 'docker'
  }

  if (formData.sourceConfig.deploymentMethod === 'git') {
    return formData.sourceConfig.buildpack || 'auto-detected'
  }

  throw new Error('Invalid deployment method')
}

function transformServices(
  services: FormData['services']
): Record<string, unknown>[] {
  return services.map(service => {
    if (!service.name?.trim()) {
      throw new Error(`Service name is required`)
    }

    if (!service.config.startCommand?.trim()) {
      throw new Error(`Start command is required for service: ${service.name}`)
    }

    if (service.type === 'job' && !service.config.cronSchedule?.trim()) {
      throw new Error(`Cron schedule is required for cron job: ${service.name}`)
    }

    if (service.type === 'web' && !service.config.containerPort) {
      throw new Error(
        `Container port is required for web service: ${service.name}`
      )
    }

    const apiService: Record<string, unknown> = {
      name: service.name.trim(),
      type: service.type,
      run: service.config.startCommand.trim(),

      instances: service.config.instances,
      cpuCores: service.config.cpuCores,
      ramMegabytes: service.config.ramMB,
      sleep: service.config.sleep,

      port: service.type === 'web' ? service.config.containerPort : 80,

      autoscaling: service.config.enableAutoscaling
        ? {
            enabled: true,
            type: 'hpa',
            min_instances: service.config.instances,
            max_instances: service.config.instances * 3,
            cpu_threshold_percent: 80,
            memory_threshold_percent: 80,
          }
        : {
            enabled: false,
            type: 'none',
            min_instances: service.config.instances,
            max_instances: service.config.instances,
            cpu_threshold_percent: 80,
            memory_threshold_percent: 80,
          },

      domains:
        service.type === 'web' && service.config.customDomains
          ? service.config.customDomains
              .map(domain => domain?.trim())
              .filter(Boolean)
          : [],

      health_check: service.config.healthChecks
        ? {
            enabled: true,
            http_path: '/health',
            command: '',
            timeout_seconds: 30,
            initial_delay_seconds: 30,
          }
        : {
            enabled: false,
            http_path: '',
            command: '',
            timeout_seconds: 30,
            initial_delay_seconds: 0,
          },

      private: !service.config.exposeToExternalTraffic || false,
    }

    if (service.type === 'job') {
      apiService.cron_schedule = service.config.cronSchedule?.trim()
    }

    return apiService
  })
}

function transformEnvironmentVariables(
  envVars: FormData['optionalConfig']['environmentVars']
): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = []

  envVars.forEach(envVar => {
    const key = envVar.key?.trim()
    const value = envVar.value?.trim()

    if (key && value) {
      result.push({ key, value })
    }
  })

  return result
}

function transformPreDeployJobs(
  jobs: FormData['optionalConfig']['preDeployJobs']
): PreDeployJob[] {
  return jobs
    .map(job => ({
      name: job.name?.trim() || '',
      command: job.command?.trim() || '',
    }))
    .filter(job => job.name && job.command)
}

export function validateFormData(formData: FormData): void {
  if (!formData.applicationName?.trim()) {
    throw new Error('Application name is required')
  }

  if (formData.applicationName.trim().length < 2) {
    throw new Error('Application name must be at least 2 characters long')
  }

  if (!formData.sourceConfig.deploymentMethod) {
    throw new Error('Deployment method must be selected')
  }

  if (formData.sourceConfig.deploymentMethod === 'git') {
    if (!formData.sourceConfig.gitProvider) {
      throw new Error('Git provider must be selected')
    }
    if (!formData.sourceConfig.repository) {
      throw new Error('Repository must be selected')
    }
    if (!formData.sourceConfig.branch) {
      throw new Error('Branch must be selected')
    }
  }

  if (!formData.services || formData.services.length === 0) {
    throw new Error('At least one service must be configured')
  }

  formData.services.forEach((service, index) => {
    if (!service.name?.trim()) {
      throw new Error(`Service ${index + 1}: Name is required`)
    }

    if (!service.config.startCommand?.trim()) {
      throw new Error(`Service ${service.name}: Start command is required`)
    }

    if (service.type === 'job' && !service.config.cronSchedule?.trim()) {
      throw new Error(
        `Service ${service.name}: Cron schedule is required for cron jobs`
      )
    }

    if (service.type === 'web' && !service.config.containerPort) {
      throw new Error(
        `Service ${service.name}: Container port is required for web services`
      )
    }

    if (service.config.cpuCores <= 0) {
      throw new Error(
        `Service ${service.name}: CPU cores must be greater than 0`
      )
    }

    if (service.config.ramMB < 128) {
      throw new Error(`Service ${service.name}: RAM must be at least 128 MB`)
    }

    if (service.config.instances < 1) {
      throw new Error(
        `Service ${service.name}: Instance count must be at least 1`
      )
    }
  })
}
