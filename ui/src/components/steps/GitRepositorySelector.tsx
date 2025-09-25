'use client'

import { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Loader2, Package, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import {
  getGitProviders,
  getRepositories,
  getBranches,
  isApiError,
} from '../../services/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GitProvider, GitRepository, GitBranch } from '../../types'
import type { FormData } from '../../types/form.types'

export function GitRepositorySelector() {
  const { control, setValue, watch, trigger } = useFormContext<FormData>()

  // Form state
  const selectedProvider = watch('sourceConfig.gitProvider')
  const selectedRepository = watch('sourceConfig.repository')
  const selectedBranch = watch('sourceConfig.branch')
  const isMonorepo = watch('sourceConfig.isMonorepo')
  const selectedBuildpack = watch('sourceConfig.buildpack')
  const isMonorepoFromStep1 = watch('isMonorepo') // From first section

  // Loading states
  const [providersLoading, setProvidersLoading] = useState(false)
  const [repositoriesLoading, setRepositoriesLoading] = useState(false)
  const [branchesLoading, setBranchesLoading] = useState(false)

  // Data states
  const [providers, setProviders] = useState<GitProvider[]>([])
  const [repositories, setRepositories] = useState<GitRepository[]>([])
  const [branches, setBranches] = useState<GitBranch[]>([])

  // Error states
  const [providersError, setProvidersError] = useState<string>('')
  const [repositoriesError, setRepositoriesError] = useState<string>('')
  const [branchesError, setBranchesError] = useState<string>('')

  // Load Git providers on component mount
  useEffect(() => {
    const loadProviders = async () => {
      setProvidersLoading(true)
      setProvidersError('')

      try {
        const response = await getGitProviders()
        if (isApiError(response)) {
          // For demo purposes, provide mock data if API fails
          console.warn('API failed, using mock data:', response.error)
          setProviders([
            {
              id: 1,
              account_id: 1,
              installation_id: 1,
              name: 'GitHub (Demo)',
              provider: 'github',
            },
            {
              id: 2,
              account_id: 2,
              installation_id: 2,
              name: 'GitLab (Demo)',
              provider: 'gitlab',
            },
          ])
        } else {
          setProviders(response.data || [])
        }
      } catch (error) {
        console.warn('Provider loading failed, using mock data:', error)
        // Provide mock data for development
        setProviders([
          {
            id: 1,
            account_id: 1,
            installation_id: 1,
            name: 'GitHub (Demo)',
            provider: 'github',
          },
          {
            id: 2,
            account_id: 2,
            installation_id: 2,
            name: 'GitLab (Demo)',
            provider: 'gitlab',
          },
        ])
      } finally {
        setProvidersLoading(false)
      }
    }

    loadProviders()
  }, [])

  // Load repositories when provider changes
  useEffect(() => {
    if (!selectedProvider?.id) {
      setRepositories([])
      setBranches([])
      setValue('sourceConfig.repository', undefined)
      setValue('sourceConfig.branch', undefined)
      return
    }

    const loadRepositories = async () => {
      setRepositoriesLoading(true)
      setRepositoriesError('')

      try {
        const response = await getRepositories(selectedProvider.id)
        if (isApiError(response)) {
          console.warn(
            'Repository API failed, using mock data:',
            response.error
          )
          // Mock data for development
          setRepositories([
            { FullName: 'porter-dev/sample-app', Kind: 'github' },
            { FullName: 'porter-dev/react-demo', Kind: 'github' },
            { FullName: 'porter-dev/node-api', Kind: 'github' },
            { FullName: 'porter-dev/python-service', Kind: 'github' },
          ])
        } else {
          setRepositories(response.data || [])
        }
      } catch (error) {
        console.warn('Repository loading failed, using mock data:', error)
        // Mock data for development
        setRepositories([
          { FullName: 'porter-dev/sample-app', Kind: 'github' },
          { FullName: 'porter-dev/react-demo', Kind: 'github' },
          { FullName: 'porter-dev/node-api', Kind: 'github' },
          { FullName: 'porter-dev/python-service', Kind: 'github' },
        ])
      } finally {
        setRepositoriesLoading(false)
      }
    }

    loadRepositories()
  }, [selectedProvider, setValue])

  // Load branches when repository changes
  useEffect(() => {
    console.log('Branch loading effect triggered:', {
      selectedRepository,
      selectedProvider,
      hasFullName: !!selectedRepository?.FullName,
      hasProvider: !!selectedProvider,
    })

    if (!selectedRepository?.FullName || !selectedProvider) {
      console.log('Clearing branches - missing requirements')
      setBranches([])
      setValue('sourceConfig.branch', undefined)
      return
    }

    const loadBranches = async () => {
      setBranchesLoading(true)
      setBranchesError('')

      try {
        const [owner, name] = selectedRepository.FullName.split('/')
        const response = await getBranches({
          installation_id: selectedProvider.installation_id,
          kind: selectedRepository.Kind,
          owner,
          name,
        })

        if (isApiError(response)) {
          console.warn('Branches API failed, using mock data:', response.error)
          // Mock data for development
          const mockBranches = [
            { name: 'main', protected: false },
            { name: 'develop', protected: false },
            { name: 'feature/auth', protected: false },
            { name: 'release/v1.0', protected: true },
          ]
          console.log('Setting mock branches:', mockBranches)
          setBranches(mockBranches)
        } else {
          console.log('Setting API branches:', response.data)
          // Handle API returning array of strings vs array of objects
          const branchData = response.data || []
          const formattedBranches = branchData.map(
            (branch: unknown): GitBranch => {
              // If branch is a string, convert it to the expected object format
              if (typeof branch === 'string') {
                return { name: branch, protected: false }
              }
              // If branch is already an object, use as-is (cast to GitBranch)
              return branch as GitBranch
            }
          )
          setBranches(formattedBranches)
        }
      } catch (error) {
        console.warn('Branch loading failed, using mock data:', error)
        // Mock data for development
        const fallbackBranches = [
          { name: 'main', protected: false },
          { name: 'develop', protected: false },
          { name: 'feature/auth', protected: false },
          { name: 'release/v1.0', protected: true },
        ]
        console.log('Setting fallback branches:', fallbackBranches)
        setBranches(fallbackBranches)
      } finally {
        setBranchesLoading(false)
      }
    }

    loadBranches()
  }, [selectedRepository, selectedProvider, setValue])

  console.log('Current branches state:', branches, 'length:', branches.length)

  // Buildpack detection (mock logic for now)
  useEffect(() => {
    if (selectedRepository && selectedBranch) {
      // In a real implementation, this would analyze the repository
      // For now, we'll just set detected buildpack based on common patterns
      const repoName = selectedRepository.FullName.toLowerCase()
      let detectedBuildpack = 'nodejs' // Default to Node.js

      if (
        repoName.includes('python') ||
        repoName.includes('django') ||
        repoName.includes('flask')
      ) {
        detectedBuildpack = 'python'
      } else if (repoName.includes('go') || repoName.includes('golang')) {
        detectedBuildpack = 'go'
      } else if (repoName.includes('java')) {
        detectedBuildpack = 'java'
      } else if (repoName.includes('docker')) {
        detectedBuildpack = 'docker'
      }
      // Default to nodejs for everything else including node/js/react repos

      setValue('sourceConfig.buildpack', detectedBuildpack)
    }
  }, [selectedRepository, selectedBranch, setValue])

  // Sync monorepo setting from step 1
  useEffect(() => {
    if (isMonorepoFromStep1 !== undefined) {
      setValue('sourceConfig.isMonorepo', isMonorepoFromStep1)
    }
  }, [isMonorepoFromStep1, setValue])

  const buildpackOptions = [
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'docker', label: 'Dockerfile' },
  ]

  return (
    <div className='space-y-6'>
      {/* Git Provider Selection */}
      <div>
        <label className='text-sm font-medium text-foreground mb-2 block'>
          Git Provider
          <span className='text-[var(--crimson-red-500)]'>*</span>
        </label>
        <Controller
          name='sourceConfig.gitProvider'
          control={control}
          rules={{ required: 'Git provider is required' }}
          render={({ field, fieldState }) => (
            <div>
              <div className='relative'>
                <Select
                  value={field.value?.id?.toString() ?? ''}
                  onValueChange={value => {
                    if (value) {
                      const providerId = parseInt(value)
                      const provider = providers.find(p => p.id === providerId)
                      field.onChange(provider)
                      trigger('sourceConfig.gitProvider')
                    } else {
                      field.onChange(undefined)
                    }
                  }}
                  disabled={providersLoading || providers.length === 0}
                >
                  <SelectTrigger
                    className={`
                    w-full
                    bg-[var(--nordic-gray-900)]
                    border-[var(--nordic-gray-700)]
                    text-foreground
                    focus:border-[var(--magic-blue-500)]
                    focus:ring-[var(--magic-blue-500)]/20
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${fieldState.error ? 'border-[var(--crimson-red-500)]' : ''}
                  `}
                  >
                    <SelectValue
                      placeholder={
                        providersLoading
                          ? 'Loading providers...'
                          : 'Select a Git provider'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'>
                    {providers.map(provider => (
                      <SelectItem
                        key={provider.id}
                        value={provider.id.toString()}
                        className='text-foreground hover:bg-[var(--nordic-gray-800)] focus:bg-[var(--nordic-gray-800)]'
                      >
                        {provider.name} ({provider.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {providersLoading && (
                  <Loader2 className='absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--magic-blue-500)] animate-spin pointer-events-none' />
                )}
              </div>
              {providersError && (
                <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                  {providersError}
                </p>
              )}
              {fieldState.error && (
                <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Repository Selection */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <label className='text-sm font-medium text-foreground mb-2 block'>
              Repository
              <span className='text-[var(--crimson-red-500)]'>*</span>
            </label>
            <Controller
              name='sourceConfig.repository'
              control={control}
              rules={{ required: 'Repository is required' }}
              render={({ field, fieldState }) => (
                <div>
                  <div className='relative'>
                    <Select
                      value={field.value?.FullName ?? ''}
                      onValueChange={value => {
                        if (value) {
                          const repo = repositories.find(
                            r => r.FullName === value
                          )
                          field.onChange(repo)
                          trigger('sourceConfig.repository')
                        } else {
                          field.onChange(undefined)
                        }
                      }}
                      disabled={
                        repositoriesLoading || repositories.length === 0
                      }
                    >
                      <SelectTrigger
                        className={`
                      w-full
                      bg-[var(--nordic-gray-900)]
                      border-[var(--nordic-gray-700)]
                      text-foreground
                      focus:border-[var(--magic-blue-500)]
                      focus:ring-[var(--magic-blue-500)]/20
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${fieldState.error ? 'border-[var(--crimson-red-500)]' : ''}
                    `}
                      >
                        <SelectValue
                          placeholder={
                            repositoriesLoading
                              ? 'Loading repositories...'
                              : 'Select a repository'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'>
                        {repositories.length === 0 && !repositoriesLoading ? (
                          <div className='p-4 text-center'>
                            <p className='text-muted-foreground text-sm mb-2'>
                              No Git Repositories Found
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              Try selecting a different Git account or
                              organization.
                            </p>
                          </div>
                        ) : (
                          repositories.map(repo => (
                            <SelectItem
                              key={repo.FullName}
                              value={repo.FullName}
                              className='text-foreground hover:bg-[var(--nordic-gray-800)] focus:bg-[var(--nordic-gray-800)]'
                            >
                              {repo.FullName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {repositoriesLoading && (
                      <Loader2 className='absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--magic-blue-500)] animate-spin pointer-events-none' />
                    )}
                  </div>
                  {repositoriesError && (
                    <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                      {repositoriesError}
                    </p>
                  )}
                  {fieldState.error && (
                    <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Loading State */}
      <AnimatePresence>
        {selectedRepository && branches.length === 0 && branchesLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <label className='text-sm font-medium text-foreground mb-2 block'>
              Branch
              <span className='text-[var(--crimson-red-500)]'>*</span>
            </label>
            <div className='flex items-center justify-center p-4 border border-dashed border-[var(--nordic-gray-700)] rounded-lg bg-[var(--nordic-gray-900)]'>
              <Loader2 className='w-4 h-4 text-[var(--magic-blue-500)] animate-spin mr-2' />
              <span className='text-sm text-muted-foreground'>
                Loading branches...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Selection */}
      <AnimatePresence>
        {selectedRepository && branches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <label className='text-sm font-medium text-foreground mb-2 block'>
              Branch
              <span className='text-[var(--crimson-red-500)]'>*</span>
            </label>
            <Controller
              name='sourceConfig.branch'
              control={control}
              rules={{ required: 'Branch is required' }}
              render={({ field, fieldState }) => (
                <div>
                  <div className='relative'>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={value => {
                        field.onChange(value || undefined)
                        if (value) {
                          trigger('sourceConfig.branch')
                        }
                      }}
                      disabled={branchesLoading || branches.length === 0}
                    >
                      <SelectTrigger
                        className={`
                      w-full
                      bg-[var(--nordic-gray-900)]
                      border-[var(--nordic-gray-700)]
                      text-foreground
                      focus:border-[var(--magic-blue-500)]
                      focus:ring-[var(--magic-blue-500)]/20
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${fieldState.error ? 'border-[var(--crimson-red-500)]' : ''}
                    `}
                      >
                        <SelectValue
                          placeholder={
                            branchesLoading
                              ? 'Loading branches...'
                              : branches.length === 0 && !branchesLoading
                                ? 'No branches available'
                                : 'Select a branch'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'>
                        {branches.map(branch => (
                          <SelectItem
                            key={`branch-${branch.name}`}
                            value={branch.name}
                            className='text-foreground hover:bg-[var(--nordic-gray-800)] focus:bg-[var(--nordic-gray-800)]'
                          >
                            {branch.name} {branch.protected && '(protected)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {branchesLoading && (
                      <Loader2 className='absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--magic-blue-500)] animate-spin pointer-events-none' />
                    )}
                  </div>
                  {branchesError && (
                    <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                      {branchesError}
                    </p>
                  )}
                  {fieldState.error && (
                    <p className='text-[var(--crimson-red-500)] text-xs mt-1'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buildpack Detection */}
      <AnimatePresence>
        {selectedBranch && (
          <motion.div
            className='space-y-6'
            initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className='flex items-center gap-2 mb-2'>
              <label className='text-sm font-medium text-foreground'>
                Buildpack
              </label>
              <TooltipPrimitive.Provider delayDuration={0}>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <Info className='h-4 w-4 text-[var(--nordic-gray-400)] hover:text-[var(--magic-blue-500)] cursor-pointer transition-colors' />
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      className='z-50 max-w-xs rounded-md bg-[var(--nordic-gray-900)] px-3 py-2 text-sm text-foreground shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
                      sideOffset={8}
                    >
                      <p className='text-sm'>
                        Buildpacks automatically detect your application&apos;s
                        language and framework, then handle the build process
                        including dependency installation, compilation, and
                        packaging for deployment.
                      </p>
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              </TooltipPrimitive.Provider>
            </div>
            <div className='flex items-center space-x-2 mb-2'>
              <Package className='h-4 w-4 text-[var(--magic-blue-500)]' />
              <Badge className='bg-[var(--magic-blue-500)]/20 text-[var(--magic-blue-300)] border-[var(--magic-blue-500)]/40 font-mono'>
                {buildpackOptions.find(bp => bp.value === selectedBuildpack)
                  ?.label || 'Node.js'}
              </Badge>
            </div>
            <Controller
              name='sourceConfig.buildpack'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    value={field.value || 'nodejs'}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className='w-full bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)] text-foreground focus:border-[var(--magic-blue-500)] focus:ring-[var(--magic-blue-500)]/20'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)]'>
                      {buildpackOptions.map(option => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='text-foreground hover:bg-[var(--nordic-gray-800)] focus:bg-[var(--nordic-gray-800)]'
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Porter will automatically detect your application&apos;s
                    language and framework.
                  </p>
                </div>
              )}
            />

            {/* Monorepo Question */}
            <div>
              <Controller
                name='sourceConfig.isMonorepo'
                control={control}
                render={({ field }) => (
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='sourceConfigMonorepo'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='border-[var(--nordic-gray-600)] data-[state=checked]:bg-[var(--magic-blue-500)] data-[state=checked]:border-[var(--magic-blue-500)]'
                    />
                    <label
                      htmlFor='sourceConfigMonorepo'
                      className='text-sm font-medium text-foreground cursor-pointer'
                    >
                      Is this repository a monorepo?
                    </label>
                  </div>
                )}
              />

              {/* Monorepo Warning */}
              <AnimatePresence>
                {isMonorepo && (
                  <motion.div
                    className='mt-3'
                    initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    <Alert className='border-[var(--golden-amber-500)] bg-[var(--golden-amber-500)]/10'>
                      <AlertTriangle
                        className='h-4 w-4'
                        style={{ color: 'var(--golden-amber-100)' }}
                      />
                      <AlertDescription className='text-[var(--golden-amber-100)]'>
                        Because you are trying to deploy a monorepo, you&apos;ll
                        need to specify the root path in advanced settings.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Settings Accordion */}
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem
                value='advanced-settings'
                className='border-[var(--nordic-gray-700)]'
              >
                <AccordionTrigger className='text-sm font-medium text-foreground hover:text-[var(--magic-blue-500)] transition-colors'>
                  Advanced Settings
                </AccordionTrigger>
                <AccordionContent className='space-y-4 pt-4'>
                  {/* Root Path */}
                  <div>
                    <label className='text-sm font-medium text-foreground mb-2 block'>
                      Root Path
                    </label>
                    <Controller
                      name='sourceConfig.advancedSettings.rootPath'
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Input
                            {...field}
                            placeholder='/path/to/app (leave empty for repository root)'
                            className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)] text-foreground'
                          />
                          <p className='text-xs text-muted-foreground mt-1'>
                            Specify the directory containing your application
                            code. Useful for monorepos.
                          </p>
                        </div>
                      )}
                    />
                  </div>

                  {/* Porter YAML Path */}
                  <div>
                    <label className='text-sm font-medium text-foreground mb-2 block'>
                      Porter YAML Path
                    </label>
                    <Controller
                      name='sourceConfig.advancedSettings.porterYamlPath'
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Input
                            {...field}
                            placeholder='./porter.yaml (optional)'
                            className='bg-[var(--nordic-gray-900)] border-[var(--nordic-gray-700)] text-foreground'
                          />
                          <p className='text-xs text-muted-foreground mt-1'>
                            Path to your Porter configuration file, if different
                            from the default location.
                          </p>
                        </div>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
