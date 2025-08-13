import { NextRequest, NextResponse } from 'next/server'
import { parseFile } from '@/lib/fileParser'
import { analyzeFile } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '파일이 업로드되지 않았습니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // 지원하는 파일 형식 확인
    const supportedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    const supportedExtensions = ['.pdf', '.txt', '.doc', '.docx']
    
    const isTypeSupported = supportedTypes.includes(file.type)
    const isExtensionSupported = supportedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )

    if (!isTypeSupported && !isExtensionSupported) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. PDF, TXT, DOC, DOCX 파일만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    // 파일 내용 추출
    const content = await parseFile(file)
    
    if (!content.trim()) {
      return NextResponse.json(
        { error: '파일에서 텍스트를 추출할 수 없습니다.' },
        { status: 400 }
      )
    }

    // AI 분석 (요약)
    const analysis = await analyzeFile(content, file.name)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('File Analysis API Error:', error)
    return NextResponse.json(
      { error: '파일 분석에 실패했습니다.' },
      { status: 500 }
    )
  }
}