// Rate limiting utility
import { NextRequest } from 'next/server'

const rateLimits = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: NextRequest, limit: number = 10, windowMs: number = 60000) {
  // 개발 환경에서는 더 많은 헤더를 확인
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  const remoteAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  
  const ip = cfConnectingIp || 
            realIp || 
            remoteAddress || 
            forwarded?.split(',')[0]?.trim() ||
            '127.0.0.1' // 로컬 개발 환경용
  
  // 개발 환경에서만 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Rate limit IP detection:', { 
      forwarded, 
      realIp, 
      cfConnectingIp,
      finalIp: ip 
    })
  }
  
  const now = Date.now()
  
  const key = `${ip}-${new URL(request.url).pathname}`
  const current = rateLimits.get(key)
  
  if (current && current.resetTime > now) {
    if (current.count >= limit) {
      return false
    }
    current.count++
  } else {
    rateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
  }
  
  return true
}

export function getRateLimitInfo(request: NextRequest, limit: number = 10, windowMs: number = 60000) {
  // 동일한 IP 감지 로직 사용
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  const remoteAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  
  const ip = cfConnectingIp || 
            realIp || 
            remoteAddress || 
            forwarded?.split(',')[0]?.trim() ||
            '127.0.0.1'
            
  const key = `${ip}-${new URL(request.url).pathname}`
  const current = rateLimits.get(key)
  
  if (!current || current.resetTime <= Date.now()) {
    return {
      remaining: limit - 1,
      reset: Date.now() + windowMs
    }
  }
  
  return {
    remaining: Math.max(0, limit - current.count),
    reset: current.resetTime
  }
}