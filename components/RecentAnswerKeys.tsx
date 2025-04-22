'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { FileIcon } from 'lucide-react'

interface RecentAnswerKeysProps {
  teacherId: string
  onSelect: (url: string) => void
}

export function RecentAnswerKeys({ teacherId, onSelect }: RecentAnswerKeysProps) {
  const [recentKeys, setRecentKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

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
    return <div className="text-sm text-gray-500">Loading recent answer keys...</div>
  }

  if (recentKeys.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Answer Keys</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {recentKeys.map((url, index) => (
          <Card
            key={url}
            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelect(url)}
          >
            <div className="flex items-center space-x-2">
              <FileIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 truncate">
                Answer Key {recentKeys.length - index}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 