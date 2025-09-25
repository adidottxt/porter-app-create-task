export interface ServiceConfig {
  id: string
  name: string
  type: 'web' | 'worker' | 'job'
  config: {
    startCommand: string
    cronSchedule?: string
    cpuCores: number
    ramMB: number
    instances: number
    sleep: boolean
    containerPort?: number
    exposeToExternalTraffic?: boolean
    customDomains?: string[]
    healthChecks: boolean
    terminationGracePeriod: number
    enableIamRole: boolean
    enableAutoscaling: boolean
    timeout?: number
    allowConcurrent?: boolean
  }
}

export interface FormData {
  currentStep: number
  applicationName: string
  isMonorepo: boolean
  sourceConfig: {
    deploymentMethod: 'git' | 'docker' | ''
    gitProvider?: {
      id: number
      account_id: number
      installation_id: number
      name: string
      provider: string
    }
    repository?: {
      FullName: string
      Kind: string
    }
    branch?: string
    isMonorepo: boolean
    buildpack: string
    advancedSettings: {
      rootPath: string
      porterYamlPath: string
    }
  }
  services: ServiceConfig[]
  optionalConfig: {
    environmentVars: Array<{
      key: string
      value: string
    }>
    syncGroups: Array<{
      name: string
      description: string
    }>
    preDeployJobs: Array<{
      name: string
      command: string
    }>
  }
}

export interface StepConfig {
  title: string
  isCompleted: boolean
  isValid: boolean
}

export interface ContextChip {
  id: string
  icon: React.ReactNode
  label: string
  hasError?: boolean
  serviceType?: 'web' | 'worker' | 'job'
}
