import { NextResponse } from 'next/server'
import { getRecentAnswerKeys, cacheAnswerKey } from '@/lib/redis'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId')

  if (!teacherId) {
    return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
  }

  try {
    const answerKeys = await getRecentAnswerKeys(teacherId)
    return NextResponse.json({ answerKeys })
  } catch (error) {
    console.error('Error fetching answer keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch answer keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { teacherId, answerKeyUrl } = await request.json()

    if (!teacherId || !answerKeyUrl) {
      return NextResponse.json(
        { error: 'Teacher ID and answer key URL are required' },
        { status: 400 }
      )
    }

    await cacheAnswerKey(teacherId, answerKeyUrl)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error caching answer key:', error)
    return NextResponse.json(
      { error: 'Failed to cache answer key' },
      { status: 500 }
    )
  }
} 