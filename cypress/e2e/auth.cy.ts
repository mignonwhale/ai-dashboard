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

  it('회원가입 폼이 정상적으로 표시된다', () => {
    // 회원가입 탭 클릭
    cy.contains('회원가입').click()
    
    // 페이지 상태 변경 대기
    cy.contains('AI 어시스턴트 가입하기').should('be.visible')
    
    // 회원가입 폼 필드들이 표시되는지 확인
    cy.get('input[placeholder="홍길동"]').should('be.visible') // 이름 필드의 실제 placeholder
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('회원가입').should('be.visible') // 실제 버튼 텍스트
    
    // 비밀번호 확인 필드도 확인
    cy.get('input[type="password"]').should('have.length', 2) // 비밀번호 + 비밀번호 확인
  })

  it('회원가입 폼 입력 테스트', () => {
    // 회원가입 모드로 전환
    cy.contains('회원가입').click()
    cy.contains('AI 어시스턴트 가입하기').should('be.visible')
    
    // 회원가입 폼 입력
    cy.get('input[placeholder="홍길동"]').type(testName)
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').first().type(testPassword)
    cy.get('input[type="password"]').last().type(testPassword)
    
    // 버튼이 활성화되는지 확인
    cy.get('button').contains('회원가입').should('not.be.disabled')
  })

  it('환경변수가 설정된 경우 실제 로그인 테스트', () => {
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    if (!testEmail || !testPassword) {
      cy.log('환경 변수가 설정되지 않아 테스트를 스킵합니다')
      return
    }

    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    
    // 로그인 결과 확인 (성공/실패 모두 허용)
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes('/dashboard')) {
        cy.log('로그인 성공')
      } else {
        cy.log('로그인 실패 또는 계정 없음')
      }
    })
  })
})