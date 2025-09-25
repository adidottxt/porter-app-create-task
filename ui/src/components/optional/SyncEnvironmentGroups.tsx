'use client'

import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Link } from 'lucide-react'
import type { FormData } from '../../types/form.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function SyncEnvironmentGroups() {
  const { control, watch } = useFormContext<FormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'optionalConfig.syncGroups',
  })

  const syncGroups = watch('optionalConfig.syncGroups')

  const addSyncGroup = () => {
    append({ name: '', description: '' })
  }

  const removeSyncGroup = (index: number) => {
    remove(index)
  }

  return (
    <div className='p-6 rounded-lg bg-[var(--nordic-gray-900)]'>
      <div className='space-y-4'>
        {/* Sync Groups List */}
        <div className='space-y-3'>
          {fields.map((field, index) => (
            <div key={field.id} className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='flex-1'>
                  <Label htmlFor={`sync-group-${index}`} className='sr-only'>
                    Sync group name {index + 1}
                  </Label>
                  <Input
                    id={`sync-group-${index}`}
                    placeholder='Environment group name (e.g., shared-database-config)'
                    {...control.register(
                      `optionalConfig.syncGroups.${index}.name`
                    )}
                    className='text-sm'
                  />
                </div>
                <Button
                  type='button'
                  variant='minimal'
                  size='sm'
                  onClick={() => removeSyncGroup(index)}
                  className='p-2 text-muted-foreground hover:text-[var(--crimson-red-500)] hover:bg-[var(--crimson-red-500)]/10'
                >
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Remove sync group {index + 1}</span>
                </Button>
              </div>
              <div>
                <Label
                  htmlFor={`sync-description-${index}`}
                  className='sr-only'
                >
                  Sync group description {index + 1}
                </Label>
                <Input
                  id={`sync-description-${index}`}
                  placeholder='Description (optional)'
                  {...control.register(
                    `optionalConfig.syncGroups.${index}.description`
                  )}
                  className='text-sm'
                />
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground space-y-4'>
              <div>
                <Link className='h-8 w-8 mx-auto mb-2 opacity-50' />
                <p className='text-base font-medium'>
                  No sync groups configured
                </p>
                <p className='text-xs'>
                  Link environment groups to share configuration across
                  applications
                </p>
              </div>
              <div className='flex justify-center'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  onClick={addSyncGroup}
                  className='gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add Sync Group
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add Sync Group Button - Only shown when groups exist */}
        {fields.length > 0 && (
          <Button
            type='button'
            variant='secondary'
            size='sm'
            onClick={addSyncGroup}
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Sync Group
          </Button>
        )}

        {syncGroups && syncGroups.length > 0 && (
          <div className='flex items-center gap-2'>
            <div className='text-xs text-muted-foreground'>
              {syncGroups.length} sync group
              {syncGroups.length !== 1 ? 's' : ''} configured
            </div>
            <Badge
              variant='secondary'
              className='text-xs bg-[var(--golden-amber-500)]/20 text-[var(--golden-amber-300)] border-[var(--golden-amber-500)]/40'
            >
              <Link className='h-3 w-3 mr-1' />
              Shared Config
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
