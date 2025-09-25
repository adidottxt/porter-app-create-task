import type { ApiResponse } from './apiClient'

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType
  message: string
  statusCode?: number
  details?: unknown
}

const getErrorTypeFromStatus = (status: number): ErrorType => {
  switch (true) {
    case status === 0:
      return ErrorType.NETWORK_ERROR
    case status === 401:
      return ErrorType.AUTHENTICATION_ERROR
    case status === 403:
      return ErrorType.AUTHORIZATION_ERROR
    case status === 404:
      return ErrorType.NOT_FOUND_ERROR
    case status >= 400 && status < 500:
      return ErrorType.VALIDATION_ERROR
    case status >= 500:
      return ErrorType.SERVER_ERROR
    default:
      return ErrorType.UNKNOWN_ERROR
  }
}

export const createAppError = (response: ApiResponse<unknown>): AppError => {
  const errorType = getErrorTypeFromStatus(response.status)

  return {
    type: errorType,
    message: response.error || 'An unexpected error occurred',
    statusCode: response.status,
    details: response,
  }
}

export const getUserFriendlyErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    case ErrorType.AUTHENTICATION_ERROR:
      return 'You need to log in to access this resource.'
    case ErrorType.AUTHORIZATION_ERROR:
      return 'You do not have permission to perform this action.'
    case ErrorType.NOT_FOUND_ERROR:
      return 'The requested resource was not found.'
    case ErrorType.VALIDATION_ERROR:
      return error.message || 'Please check your input and try again.'
    case ErrorType.SERVER_ERROR:
      return 'A server error occurred. Please try again later.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}

export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.error) {
    const appError = createAppError(response)
    throw appError
  }

  if (!response.data) {
    throw createAppError({
      error: 'No data received',
      status: response.status,
    })
  }

  return response.data
}
