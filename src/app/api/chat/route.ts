import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'

export async function POST(request: NextRequest) {
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
