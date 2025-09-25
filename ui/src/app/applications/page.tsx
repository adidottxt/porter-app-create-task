'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const dummyApplications = [
  {
    name: 'snake',
    repository: 'adidotxxt/snake-test',
    lastDeploy: '10:53 PM on 9/25/2025',
    status: 'active',
  },
  {
    name: 'tetris',
    repository: 'bsord/tetris:latest',
    lastDeploy: '11:46 AM on 9/24/2025',
    status: 'active',
  },
]

export default function ApplicationsPage() {
  const router = useRouter()
  const [deployedApps, setDeployedApps] = useState<Array<{
    id: number
    name: string
    repository: string
    lastDeploy: string
    status: string
  }>>([])

  // Load deployed apps from localStorage on mount
  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem('deployedApps') || '[]') as Array<{
      id: number
      name: string
      repository: string
      lastDeploy: string
      status: string
    }>
    setDeployedApps(storedApps)
  }, [])

  // Combine dummy apps with deployed apps
  const allApplications = [...dummyApplications, ...deployedApps]
  const hasApplications = allApplications.length > 0

  return (
    <div className='p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-semibold text-foreground'>
              Applications
            </h1>
            <p className='text-muted-foreground text-sm mt-0.5'>
              Web services, workers, and jobs for this project
            </p>
          </div>
          <Button onClick={() => router.push('/applications/new')}>
            <Plus size={16} />
            Create New App
          </Button>
        </div>

        {hasApplications ? (
          <div className='bg-[var(--nordic-gray-900)] border border-[var(--nordic-gray-800)] rounded-xl overflow-hidden shadow-2xl'>
            <Table>
              <TableHeader>
                <TableRow className='border-b border-[var(--nordic-gray-800)] hover:bg-transparent'>
                  <TableHead className='text-[var(--nordic-gray-400)] font-medium text-sm py-6 px-8 tracking-wide uppercase text-xs'>
                    Application
                  </TableHead>
                  <TableHead className='text-[var(--nordic-gray-400)] font-medium text-sm py-6 px-8 tracking-wide uppercase text-xs'>
                    Repository
                  </TableHead>
                  <TableHead className='text-[var(--nordic-gray-400)] font-medium text-sm py-6 px-8 tracking-wide uppercase text-xs'>
                    Last Deploy
                  </TableHead>
                  <TableHead className='text-[var(--nordic-gray-400)] font-medium text-sm py-6 px-8 tracking-wide uppercase text-xs'>
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allApplications.map((app, index) => (
                  <TableRow
                    key={app.name}
                    className={`border-b border-[var(--nordic-gray-800)] hover:bg-[var(--nordic-gray-800)]/50 cursor-pointer transition-all duration-200 ${
                      index === allApplications.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <TableCell className='py-7 px-8'>
                      <div className='flex items-center gap-4'>
                        <div className='w-8 h-8 bg-[var(--nordic-gray-800)] rounded-lg flex items-center justify-center border border-[var(--nordic-gray-700)]'>
                          <GitBranch
                            size={16}
                            className='text-[var(--nordic-gray-400)]'
                          />
                        </div>
                        <span className='text-white font-semibold text-base tracking-tight'>
                          {app.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-7 px-8'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-[var(--nordic-gray-500)] rounded-full' />
                        <span className='text-[var(--nordic-gray-300)] text-sm font-medium'>
                          {app.repository}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-7 px-8'>
                      <span className='text-[var(--nordic-gray-300)] text-sm font-medium'>
                        {app.lastDeploy}
                      </span>
                    </TableCell>
                    <TableCell className='py-7 px-8'>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit ${
                          app.status === 'active'
                            ? 'bg-green-500/10 border-green-500/20'
                            : app.status === 'pending'
                              ? 'bg-yellow-500/10 border-yellow-500/20'
                              : 'bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            app.status === 'active'
                              ? 'bg-green-400'
                              : app.status === 'pending'
                                ? 'bg-yellow-400'
                                : 'bg-red-400'
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold capitalize tracking-tight ${
                            app.status === 'active'
                              ? 'text-green-400'
                              : app.status === 'pending'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            title='No Applications Found'
            description="You haven't deployed any applications yet. Create your first application to get started with Porter."
          />
        )}
      </div>
    </div>
  )
}
