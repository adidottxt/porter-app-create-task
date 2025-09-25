interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

interface RequestConfig {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = { method: 'GET' }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = { ...this.defaultHeaders, ...config.headers }

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      let data = null
      let errorData = null

      try {
        if (response.ok) {
          data = await response.json()
        } else {
          errorData = await response.json()
        }
      } catch {}

      if (!response.ok) {
        const errorMessage =
          errorData?.error ||
          errorData?.message ||
          errorData?.detail ||
          `HTTP ${response.status}`

        return {
          error: errorMessage,
          status: response.status,
          data: errorData,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      }
    }
  }

  async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }
}

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

const apiClient = new ApiClient(getApiBaseUrl())

export { apiClient, ApiClient }
export type { ApiResponse }
