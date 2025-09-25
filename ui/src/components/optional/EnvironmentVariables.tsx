'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Upload } from 'lucide-react'
import type { FormData } from '../../types/form.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef } from 'react'

export function EnvironmentVariables() {
  const { control, watch } = useFormContext<FormData>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'optionalConfig.environmentVars',
  })

  const environmentVars = watch('optionalConfig.environmentVars')

  const addVariable = () => {
    append({ key: '', value: '' })
  }

  const removeVariable = (index: number) => {
    remove(index)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      if (!content) return

      try {
        // Parse different formats
        const lines = content.split('\n').filter(line => line.trim())
        const newVars: Array<{ key: string; value: string }> = []

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            // Handle KEY=VALUE format
            const equalIndex = trimmedLine.indexOf('=')
            if (equalIndex > 0) {
              const key = trimmedLine.substring(0, equalIndex).trim()
              const value = trimmedLine.substring(equalIndex + 1).trim()
              // Remove quotes if present
              const cleanValue = value.replace(/^["']|["']$/g, '')
              newVars.push({ key, value: cleanValue })
            }
          }
        }

        // Add all parsed variables
        newVars.forEach(variable => append(variable))
      } catch (error) {
        console.error('Error parsing environment file:', error)
      }
    }

    reader.readAsText(file)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='p-6 rounded-lg bg-[var(--nordic-gray-900)]'>
      <div className='space-y-4'>
        {/* Environment Variables List */}
        <div className='space-y-3'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex items-center gap-2'>
              <div className='flex-1'>
                <Label htmlFor={`env-key-${index}`} className='sr-only'>
                  Environment variable key {index + 1}
                </Label>
                <Input
                  id={`env-key-${index}`}
                  placeholder='KEY'
                  {...control.register(
                    `optionalConfig.environmentVars.${index}.key`
                  )}
                  className='text-sm'
                />
              </div>
              <div className='flex-1'>
                <Label htmlFor={`env-value-${index}`} className='sr-only'>
                  Environment variable value {index + 1}
                </Label>
                <Input
                  id={`env-value-${index}`}
                  placeholder='value'
                  type='password'
                  {...control.register(
                    `optionalConfig.environmentVars.${index}.value`
                  )}
                  className='text-sm'
                />
              </div>
              <Button
                type='button'
                variant='minimal'
                size='sm'
                onClick={() => removeVariable(index)}
                className='p-2 text-muted-foreground hover:text-[var(--crimson-red-500)] hover:bg-[var(--crimson-red-500)]/10'
              >
                <Trash2 className='h-4 w-4' />
                <span className='sr-only'>Remove variable {index + 1}</span>
              </Button>
            </div>
          ))}

          {fields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground space-y-4'>
              <div>
                <p className='text-base font-medium'>
                  No environment variables configured
                </p>
                <p className='text-xs'>
                  Click &quot;Add Variable&quot; to set environment variables
                  for your application
                </p>
                <p className='text-xs'>
                  File import supports .env format (KEY=VALUE)
                </p>
              </div>

              {/* Buttons Row */}
              <div className='flex items-center justify-center gap-3'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={() => fileInputRef.current?.click()}
                  className='gap-2'
                >
                  <Upload className='h-4 w-4' />
                  Import from file
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={addVariable}
                  className='gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Variable
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add Variable Button - Only shown when variables exist */}
        {fields.length > 0 && (
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              className='gap-2'
            >
              <Upload className='h-4 w-4' />
              Import from file
            </Button>
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={addVariable}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              Add Variable
            </Button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='.env,.txt'
          onChange={handleFileImport}
          className='hidden'
        />

        {environmentVars && environmentVars.length > 0 && (
          <div className='text-xs text-muted-foreground'>
            {environmentVars.length} environment variable
            {environmentVars.length !== 1 ? 's' : ''} configured
          </div>
        )}
      </div>
    </div>
  )
}
