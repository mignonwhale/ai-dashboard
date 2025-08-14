import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  // Rate limiting 체크
  if (!rateLimit(request, 20, 60000)) { // 1분당 20회 제한
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }

  try {
    console.log('Chat API 호출 시작')
    console.log('GEMINI_API_KEY 확인:', process.env.GEMINI_API_KEY ? '설정됨' : '설정되지 않음')
    
    const { messages } = await request.json()
    console.log('받은 메시지:', messages)

    if (!messages || !Array.isArray(messages)) {
      console.log('메시지 형식 오류')
      return NextResponse.json(
        { error: '메시지 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    console.log('Gemini API 호출 시작')
    const response = await generateChatResponse(messages)
    console.log('Gemini API 응답 받음:', response?.substring(0, 100))

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'AI 응답 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
