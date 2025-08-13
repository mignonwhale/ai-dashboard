import { NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'

export async function GET() {
  try {
    // Gemini API 상태 확인을 위한 간단한 테스트
    const testMessages = [{ role: 'user', content: 'test' }]
    await generateChatResponse(testMessages)
    
    return NextResponse.json({
      service: 'Gemini',
      available: true,
      message: 'Gemini API가 정상적으로 작동 중입니다.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Status Check Error:', error)
    return NextResponse.json(
      { 
        service: 'Gemini',
        available: false,
        message: 'Gemini API 상태 확인에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}