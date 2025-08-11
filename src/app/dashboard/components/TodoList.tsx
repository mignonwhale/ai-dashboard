'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Todo } from '@/lib/supabaseClient'

export default function TodoList() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  useEffect(() => {
    if (user) {
      loadTodos()
    }
  }, [user])

  const loadTodos = async () => {
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
  }

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
    <div id="todos" className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">✅ 할 일 관리</h2>
          <div className="badge badge-outline">
            {completedCount}/{totalCount}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="새 할 일을 입력하세요..."
            className="input input-bordered flex-1"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={addTodo}
            disabled={!newTodo.trim() || isLoading}
          >
            {isLoading ? '' : '추가'}
          </button>
        </div>

        <button
          className={`btn btn-outline btn-sm mb-4 ${isLoadingRecommendations ? 'loading' : ''}`}
          onClick={getAIRecommendations}
          disabled={isLoadingRecommendations}
        >
          {isLoadingRecommendations ? '추천 중...' : '🤖 Claude 추천 받기'}
        </button>

        <div className="max-h-80 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <div className="text-4xl mb-2">📝</div>
              <p>할 일을 추가하거나 Claude 추천을 받아보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={todo.is_done}
                    onChange={() => toggleTodo(todo.id, todo.is_done)}
                  />
                  <div className="flex-1">
                    <p className={`${todo.is_done ? 'line-through text-base-content/50' : ''}`}>
                      {todo.task}
                    </p>
                    {todo.ai_recommended && (
                      <span className="badge badge-secondary badge-xs">Claude 추천</span>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}