'use client'

import {
  Package,
  Puzzle,
  Brain,
  Globe,
  Server,
  TestTube,
  Shield,
  Settings,
  Lock,
} from 'lucide-react'

interface SidebarItem {
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  href: string
  isLocked?: boolean
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Applications',
    icon: Package,
    href: '/applications',
  },
  {
    name: 'Add-ons',
    icon: Puzzle,
    href: '/add-ons',
  },
  {
    name: 'Inference',
    icon: Brain,
    href: '/inference',
    isLocked: true,
  },
  {
    name: 'Environment groups',
    icon: Globe,
    href: '/environment-groups',
  },
  {
    name: 'Infrastructure',
    icon: Server,
    href: '/infrastructure',
  },
  {
    name: 'Preview envs',
    icon: TestTube,
    href: '/preview-envs',
    badge: 'Beta',
  },
  {
    name: 'Compliance',
    icon: Shield,
    href: '/compliance',
    isLocked: true,
  },
  {
    name: 'Integrations',
    icon: Puzzle,
    href: '/integrations',
  },
  {
    name: 'Project settings',
    icon: Settings,
    href: '/project-settings',
  },
]

export default function Sidebar() {
  return (
    <div className='fixed left-0 top-0 h-screen w-64 bg-sidebar overflow-y-auto scrollbar-hover'>
      {/* Header */}
      <div className='px-2 pt-4 pb-2'>
        <div className='flex items-center px-3 py-2.5'>
          <div className='flex items-center space-x-3'>
            <div className='w-5 h-5 rounded-full bg-gradient-ocean-complex flex-shrink-0'></div>
            <span className='text-sidebar-foreground font-medium text-sm'>
              trial-sandbox
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='px-2 pb-4'>
        <ul className='space-y-1'>
          {sidebarItems.map(item => {
            const IconComponent = item.icon
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className='group flex items-center justify-between px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar'
                >
                  <div className='flex items-center space-x-3'>
                    <IconComponent size={20} className='flex-shrink-0' />
                    <span>{item.name}</span>
                  </div>

                  <div className='flex items-center space-x-2'>
                    {item.badge && (
                      <span className='px-2 py-0.5 text-xs font-medium bg-gradient-magic-complex text-[var(--nordic-gray-900)] rounded-full'>
                        {item.badge}
                      </span>
                    )}
                    {item.isLocked && (
                      <Lock size={14} className='text-muted-foreground' />
                    )}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
