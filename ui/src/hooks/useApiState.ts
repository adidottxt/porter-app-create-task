import { useState, useCallback } from 'react'
import type { ApiResponse } from '../utils/apiClient'
import {
  createAppError,
  type AppError,
  ErrorType,
} from '../utils/errorHandling'

export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: AppError | null
}

export const useApiState = <T>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (
      apiCall: () => Promise<ApiResponse<T>>,
      onSuccess?: (data: T) => void,
      onError?: (error: AppError) => void
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await apiCall()

        if (response.error) {
          const error = createAppError(response)
          setState({ data: null, loading: false, error })
          onError?.(error)
          return null
        }

        setState({ data: response.data || null, loading: false, error: null })
        onSuccess?.(response.data as T)
        return response.data || null
      } catch (error) {
        const appError: AppError = {
          type: ErrorType.UNKNOWN_ERROR,
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        }
        setState({ data: null, loading: false, error: appError })
        onError?.(appError)
        return null
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  const setError = useCallback((error: AppError) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  }
}

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<AppError | null>(null)

  const submit = useCallback(
    async <T>(
      submitFn: () => Promise<ApiResponse<T>>,
      onSuccess?: (data: T) => void,
      onError?: (error: AppError) => void
    ): Promise<boolean> => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const response = await submitFn()

        if (response.error) {
          const error = createAppError(response)
          setSubmitError(error)
          onError?.(error)
          return false
        }

        onSuccess?.(response.data as T)
        return true
      } catch (error) {
        const appError: AppError = {
          type: ErrorType.UNKNOWN_ERROR,
          message: error instanceof Error ? error.message : 'Submission failed',
        }
        setSubmitError(appError)
        onError?.(appError)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setSubmitError(null)
  }, [])

  return {
    isSubmitting,
    submitError,
    submit,
    clearError,
  }
}
