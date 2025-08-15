'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Todo } from '@/lib/supabaseClient'

export default function TodoList() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  const loadTodos = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('할 일 로드 실패:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadTodos()
    }
  }, [user, loadTodos])

  const addTodo = async () => {
    if (!newTodo.trim() || !user || isLoading) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user.id,
            task: newTodo.trim(),
            ai_recommended: false,
            is_done: false,
            due_date: null
          }
        ])
        .select()

      if (error) throw error
      
      if (data) {
        setTodos(prev => [data[0], ...prev])
        setNewTodo('')
      }
    } catch (error) {
      console.error('할 일 추가 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTodo = async (id: string, isDone: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_done: !isDone })
        .eq('id', id)

      if (error) throw error

      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, is_done: !isDone } : todo
      ))
    } catch (error) {
      console.error('할 일 상태 변경 실패:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('할 일 삭제 실패:', error)
    }
  }

  const getAIRecommendations = async () => {
    if (!user || isLoadingRecommendations) return

    setIsLoadingRecommendations(true)

    try {
      const existingTasks = todos.map(todo => todo.task)
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          existingTodos: existingTasks,
          userContext: '일반적인 생산성 향상'
        })
      })

      if (!response.ok) throw new Error('AI 추천 API 호출 실패')

      const data = await response.json()
      
      // AI 추천 할 일들을 데이터베이스에 추가
      const recommendedTodos = data.recommendations.map((task: string) => ({
        user_id: user.id,
        task: task.replace(/^[-•]\s*/, ''), // 불릿 포인트 제거
        ai_recommended: true,
        is_done: false,
        due_date: null
      }))

      const { data: insertedData, error } = await supabase
        .from('todos')
        .insert(recommendedTodos)
        .select()

      if (error) throw error

      if (insertedData) {
        setTodos(prev => [...insertedData, ...prev])
      }

    } catch (error) {
      console.error('AI 추천 실패:', error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const completedCount = todos.filter(todo => todo.is_done).length
  const totalCount = todos.length

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">할 일 관리</h1>
        <p className="text-gray-600">AI의 도움을 받아 효율적으로 일정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 좌측: 할 일 추가 및 목록 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 할 일 추가 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">새 할 일 추가</h2>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="새 할 일을 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="todo-input"
              />
              <button
                onClick={addTodo}
                disabled={!newTodo.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                data-testid="add-todo-button"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {isLoading ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>

          {/* AI 추천 버튼 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gemini AI 추천</h3>
                  <p className="text-sm text-gray-500">현재 할 일을 바탕으로 추가 작업을 추천받아보세요</p>
                </div>
              </div>
              <button
                onClick={getAIRecommendations}
                disabled={isLoadingRecommendations}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                data-testid="ai-recommend-button"
              >
                {isLoadingRecommendations ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {isLoadingRecommendations ? '추천 중...' : 'AI 추천 받기'}
              </button>
            </div>
          </div>

          {/* 할 일 목록 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">할 일 목록</h2>
              </div>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {completedCount}/{totalCount}
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {todos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="font-medium">할 일이 없습니다</p>
                  <p className="text-sm text-gray-400 mt-1">새 할 일을 추가하거나 AI 추천을 받아보세요!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        todo.is_done ? 'bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      data-testid={todo.ai_recommended ? "ai-recommended-todo" : "todo-item"}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={todo.is_done}
                          onChange={() => toggleTodo(todo.id, todo.is_done)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          todo.is_done 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}>
                          {todo.task}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {todo.ai_recommended && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              Gemini 추천
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(todo.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 통계 및 팁 */}
        <div className="space-y-6">
          {/* 통계 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 완료 통계</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">전체 할 일</span>
                <span className="font-semibold text-gray-900">{totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">완료된 할 일</span>
                <span className="font-semibold text-green-600">{completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">진행률</span>
                <span className="font-semibold text-blue-600">
                  {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                </span>
              </div>
              {totalCount > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">사용 팁</h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• 구체적이고 실행 가능한 할 일을 작성하세요</li>
                  <li>• Gemini AI 추천으로 놓친 작업을 찾아보세요</li>
                  <li>• 정기적으로 완료된 할 일을 정리하세요</li>
                  <li>• 큰 작업은 작은 단위로 나누어 관리하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}