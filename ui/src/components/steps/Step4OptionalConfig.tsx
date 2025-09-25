'use client'

import { Info } from 'lucide-react'
import { EnvironmentVariables } from '../optional/EnvironmentVariables'
import { SyncEnvironmentGroups } from '../optional/SyncEnvironmentGroups'
import { PreDeployJobs } from '../optional/PreDeployJobs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function Step4OptionalConfig() {
  return (
    <div className='max-w-6xl mx-auto pr-8 py-4'>
      <div className='max-w-2xl'>
        <div className='space-y-6'>
          {/* Header */}
          <div>
            <h2 className='text-lg font-medium text-foreground'>
              Optional Configuration
            </h2>
            <p className='text-sm text-muted-foreground'>
              Configure environment variables, sync groups, and pre-deploy jobs
              for your application.
            </p>
          </div>

          {/* Accordion for optional sections */}
          <Accordion type='multiple' className='w-full'>
            {/* Environment Variables Section */}
            <AccordionItem value='environment-variables'>
              <AccordionTrigger className='text-left hover:no-underline cursor-pointer hover:bg-[var(--nordic-gray-800)]/50 rounded-md transition-colors'>
                <div className='flex items-center gap-2'>
                  <span className='text-md font-medium'>
                    Environment Variables
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Environment variables are encrypted and stored securely.
                        Sensitive values like API keys and database passwords
                        are recommended to be managed through Porter&apos;s
                        secret management.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <EnvironmentVariables />
              </AccordionContent>
            </AccordionItem>

            {/* Sync Environment Groups Section */}
            <AccordionItem value='sync-groups'>
              <AccordionTrigger className='text-left hover:no-underline cursor-pointer hover:bg-[var(--nordic-gray-800)]/50 rounded-md transition-colors'>
                <div className='flex items-center gap-2'>
                  <span className='text-md font-medium'>
                    Sync Environment Groups
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent className='max-w-sm'>
                      <div className='space-y-2'>
                        <p>
                          Sync environment groups allow you to share common
                          configuration across multiple applications. Changes to
                          a sync group automatically update all linked
                          applications.
                        </p>
                        <div>
                          <p className='font-medium mb-1'>Common examples:</p>
                          <ul className='text-xs space-y-0.5'>
                            <li>
                              • shared-database - Database connection settings
                            </li>
                            <li>• redis-config - Redis cache configuration</li>
                            <li>• monitoring - APM and monitoring keys</li>
                            <li>
                              • feature-flags - Application feature toggles
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <SyncEnvironmentGroups />
              </AccordionContent>
            </AccordionItem>

            {/* Pre-Deploy Jobs Section */}
            <AccordionItem value='predeploy-jobs'>
              <AccordionTrigger className='text-left hover:no-underline cursor-pointer hover:bg-[var(--nordic-gray-800)]/50 rounded-md transition-colors'>
                <div className='flex items-center gap-2'>
                  <span className='text-md font-medium'>Pre-Deploy Jobs</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='h-4 w-4 text-muted-foreground hover:text-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent className='max-w-sm'>
                      <div className='space-y-2'>
                        <p>
                          Pre-deploy jobs run before your application is
                          deployed. Use them for database migrations, asset
                          compilation, or other preparation tasks. Jobs must
                          complete successfully for deployment to proceed.
                        </p>
                        <div>
                          <p className='font-medium mb-1'>Common examples:</p>
                          <ul className='text-xs space-y-0.5'>
                            <li>• Database Migration: npm run migrate</li>
                            <li>• Asset Compilation: npm run build:assets</li>
                            <li>
                              • Django Migration: python manage.py migrate
                            </li>
                            <li>
                              • Rails Migration: bundle exec rake db:migrate
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <PreDeployJobs />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

// Export validation function for use in MultiStepForm
export function validateStep4(): boolean {
  // Step 4 is always valid since it's optional configuration
  return true
}
