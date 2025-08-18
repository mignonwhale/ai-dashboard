export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI 어시스턴트 대시보드</h1>
        <p className="text-lg mb-8">
          Gemini AI를 활용한 다양한 기능을 하나의 대시보드에서 이용하세요
        </p>
        <div>
          <a href="/auth" className="btn btn-primary text-lg px-8 py-3">
            시작하기
          </a>
        </div>
      </div>
    </div>
  )
}
