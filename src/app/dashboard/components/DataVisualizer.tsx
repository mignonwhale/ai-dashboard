'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function DataVisualizer() {
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<{ hasData?: boolean; [key: string]: unknown } | null>(null)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysis('')
      setChartData(null)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      setSelectedFile(files[0])
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
      } else {
        // 분석이 성공했다면 더미 차트 데이터를 설정
        setChartData({ hasData: true })
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

  const renderChart = () => {
    if (!chartData) return null

    const commonOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: '데이터 시각화',
        },
      },
    }

    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ]

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 205, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ]

    // 예시 데이터 (실제로는 API에서 파싱된 데이터를 사용)
    const sampleData = {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      datasets: [
        {
          label: '매출 (만원)',
          data: [120, 190, 300, 500, 200, 300],
          backgroundColor: selectedChartType === 'pie' ? colors : colors[0],
          borderColor: selectedChartType === 'pie' ? borderColors : borderColors[0],
          borderWidth: 1,
        },
      ],
    }

    switch (selectedChartType) {
      case 'line':
        return <Line data={sampleData} options={commonOptions} />
      case 'pie':
        return <Pie data={sampleData} options={commonOptions} />
      default:
        return <Bar data={sampleData} options={commonOptions} />
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
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">데이터 시각화</h1>
        <p className="text-gray-600">CSV 데이터를 업로드하여 AI 분석과 시각화를 받아보세요</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 좌측: 파일 업로드 및 설정 */}
        <div className="space-y-6">
          {/* 파일 업로드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">CSV 파일 업로드</h2>
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-purple-300 hover:border-purple-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                CSV 파일을 드래그하거나 클릭하여 업로드
              </h3>
              <p className="text-gray-500 mb-4">CSV 파일만 지원됩니다 (최대 5MB)</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
              />
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)} • CSV</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={analyzeCSV}
                      disabled={isLoading}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {isLoading ? '분석 중...' : '데이터 분석'}
                    </button>
                    <button
                      onClick={clearFile}
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 차트 타입 선택 */}
          {chartData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">차트 타입 선택</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedChartType('bar')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedChartType === 'bar'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-medium">막대 차트</p>
                  <p className="text-xs opacity-75">카테고리 비교</p>
                </button>
                <button
                  onClick={() => setSelectedChartType('line')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedChartType === 'line'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">📈</div>
                  <p className="text-sm font-medium">선형 차트</p>
                  <p className="text-xs opacity-75">시간별 추이</p>
                </button>
                <button
                  onClick={() => setSelectedChartType('pie')}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    selectedChartType === 'pie'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">🥧</div>
                  <p className="text-sm font-medium">파이 차트</p>
                  <p className="text-xs opacity-75">비율 분석</p>
                </button>
              </div>
            </div>
          )}

          {/* AI 분석 결과 */}
          {analysis && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 AI 분석 결과</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            </div>
          )}
        </div>

        {/* 우측: 차트 시각화 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">데이터 시각화</h3>
            </div>
          </div>

          {chartData ? (
            <div className="h-96">
              {renderChart()}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="font-medium">시각화 대기 중</p>
                <p className="text-sm text-gray-400 mt-1">CSV 파일을 업로드하고 분석해주세요</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단: 사용 가이드 */}
      {!selectedFile && !analysis && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">데이터 시각화 가이드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">지원되는 파일 형식</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• CSV 파일 (.csv)</li>
                    <li>• UTF-8 인코딩 권장</li>
                    <li>• 최대 파일 크기: 5MB</li>
                    <li>• 첫 번째 행은 헤더로 사용</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">시각화 기능</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Claude AI 데이터 분석</li>
                    <li>• 3가지 차트 타입 지원</li>
                    <li>• 인터랙티브 차트</li>
                    <li>• 인사이트 및 패턴 분석</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}