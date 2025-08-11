import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '메시지 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const response = await generateChatResponse(messages)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'AI 응답 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}