'use client'

import { useState } from 'react'

export default function TestChatPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`])
  }

  const testGetAPI = async () => {
    setIsLoading(true)
    addLog('GET /api/test-chat 호출 시작...')
    
    try {
      const res = await fetch('/api/test-chat', {
        method: 'GET'
      })
      
      const data = await res.json()
      addLog(`응답 상태: ${res.status}`)
      
      if (data.success) {
        addLog(`✅ 성공: ${data.message}`)
        addLog(`응답 내용: ${data.response}`)
        addLog(`응답 시간: ${data.responseTime}`)
        setResponse(data.response)
      } else {
        addLog(`❌ 실패: ${data.error}`)
        setResponse(`오류: ${data.error}`)
      }
    } catch (error) {
      addLog(`❌ 네트워크 오류: ${error}`)
      setResponse(`네트워크 오류: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPostAPI = async () => {
    if (!message.trim()) {
      addLog('❌ 메시지를 입력해주세요.')
      return
    }

    setIsLoading(true)
    addLog(`POST /api/test-chat 호출 시작... 메시지: "${message}"`)
    
    try {
      const res = await fetch('/api/test-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })
      
      const data = await res.json()
      addLog(`응답 상태: ${res.status}`)
      
      if (data.success) {
        addLog(`✅ 성공!`)
        addLog(`응답 내용: ${data.message}`)
        addLog(`응답 시간: ${data.responseTime}`)
        setResponse(data.message)
      } else {
        addLog(`❌ 실패: ${data.error}`)
        setResponse(`오류: ${data.error}`)
      }
    } catch (error) {
      addLog(`❌ 네트워크 오류: ${error}`)
      setResponse(`네트워크 오류: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setResponse('')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Gemini API 테스트</h1>
          
          {/* GET 테스트 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">1. GET 테스트 (기본 연결 확인)</h2>
            <button
              onClick={testGetAPI}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium ${
                isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? '테스트 중...' : 'GET 테스트 실행'}
            </button>
          </div>

          {/* POST 테스트 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">2. POST 테스트 (커스텀 메시지)</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="테스트 메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && testPostAPI()}
              />
              <button
                onClick={testPostAPI}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading ? '전송 중...' : 'POST 테스트'}
              </button>
            </div>
          </div>

          {/* 응답 결과 */}
          {response && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">📨 AI 응답</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap">{response}</pre>
              </div>
            </div>
          )}

          {/* 로그 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">📋 서버 로그</h2>
              <button
                onClick={clearLogs}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
              >
                로그 지우기
              </button>
            </div>
            <div className="bg-black text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">로그가 여기에 표시됩니다...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}