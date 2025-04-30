import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ANSWER_KEY_PREFIX = 'teacher:answer-keys:'
const ANSWER_KEY_STATS_PREFIX = 'teacher:answer-key-stats:'
const MAX_STORED_KEYS = 3

interface AnswerKeyStats {
  url: string
  lastUsed: string
  useCount: number
}

export async function cacheAnswerKey(teacherId: string, answerKeyUrl: string) {
  const key = `${ANSWER_KEY_PREFIX}${teacherId}`
  const statsKey = `${ANSWER_KEY_STATS_PREFIX}${teacherId}`
  

  const existingUrls = await redis.lrange(key, 0, -1) || []
  
 
  const urlExists = existingUrls.includes(answerKeyUrl)
  
  if (!urlExists) {
   
    await redis.lpush(key, answerKeyUrl)
    
   
    if (existingUrls.length >= MAX_STORED_KEYS) {
      await redis.ltrim(key, 0, MAX_STORED_KEYS - 1)
    }
  }


  const now = new Date().toISOString()
  const stats = await redis.hget<AnswerKeyStats>(statsKey, answerKeyUrl) || {
    url: answerKeyUrl,
    lastUsed: now,
    useCount: 0
  }

  await redis.hset(statsKey, {
    [answerKeyUrl]: {
      ...stats,
      lastUsed: now,
      useCount: stats.useCount + 1
    }
  })
}

export async function getRecentAnswerKeys(teacherId: string): Promise<AnswerKeyStats[]> {
  const key = `${ANSWER_KEY_PREFIX}${teacherId}`
  const statsKey = `${ANSWER_KEY_STATS_PREFIX}${teacherId}`
  
  const urls = await redis.lrange(key, 0, MAX_STORED_KEYS - 1) || []
  const stats: Record<string, AnswerKeyStats> = {}
  

  for (const url of urls) {
    const keyStats = await redis.hget<AnswerKeyStats>(statsKey, url)
    if (keyStats) {
      stats[url] = keyStats
    }
  }
  

  return urls.map(url => stats[url] || {
    url,
    lastUsed: new Date().toISOString(),
    useCount: 0
  })
} 