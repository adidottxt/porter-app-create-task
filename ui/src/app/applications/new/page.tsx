'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { MultiStepForm } from '@/components/MultiStepForm/MultiStepForm'

export default function NewApplicationPage() {
  const router = useRouter()

  return (
    <div>
      <div className='p-8 pb-0'>
        <div className='max-w-6xl mx-auto'>
          <motion.div whileHover='hover' initial='initial'>
            <Button
              variant='secondary'
              size='xs'
              onClick={() => router.back()}
              className='mb-4 gap-0.5 pl-1.5'
            >
              <motion.div
                variants={{
                  initial: { x: 0 },
                  hover: { x: -1 },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <ChevronLeft className='w-4 h-4' />
              </motion.div>
              Back
            </Button>
          </motion.div>
        </div>
      </div>
      <MultiStepForm />
    </div>
  )
}
