export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-32 right-10 w-12 h-12 bg-green-200 rounded-full opacity-60 animate-pulse"></div>

      {/* 메인 컨텐츠 */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* 로고/아이콘 영역 */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>

          {/* 타이틀 */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            AI 어시스턴트 대시보드
          </h1>

          {/* 부제목 */}
          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
            Gemini AI를 활용한 다양한 기능을
          </p>
          <p className="text-lg md:text-xl text-gray-500 mb-12">하나의 대시보드에서 이용하세요</p>

          {/* 기능 미리보기 카드들 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">AI 챗봇</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">텍스트 생성</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">파일 분석</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">할 일 관리</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">데이터 시각화</p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="space-y-4">
            <a
              href="/auth"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              지금 시작하기
            </a>
            <div className="text-sm text-gray-500">무료로 모든 AI 기능을 체험해보세요</div>
          </div>
        </div>
      </div>

      {/* 하단 파도 효과 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-blue-100"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-blue-200"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  )
}
