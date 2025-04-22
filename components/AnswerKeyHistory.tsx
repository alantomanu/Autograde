'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileIcon, ClockIcon, CheckCircleIcon } from 'lucide-react'
import { format } from 'date-fns'

interface AnswerKey {
  url: string
  lastUsed: string
  useCount: number
}

interface AnswerKeyHistoryProps {
  teacherId: string
  onSelect: (url: string) => void
  currentUrl?: string
}

function extractFileNameFromUrl(url: string): string {
  try {
   
    const matches = url.match(/\/answer_keys\/(.+?)(?:\?|$)/);
    if (matches && matches[1]) {
      
      return decodeURIComponent(matches[1]);
    }
    return 'Answer Key';
  } catch (error) {
    console.error('Error extracting filename:', error);
    return 'Answer Key';
  }
}

export function AnswerKeyHistory({ teacherId, onSelect, currentUrl }: AnswerKeyHistoryProps) {
  const [recentKeys, setRecentKeys] = useState<AnswerKey[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchRecentKeys = async () => {
      try {
        const response = await fetch(`/api/answer-keys?teacherId=${teacherId}`)
        const data = await response.json()
        setRecentKeys(data.answerKeys)
      } catch (error) {
        console.error('Error fetching recent answer keys:', error)
      } finally {
        setLoading(false)
      }
    }

    if (teacherId) {
      fetchRecentKeys()
    }
  }, [teacherId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (recentKeys.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
        Recent Answer Keys
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {recentKeys.map((key, index) => (
            <motion.div
              key={key.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative overflow-hidden rounded-lg border p-4 cursor-pointer
                  ${currentUrl === key.url 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50'}
                  transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                `}
                onClick={() => {
                  setExpandedIndex(expandedIndex === index ? null : index)
                  onSelect(key.url)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-full 
                      ${currentUrl === key.url ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'}
                      transition-colors duration-300
                    `}>
                      <FileIcon className={`
                        w-5 h-5 
                        ${currentUrl === key.url ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}
                        transition-colors duration-300
                      `} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        {extractFileNameFromUrl(key.url)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Last used: {format(new Date(key.lastUsed), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  {currentUrl === key.url && (
                    <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                
                <motion.div
                  initial={false}
                  animate={{ height: expandedIndex === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      Used {key.useCount} time{key.useCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.div>

                {/* Gradient overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 