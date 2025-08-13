'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

interface FileData {
  id: string
  file_name: string
  file_url: string
  summary: string
  created_at: string
  metadata: { size?: number; type?: string } | null
}

export default function FileAnalyzer() {
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadUploadedFiles = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUploadedFiles(data || [])
    } catch (error) {
      console.error('파일 목록 로드 실패:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadUploadedFiles()
    }
  }, [user, loadUploadedFiles])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysis('')
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
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setSelectedFile(files[0])
      setAnalysis('')
    }
  }

  const analyzeFile = async () => {
    if (!selectedFile || isLoading || !user) return

    setIsLoading(true)
    setAnalysis('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/file-analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('파일 분석 API 호출 실패')

      const data = await response.json()
      setAnalysis(data.analysis)

      // Supabase Storage에 파일 업로드
      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`
      
      // 파일 업로드 시도 (버킷이 없으면 수동으로 Supabase에서 생성 필요)
      console.log('파일 업로드 시도 중...')

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, selectedFile)

      if (uploadError) {
        console.error('파일 업로드 실패:', uploadError)
        // 업로드 실패해도 분석 결과는 표시
        console.warn('파일 업로드는 실패했지만 분석은 완료되었습니다.')
      } else {
        console.log('파일 업로드 성공:', uploadData?.path)
        // 분석 결과를 데이터베이스에 저장
        try {
          await supabase
            .from('files')
            .insert([
              {
                user_id: user.id,
                file_name: selectedFile.name,
                file_url: uploadData.path,
                summary: data.analysis,
                metadata: { size: selectedFile.size, type: selectedFile.type }
              }
            ])
          
          // 파일 목록 새로고침
          loadUploadedFiles()
        } catch (dbError) {
          console.error('DB 저장 실패:', dbError)
          // DB 저장 실패해도 분석 결과는 표시
        }
      }

    } catch (error) {
      console.error('파일 분석 실패:', error)
      setAnalysis('죄송합니다. 파일 분석 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const selectFile = (fileData: FileData) => {
    setSelectedFileData(fileData)
    setAnalysis(fileData.summary)
  }

  const deleteFile = async (fileId: string, filePath: string) => {
    try {
      // Supabase Storage에서 파일 삭제
      await supabase.storage.from('files').remove([filePath])
      
      // 데이터베이스에서 파일 정보 삭제
      await supabase.from('files').delete().eq('id', fileId)
      
      // 파일 목록 새로고침
      loadUploadedFiles()
      
      // 선택된 파일이 삭제된 경우 초기화
      if (selectedFileData?.id === fileId) {
        setSelectedFileData(null)
        setAnalysis('')
      }
    } catch (error) {
      console.error('파일 삭제 실패:', error)
    }
  }

  const filteredFiles = uploadedFiles.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">파일 분석</h1>
        <p className="text-gray-600">PDF 파일을 업로드하여 AI 기반 요약과 검색 기능을 이용하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 파일 업로드 및 관리 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 파일 업로드 영역 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">파일 업로드</h2>
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-green-300 hover:border-green-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                파일을 드래그하거나 클릭하여 업로드
              </h3>
              <p className="text-gray-500 mb-4">PDF 파일만 지원됩니다 (최대 10MB)</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={analyzeFile}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isLoading ? '분석 중...' : '파일 분석'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 파일 검색 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="파일명 또는 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 업로드된 파일 목록 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">업로드된 파일</h2>
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {filteredFiles.length}
              </span>
            </div>

            <div className="space-y-3">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium">업로드된 파일이 없습니다</p>
                  <p className="text-sm text-gray-400">PDF 파일을 업로드해보세요</p>
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ${
                      selectedFileData?.id === file.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                    onClick={() => selectFile(file)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.file_name}</p>
                        <p className="text-sm text-gray-500">
                          {file.metadata?.size ? formatFileSize(file.metadata.size) : ''} • 
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">완료</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          selectFile(file)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                        title="분석 결과 보기"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file.id, file.file_url)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                        title="파일 삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 우측: 파일 선택 도구 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {!analysis ? (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">파일을 선택하세요</h3>
              <p className="text-gray-500 text-sm">파일을 클릭하여 AI 분석 결과를 확인할 수 있습니다</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">분석 결과</h3>
                {selectedFileData && (
                  <button
                    onClick={() => {
                      setSelectedFileData(null)
                      setAnalysis('')
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    닫기
                  </button>
                )}
              </div>
              {selectedFileData && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 text-sm">{selectedFileData.file_name}</p>
                  <p className="text-blue-700 text-xs">
                    {new Date(selectedFileData.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-[48rem] overflow-y-auto">
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}