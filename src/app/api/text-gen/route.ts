import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      )
    }

    const result = await generateText(prompt, type)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Text Generation API Error:', error)
    return NextResponse.json(
      { error: '텍스트 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}