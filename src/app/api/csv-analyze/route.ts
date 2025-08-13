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

    // CSV 파싱 및 차트 데이터 생성
    const lines = content.split('\n').filter(line => line.trim())
    const headers = lines[0]?.split(',') || []
    const dataRows = lines.slice(1)

    // AI 분석 - CSV 데이터 요약
    const csvSummary = `CSV 파일: ${file.name}\n헤더: ${headers.join(', ')}\n데이터 행 수: ${lines.length - 1}개\n\n데이터 샘플:\n${lines.slice(0, 5).join('\n')}`
    const analysis = await analyzeCSV(csvSummary, file.name)
    
    // 실제 차트 데이터 생성
    let chartData = null
    
    if (headers.length >= 2 && dataRows.length > 0) {
      // 첫 번째 컬럼을 라벨로, 두 번째 컬럼을 데이터로 사용
      const labels: string[] = []
      const data: number[] = []
      
      dataRows.forEach((row, index) => {
        if (index < 10) { // 최대 10개 데이터만 차트로 표시
          const cells = row.split(',')
          if (cells.length >= 2) {
            labels.push(cells[0]?.trim() || `항목 ${index + 1}`)
            // 숫자로 변환, 실패하면 인덱스 사용
            const numericValue = parseFloat(cells[1]?.trim())
            data.push(isNaN(numericValue) ? index + 1 : numericValue)
          }
        }
      })
      
      if (labels.length > 0 && data.length > 0) {
        chartData = {
          labels,
          datasets: [
            {
              label: headers[1] || '데이터',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }
      }
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