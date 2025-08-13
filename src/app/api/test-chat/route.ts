import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse } from '@/lib/gemini'

export async function GET() {
  try {
    console.log('🧪 Gemini API 테스트 시작...')
    
    // 간단한 테스트 메시지
    const testMessages = [
      { role: 'user', content: '안녕하세요! 간단한 인사말로 답변해주세요.' }
    ]
    
    console.log('📤 테스트 메시지 전송:', testMessages)
    
    const startTime = Date.now()
    const response = await generateChatResponse(testMessages)
    const endTime = Date.now()
    
    console.log('📨 응답 받음:', response)
    console.log(`⏱️ 응답 시간: ${endTime - startTime}ms`)
    
    return NextResponse.json({
      success: true,
      message: '✅ Gemini API 연동 성공!',
      response: response,
      responseTime: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Gemini API 테스트 실패:', error)
    
    // 자세한 에러 정보 로그
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message)
      console.error('스택 트레이스:', error.stack)
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      message: '❌ Gemini API 연동 실패',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    console.log('🧪 Gemini API POST 테스트 시작...')
    console.log('📤 사용자 메시지:', message)
    
    const testMessages = [
      { role: 'user', content: message || '테스트 메시지입니다.' }
    ]
    
    const startTime = Date.now()
    const response = await generateChatResponse(testMessages)
    const endTime = Date.now()
    
    console.log('📨 AI 응답:', response)
    console.log(`⏱️ 응답 시간: ${endTime - startTime}ms`)
    
    return NextResponse.json({
      success: true,
      message: response,
      responseTime: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Gemini API POST 테스트 실패:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}