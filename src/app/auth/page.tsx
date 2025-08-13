'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')
  const router = useRouter()

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return '이메일을 입력해주세요.'
    }
    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식을 입력해주세요.'
    }
    return ''
  }

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return '비밀번호를 입력해주세요.'
    }
    if (password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다.'
    }
    return ''
  }

  // 이름 유효성 검사
  const validateName = (name: string) => {
    if (!name.trim()) {
      return '이름을 입력해주세요.'
    }
    if (name.trim().length < 2) {
      return '이름은 최소 2자 이상이어야 합니다.'
    }
    if (name.trim().length > 20) {
      return '이름은 20자 이하여야 합니다.'
    }
    return ''
  }

  // 실시간 검증 함수들
  const handleEmailChange = (value: string) => {
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError(validatePassword(value))
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setNameError(validateName(value))
  }

  useEffect(() => {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 유효성 검사
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation)
      setPasswordError(passwordValidation)
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      setMessage('로그인 성공!')
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      setMessage(`로그인 실패: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 유효성 검사
    const nameValidation = validateName(name)
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (nameValidation || emailValidation || passwordValidation) {
      setNameError(nameValidation)
      setEmailError(emailValidation)
      setPasswordError(passwordValidation)
      setLoading(false)
      return
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    try {
      // Supabase Auth에 사용자 등록
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: name.trim(),
          }
        }
      })

      if (authError) throw authError

      // 회원가입 성공 메시지
      if (authData.user && !authData.session) {
        setMessage('회원가입 성공! 이메일을 확인해주세요.')
      } else if (authData.session) {
        setMessage('회원가입 성공!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error: unknown) {
      console.error('회원가입 에러:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      setMessage(`회원가입 실패: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 이메일 유효성 검사
    const emailValidation = validateEmail(email)
    if (emailValidation) {
      setEmailError(emailValidation)
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      setMessage('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.')
      setTimeout(() => {
        setIsPasswordReset(false)
        setIsLogin(true)
      }, 3000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      setMessage(`비밀번호 재설정 실패: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* App Icon & Title */}
          <div className="text-center pt-12 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isPasswordReset ? '비밀번호 재설정' : (isLogin ? 'AI 어시스턴트 대시보드' : 'AI 어시스턴트 가입하기')}
            </h1>
            <p className="text-gray-500 text-sm">
              {isPasswordReset ? '등록된 이메일로 비밀번호 재설정 링크를 보내드립니다' : (isLogin ? '특별한 AI와 함께 생산성을 높여보세요' : 'AI와 함께하는 새로운 생산성 경험을 시작하세요')}
            </p>
          </div>

          <form className="px-8 py-4" onSubmit={isPasswordReset ? handlePasswordReset : (isLogin ? handleLogin : handleSignUp)}>
            
            {/* Name Field (Sign Up Only) */}
            {!isLogin && !isPasswordReset && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="홍길동" 
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500 ${
                      nameError ? 'border-red-500' : 'border-gray-200'
                    }`}
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required 
                  />
                </div>
                {nameError && (
                  <p className="mt-1 text-sm text-red-600">{nameError}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500 ${
                    emailError ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required 
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Field (not for password reset) */}
            {!isPasswordReset && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500 ${
                      passwordError ? 'border-red-500' : 'border-gray-200'
                    }`}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required 
                  />
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            )}

            {/* Confirm Password Field (Sign Up Only) */}
            {!isLogin && !isPasswordReset && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
            )}

            {/* Forgot Password Link (Login Only) */}
            {isLogin && !isPasswordReset && (
              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordReset(true)
                    setIsLogin(false)
                  }}
                  className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            )}

            {/* Back to Login Link (Password Reset Only) */}
            {isPasswordReset && (
              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordReset(false)
                    setIsLogin(true)
                  }}
                  className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  로그인으로 돌아가기
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button 
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리중...
                </>
              ) : (
                isPasswordReset ? '비밀번호 재설정 이메일 발송' : (isLogin ? '로그인' : '회원가입')
              )}
            </button>

          </form>

          {/* Toggle Login/Signup */}
          {!isPasswordReset && (
            <div className="text-center pb-8">
              <p className="text-gray-600 text-sm">
                {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {isLogin ? '회원가입' : '로그인'}
                </button>
              </p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mx-8 mb-6 p-4 rounded-lg ${
              message.includes('성공') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                <div className={`w-5 h-5 mr-2 ${
                  message.includes('성공') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message.includes('성공') ? (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
