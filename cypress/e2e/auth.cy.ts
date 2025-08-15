describe('인증 플로우', () => {
  const testEmail = 'test@example.com'
  const testPassword = 'password123'
  const testName = 'Test User'

  beforeEach(() => {
    cy.visit('/auth')
  })

  it('로그인 페이지가 정상적으로 로드된다', () => {
    cy.contains('로그인').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('빈 필드로 로그인 시도 시 에러가 표시된다', () => {
    cy.get('button').contains('로그인').click()
    
    // 에러 메시지나 validation 확인
    cy.get('input[type="email"]:invalid').should('exist')
  })

  it('잘못된 이메일 형식으로 로그인 시도', () => {
    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('password123')
    cy.get('button').contains('로그인').click()
    
    // HTML5 validation 확인
    cy.get('input[type="email"]:invalid').should('exist')
  })

  // 실제 회원가입/로그인 테스트는 테스트 환경에서만 실행
  it.skip('회원가입이 정상적으로 작동한다', () => {
    // 회원가입 탭 클릭
    cy.contains('회원가입').click()
    
    // 폼 필드 입력
    cy.get('[data-cy=name-input]').type(testName)
    cy.get('[data-cy=email-input]').type(testEmail)
    cy.get('[data-cy=password-input]').type(testPassword)
    
    // 회원가입 버튼 클릭
    cy.get('[data-cy=signup-btn]').click()
    
    // 대시보드로 리디렉션 확인
    cy.url().should('include', '/dashboard')
  })
})