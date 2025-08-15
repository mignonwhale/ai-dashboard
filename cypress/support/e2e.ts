// Cypress E2E 지원 파일
import './commands'

// 전역 설정
Cypress.on('uncaught:exception', (err, runnable) => {
  // Next.js hydration 경고 무시
  if (err.message.includes('Hydration')) {
    return false
  }
  // 기타 콘솔 에러 무시
  return false
})