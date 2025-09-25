'use client'

import React from 'react'
import { Button } from './ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback

      if (Fallback && this.state.error) {
        return (
          <Fallback
            error={this.state.error}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        )
      }

      return <DefaultErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
}

function DefaultErrorFallback({ error }: DefaultErrorFallbackProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] p-8 text-center'>
      <div className='max-w-md'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-crimsonRed-100 flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-crimsonRed-700'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Something went wrong
        </h2>

        <p className='text-muted-foreground mb-6'>
          {error?.message ||
            'An unexpected error occurred. Please try refreshing the page.'}
        </p>

        <Button onClick={() => window.location.reload()} variant='primary'>
          Reload Page
        </Button>

        {process.env.NODE_ENV === 'development' && error && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-muted-foreground hover:text-foreground'>
              Technical Details
            </summary>
            <pre className='mt-2 p-3 text-xs bg-nordicGray-900 rounded-lg overflow-auto text-nordicGray-200'>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
