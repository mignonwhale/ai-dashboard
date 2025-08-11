'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function DataVisualizer() {
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysis('')
      setChartData(null)
    }
  }

  const analyzeCSV = async () => {
    if (!selectedFile || isLoading || !user) return

    setIsLoading(true)
    setAnalysis('')
    setChartData(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/csv-analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('CSV 분석 API 호출 실패')

      const data = await response.json()
      setAnalysis(data.analysis)
      
      if (data.chartData) {
        setChartData(data.chartData)
      }

      // Supabase Storage에 파일 업로드
      const filePath = `csv/${user.id}/${Date.now()}.csv`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, selectedFile)

      if (uploadError) {
        console.error('파일 업로드 실패:', uploadError)
      } else {
        // 분석 결과를 데이터베이스에 저장
        await supabase
          .from('csv_analysis')
          .insert([
            {
              user_id: user.id,
              csv_url: uploadData.path,
              analysis_text: data.analysis,
              chart_data: data.chartData
            }
          ])
      }

    } catch (error) {
      console.error('CSV 분석 실패:', error)
      setAnalysis('죄송합니다. CSV 분석 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setAnalysis('')
    setChartData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div id="data-viz" className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">📊 데이터 시각화</h2>
          <button className="btn btn-sm btn-outline" onClick={clearFile}>
            초기화
          </button>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">CSV 파일 선택</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            className="file-input file-input-bordered w-full"
            accept=".csv"
            onChange={handleFileSelect}
          />
        </div>

        {selectedFile && (
          <div className="bg-base-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-base-content/60">
                  {formatFileSize(selectedFile.size)} • CSV
                </p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </div>
        )}

        <button
          className={`btn btn-primary mb-4 ${isLoading ? 'loading' : ''}`}
          onClick={analyzeCSV}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? '분석 중...' : 'CSV 데이터 분석하기'}
        </button>

        {analysis && (
          <div className="bg-base-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">📊 데이터 분석 결과:</h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {analysis}
            </div>
          </div>
        )}

        {chartData && (
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📈 시각화 추천:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-base-100 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm">막대 차트</p>
                <p className="text-xs text-base-content/60">카테고리별 비교</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm">선형 차트</p>
                <p className="text-xs text-base-content/60">시간별 추이</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🥧</div>
                <p className="text-sm">파이 차트</p>
                <p className="text-xs text-base-content/60">비율 분석</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📉</div>
                <p className="text-sm">스캐터 플롯</p>
                <p className="text-xs text-base-content/60">상관관계 분석</p>
              </div>
            </div>
          </div>
        )}

        {!analysis && !isLoading && !selectedFile && (
          <div className="bg-base-200 rounded-lg p-8 text-center text-base-content/60">
            <div className="text-4xl mb-2">📊</div>
            <p>CSV 파일을 업로드하여 데이터 분석을 받아보세요</p>
            <p className="text-sm mt-2">Claude가 데이터의 패턴과 인사이트를 분석합니다</p>
          </div>
        )}
      </div>
    </div>
  )
}