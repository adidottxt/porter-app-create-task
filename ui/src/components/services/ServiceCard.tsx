'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  ChevronDown,
  Trash2,
  Globe,
  Cpu,
  Clock,
  Edit2,
  Check,
  X,
  Settings,
  MemoryStick,
  Network,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainTab } from './tabs/MainTab'
import { ResourcesTab } from './tabs/ResourcesTab'
import { NetworkingTab } from './tabs/NetworkingTab'
import { AdvancedTab } from './tabs/AdvancedTab'
import {
  useServiceValidation,
  getServiceCompletionStatus,
} from './ServiceValidation'
import type { FormData, ServiceConfig } from '../../types/form.types'

interface ServiceCardProps {
  service: ServiceConfig
  index: number
  onRemove: () => void
}

const serviceIcons = {
  web: Globe,
  worker: Cpu,
  job: Clock,
}

const serviceLabels = {
  web: 'Web Service',
  worker: 'Worker',
  job: 'Cron Job',
}

const serviceBadgeClasses = {
  web: 'bg-[var(--ocean-teal-500)]',
  worker: 'bg-[var(--forest-green-500)]',
  job: 'bg-[var(--golden-amber-500)]',
}

export function ServiceCard({ service, index, onRemove }: ServiceCardProps) {
  const { setValue } = useFormContext<FormData>()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(service.name)

  const { hasFormErrors } = useServiceValidation(index)
  const completionStatus = getServiceCompletionStatus(service)

  const Icon = serviceIcons[service.type]
  const serviceLabel = serviceLabels[service.type]
  const badgeClass = serviceBadgeClasses[service.type]

  const hasErrors = hasFormErrors() || !completionStatus.isComplete

  const handleNameEdit = () => {
    setTempName(service.name)
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== service.name) {
      setValue(`services.${index}.name`, tempName.trim())
    } else {
      setTempName(service.name)
    }
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setTempName(service.name)
    setIsEditingName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      handleNameCancel()
    }
  }

  return (
    <div className='rounded-lg border transition-colors duration-200 bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'>
      {/* Service Header */}
      <div className='p-4'>
        {/* Service Title Row */}
        <div className='flex items-center justify-between mb-2'>
          <div className='flex-1'>
            {isEditingName ? (
              <div className='flex items-center gap-1'>
                <Input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleNameSave}
                  autoFocus
                  className='h-8 text-sm bg-[var(--nordic-gray-800)] border-[var(--nordic-gray-600)] focus:border-[var(--magic-blue-500)]'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='minimal'
                  className='h-8 w-8 p-0 hover:bg-[var(--nordic-gray-800)]'
                  onClick={handleNameSave}
                >
                  <Check className='w-3 h-3 text-[var(--forest-green-500)]' />
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='minimal'
                  className='h-8 w-8 p-0 hover:bg-[var(--nordic-gray-800)]'
                  onClick={handleNameCancel}
                >
                  <X className='w-3 h-3 text-[var(--crimson-red-500)]' />
                </Button>
              </div>
            ) : (
              <div
                className='flex items-center gap-2 group cursor-pointer w-fit'
                onClick={handleNameEdit}
              >
                <span className='text-lg font-medium text-foreground'>
                  {service.name}
                </span>
                <Edit2 className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex items-center justify-center gap-2'>
            <Button
              type='button'
              size='sm'
              variant='minimal'
              className='h-8 w-8 p-0 text-muted-foreground hover:text-[var(--crimson-red-500)] hover:bg-[var(--crimson-red-500)]/10'
              onClick={onRemove}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              size='sm'
              variant='minimal'
              className={`h-8 w-8 p-0 transition-transform duration-200 hover:bg-[var(--nordic-gray-700)] ${isExpanded ? 'rotate-180' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className='w-4 h-4 text-muted-foreground' />
            </Button>
          </div>
        </div>

        {/* Service Type Pill */}
        <Badge
          variant='secondary'
          className={`px-2 py-0.5 flex items-center gap-1 font-mono text-xs w-fit text-white border-none ${badgeClass}`}
        >
          <Icon className='w-3 h-3' />
          {serviceLabel}
        </Badge>

        {/* Error State */}
        {hasErrors && (
          <div className='mt-3 p-2 rounded-md bg-[var(--crimson-red-500)]/10 border border-[var(--crimson-red-500)]/20'>
            <div className='flex items-center gap-2 mb-1'>
              <AlertTriangle className='w-3 h-3 text-[var(--crimson-red-500)]' />
              <p className='text-xs font-medium text-[var(--crimson-red-500)]'>
                Configuration Incomplete
              </p>
            </div>
            {!completionStatus.isComplete && (
              <p className='text-xs text-[var(--crimson-red-300)]'>
                Complete{' '}
                {completionStatus.missingFields.length > 0
                  ? `${completionStatus.missingFields.slice(0, 2).join(', ')}${completionStatus.missingFields.length > 2 ? '...' : ''}`
                  : 'required fields'}{' '}
                to finish configuration.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-4 pb-4 pt-0 border-t border-[var(--nordic-gray-700)]'>
              <div className='mt-4'>
                <Tabs defaultValue='main' className='w-full'>
                  <TabsList
                    className={`grid w-full ${service.type === 'web' ? 'grid-cols-4' : 'grid-cols-3'} bg-[var(--nordic-gray-700)]`}
                  >
                    <TabsTrigger
                      value='main'
                      className='data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer'
                    >
                      <Settings className='w-4 h-4' />
                      <span className='hidden sm:inline'>Main</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='resources'
                      className='data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer'
                    >
                      <MemoryStick className='w-4 h-4' />
                      <span className='hidden sm:inline'>Resources</span>
                    </TabsTrigger>
                    {service.type === 'web' && (
                      <TabsTrigger
                        value='networking'
                        className='data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer'
                      >
                        <Network className='w-4 h-4' />
                        <span className='hidden sm:inline'>Network</span>
                      </TabsTrigger>
                    )}
                    <TabsTrigger
                      value='advanced'
                      className='data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer'
                    >
                      <Zap className='w-4 h-4' />
                      <span className='hidden sm:inline'>Advanced</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className='mt-4'>
                    <TabsContent value='main' className='mt-0'>
                      <MainTab
                        serviceIndex={index}
                        serviceType={service.type}
                      />
                    </TabsContent>

                    <TabsContent value='resources' className='mt-0'>
                      <ResourcesTab serviceIndex={index} />
                    </TabsContent>

                    {service.type === 'web' && (
                      <TabsContent value='networking' className='mt-0'>
                        <NetworkingTab serviceIndex={index} />
                      </TabsContent>
                    )}

                    <TabsContent value='advanced' className='mt-0'>
                      <AdvancedTab
                        serviceIndex={index}
                        serviceType={service.type}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
