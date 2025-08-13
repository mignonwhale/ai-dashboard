const { GoogleGenerativeAI } = require('@google/generative-ai')

// TODO api key는 이렇게 노출하면 안됨
const apiKey = ''

async function testGemini() {
  try {
    console.log('Gemini API 키 테스트 시작...')
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    console.log('모델 로드 완료, 텍스트 생성 요청 중...')
    
    const result = await model.generateContent("안녕하세요")
    const response = await result.response
    const text = response.text()
    
    console.log('API 응답 성공:', text)
    
  } catch (error) {
    console.error('Gemini API 오류:', error)
    if (error.message) {
      console.error('오류 메시지:', error.message)
    }
    if (error.status) {
      console.error('HTTP 상태:', error.status)
    }
  }
}

testGemini()
