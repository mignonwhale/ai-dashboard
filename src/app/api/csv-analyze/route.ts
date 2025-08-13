import { NextRequest, NextResponse } from 'next/server'
import { analyzeCSV } from '@/lib/gemini'

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

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // CSV 파일 확인
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'CSV 파일만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    // 파일 내용 읽기
    const content = await file.text()
    
    if (!content.trim()) {
      return NextResponse.json(
        { error: '파일이 비어있습니다.' },
        { status: 400 }
      )
    }

    // 간단한 차트 데이터 생성 (실제로는 CSV 파싱 후 구조화된 데이터 반환)
    const lines = content.split('\n').filter(line => line.trim())
    const headers = lines[0]?.split(',') || []

    // AI 분석 - CSV 데이터 요약
    const csvSummary = `CSV 파일: ${file.name}\n헤더: ${headers.join(', ')}\n데이터 행 수: ${lines.length - 1}개\n\n데이터 샘플:\n${lines.slice(0, 5).join('\n')}`
    const analysis = await analyzeCSV(csvSummary, file.name)
    
    const chartData = {
      headers: headers,
      rowCount: lines.length - 1,
      hasHeaders: true,
      columns: headers.length
    }

    return NextResponse.json({ analysis, chartData })
  } catch (error) {
    console.error('CSV Analysis API Error:', error)
    return NextResponse.json(
      { error: 'CSV 분석에 실패했습니다.' },
      { status: 500 }
    )
  }
}