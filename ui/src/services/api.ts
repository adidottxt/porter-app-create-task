import { apiClient, type ApiResponse } from '../utils/apiClient'
import type {
  GitProvider,
  GitRepository,
  GitBranch,
  CreateAppRequest,
  ApiErrorResponse,
} from '../types'

const getProjectId = (): number => {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '1'
  return parseInt(projectId, 10)
}

const getClusterId = (): number => {
  const clusterId = process.env.NEXT_PUBLIC_CLUSTER_ID || '1'
  return parseInt(clusterId, 10)
}

export const getGitProviders = async (): Promise<
  ApiResponse<GitProvider[]>
> => {
  try {
    const projectId = getProjectId()
    const endpoint = `/api/projects/${projectId}/integrations/git`

    return await apiClient.get<GitProvider[]>(endpoint)
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Git providers',
      status: 0,
    }
  }
}

export const getRepositories = async (
  providerId: number
): Promise<ApiResponse<GitRepository[]>> => {
  try {
    const projectId = getProjectId()
    const endpoint = `/api/projects/${projectId}/gitrepos/${providerId}/repos`

    return await apiClient.get<GitRepository[]>(endpoint)
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to fetch repositories',
      status: 0,
    }
  }
}

export const getBranches = async (repoDetails: {
  installation_id: number
  kind: string
  owner: string
  name: string
}): Promise<ApiResponse<GitBranch[]>> => {
  try {
    const projectId = getProjectId()
    const { installation_id, kind, owner, name } = repoDetails
    const endpoint = `/api/projects/${projectId}/gitrepos/${installation_id}/repos/${kind}/${owner}/${name}/branches`

    return await apiClient.get<GitBranch[]>(endpoint)
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to fetch branches',
      status: 0,
    }
  }
}

export const createApplication = async (
  formData: Record<string, unknown>
): Promise<ApiResponse<{ id: number; name: string }>> => {
  try {
    const projectId = getProjectId()
    const clusterId = getClusterId()

    const requestData = {
      ...formData,
      project_id: projectId,
      cluster_id: clusterId,
    }

    const endpoint = `/api/projects/${projectId}/clusters/${clusterId}/apps`

    return await apiClient.post(endpoint, requestData)
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'Failed to create application',
      status: 0,
    }
  }
}

export const isApiError = (
  response: ApiResponse<unknown>
): response is ApiResponse<never> & { error: string } => {
  return !!response.error
}

export const getErrorMessage = (response: ApiResponse<unknown>): string => {
  if (response.error) {
    return response.error
  }
  return 'An unexpected error occurred'
}

export const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return !!(data && typeof data === 'object' && 'error' in data)
}
