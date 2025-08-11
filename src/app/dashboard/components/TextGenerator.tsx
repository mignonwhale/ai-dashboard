'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function TextGenerator() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [textType, setTextType] = useState<'blog' | 'marketing' | 'general'>('general')

  const generateText = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setGeneratedText('')

    try {
      const response = await fetch('/api/text-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type: textType
        })
      })

      if (!response.ok) throw new Error('API 호출 실패')

      const data = await response.json()
      setGeneratedText(data.result)

      // 결과를 데이터베이스에 저장
      if (user) {
        await supabase
          .from('ai_text_gen')
          .insert([
            {
              user_id: user.id,
              prompt,
              result: data.result,
            }
          ])
      }

    } catch (error) {
      console.error('텍스트 생성 실패:', error)
      setGeneratedText('죄송합니다. 텍스트 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText)
  }

  const clear = () => {
    setPrompt('')
    setGeneratedText('')
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 텍스트 생성기</h1>
        <p className="text-gray-600">AI의 힘으로 블로그 글과 마케팅 문구를 자동으로 생성하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 좌측: 블로그 글 설정 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">블로그 글 설정</h2>
          </div>

          <div className="space-y-4">
            {/* 주제 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">주제</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: 디지털 마케팅 전략"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* 키워드 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">키워드 (옵션로 구분)</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="예: SEO, 소셜미디어, 콘텐츠 마케팅"
              />
            </div>

            {/* 글의 톤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">글의 톤</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>톤을 선택하세요</option>
                <option>전문적</option>
                <option>친근한</option>
                <option>공식적</option>
                <option>창의적</option>
              </select>
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={generateText}
              disabled={!prompt.trim() || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isLoading ? '생성 중...' : '블로그 글 생성'}
            </button>
          </div>
        </div>

        {/* 우측: 생성된 블로그 글 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">생성된 블로그 글</h2>
            {generatedText && (
              <button
                onClick={copyToClipboard}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                마케팅 문구
              </button>
            )}
          </div>

          <div className="min-h-96 bg-gray-50 rounded-xl p-4 text-sm">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">생성된 블로그 글이 여기에 표시됩니다</p>
                </div>
              </div>
            ) : generatedText ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {generatedText}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-medium">생성된 블로그 글이 여기에 표시됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단: 텍스트 생성 팁 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">텍스트 생성 팁</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">블로그 글</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 구체적인 주제를 선택하고 명령어를 복사하여 입력 후 작성하기</li>
                  <li>• 관련 키워드를 적극 활용하여 SEO 최적화 하세요</li>
                  <li>• 다양 측면을 고려한 종합적 접근을 해보세요</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">마케팅 문구</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 대상의 핵심 가치 제안을 중점적으로 작성하세요</li>
                  <li>• 타겟 고객을 명확히 설정하고 규격화하세요</li>
                  <li>• 감성적인 어휘를 활용해 공감대를 형성하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}