'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/LoadingSpinner'

const DashboardLayout = dynamic(() => import('@/app/dashboard/components/DashboardLayout'), {
  loading: () => <LoadingSpinner />
})

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const navigateToFeature = (feature: string) => {
    router.push(`/dashboard/${feature}`)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* 메인 타이틀 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI 어시스턴트 대시보드에 오신 것을 환영합니다
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            다양한 AI 기능을 활용하여 생산성을 향상시키고, 업무 효율을 극대화하세요. 각 기능을 클릭
            하여 시작해보세요.
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* AI 챗봇 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => navigateToFeature('chat')}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 챗봇</h3>
            <p className="text-gray-600">문서 요약과 질문 응답을 제공하는 스마트 챗봇</p>
          </div>

          {/* AI 텍스트 생성 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => navigateToFeature('text-gen')}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 텍스트 생성</h3>
            <p className="text-gray-600">블로그 글과 마케팅 문구를 자동으로 생성</p>
          </div>

          {/* 파일 분석 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => navigateToFeature('file-analyzer')}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">파일 분석</h3>
            <p className="text-gray-600">PDF 파일을 업로드하여 AI 요약과 검색 기능</p>
          </div>

          {/* 할 일 관리 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => navigateToFeature('todos')}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">할 일 관리</h3>
            <p className="text-gray-600">AI가 추천하는 스마트한 일정 관리</p>
          </div>

          {/* 데이터 시각화 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer col-span-1 md:col-span-2"
               onClick={() => navigateToFeature('data-viz')}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">데이터 시각화</h3>
            <p className="text-gray-600">CSV 데이터를 분석하여 자동으로 차트 생성</p>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl py-16 px-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI 기능을 최대한 활용하세요</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            각 기능을 최신 AI 기술로 바탕으로 단계별로만든, 여러분의 작업을 더욱 스마트하고 효율적으로 만들어드립니다.
          </p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            onClick={() => navigateToFeature('chat')}
          >
            시작하기
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}