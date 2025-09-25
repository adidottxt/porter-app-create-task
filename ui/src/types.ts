interface GitProvider {
  id: number
  account_id: number
  installation_id: number
  name: string
  provider: string
}

interface GitRepository {
  FullName: string
  Kind: string
}

interface GitBranch {
  name: string
  protected: boolean
}

interface CreateAppRequest {
  project_id: number
  cluster_id: number
  name: string
  git_repo_id?: number
  git_branch?: string
  build_method: string
  dockerfile_path?: string
  source?: {
    repo_name: string
    owner: string
    branch: string
  }
  services: ServiceConfig[]
  env_vars?: Record<string, string>
  sync_env_groups?: string[]
  predeploy?: PreDeployJob[]
}

interface ServiceConfig {
  name: string
  type: 'web' | 'worker' | 'job'
  start_command?: string
  cron_schedule?: string
  resources: {
    cpu_cores: number
    ram_megabytes: number
    instances: number
    sleep: boolean
  }
  networking?: {
    container_port: number
    expose_to_external_traffic: boolean
    custom_domains?: string[]
  }
  advanced?: {
    health_checks_enabled: boolean
    termination_grace_period: number
    enable_iam_role: boolean
    enable_autoscaling: boolean
    timeout_seconds?: number
    allow_concurrent?: boolean
  }
}

interface PreDeployJob {
  name: string
  command: string
}

interface ApiErrorResponse {
  error: string
  message?: string
  details?: unknown
}

export type {
  GitProvider,
  GitRepository,
  GitBranch,
  CreateAppRequest,
  ServiceConfig,
  PreDeployJob,
  ApiErrorResponse,
}
