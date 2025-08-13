import { NextRequest, NextResponse } from 'next/server'
import { recommendTodos } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { existingTodos } = await request.json()

    if (!Array.isArray(existingTodos)) {
      return NextResponse.json(
        { error: '기존 할 일 목록이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const recommendations = await recommendTodos(existingTodos)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Todo Recommendations API Error:', error)
    return NextResponse.json(
      { error: '할 일 추천에 실패했습니다.' },
      { status: 500 }
    )
  }
}