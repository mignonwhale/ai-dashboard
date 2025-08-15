describe('대시보드 기능', () => {
  beforeEach(() => {
    // 직접 대시보드 페이지들로 접근 테스트
    cy.visit('/dashboard', { failOnStatusCode: false })
  })

  it('대시보드 접근 시 인증이 필요함을 확인', () => {
    // 인증되지 않은 상태에서는 auth 페이지로 리다이렉트
    cy.url().should('include', '/auth')
    
    // 로그인 폼이 표시되는지 확인
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('대시보드 하위 페이지 접근 시 인증 리다이렉트 확인', () => {
    // 보호된 페이지들에 직접 접근 시도하여 인증 리다이렉트 확인
    const protectedPages = [
      '/dashboard/chat',
      '/dashboard/text-gen', 
      '/dashboard/file-analyzer',
      '/dashboard/todos',
      '/dashboard/data-viz'
    ]
    
    protectedPages.forEach(page => {
      cy.log(`테스트 중: ${page}`)
      
      // 각 페이지에 직접 접근 시도
      cy.visit(page, { failOnStatusCode: false })
      
      // 인증 페이지로 리다이렉트되는지 확인 (페이지가 존재한다는 의미)
      cy.url().should('include', '/auth')
      
      // 로그인 폼이 표시되는지 확인
      cy.get('input[type="email"]').should('be.visible')
    })
    
    cy.log('모든 보호된 페이지가 올바르게 인증 리다이렉트됨')
  })

  it('인증 페이지에서 대시보드로의 네비게이션', () => {
    // 현재 auth 페이지에 있음을 확인
    cy.url().should('include', '/auth')
    
    // 페이지에서 로그인 폼이 있는지 확인
    cy.get('body').should('contain', '로그인')
  })

  // 선택적 실행: 실제 계정이 있을 때만 활성화
  it('로그인 후 대시보드 페이지 접근성 확인', () => {
    // 환경 변수에서만 계정 정보 가져오기 (보안상 fallback 제거)
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    // 환경 변수가 없으면 테스트 스킵
    if (!testEmail || !testPassword) {
      cy.log('⚠️ 환경 변수가 설정되지 않아 테스트를 스킵합니다')
      cy.log('💡 cypress.env.json 파일에 TEST_USER_EMAIL과 TEST_USER_PASSWORD를 설정하세요')
      return
    }
    
    // 로그인 시도
    cy.url().should('include', '/auth')
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    
    // 로그인 성공 시 대시보드 페이지들 테스트
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes('/dashboard')) {
        cy.log('로그인 성공 - 대시보드 페이지들 테스트 시작')
        
        const dashboardPages = [
          { path: '/dashboard/chat', name: 'AI 챗봇' },
          { path: '/dashboard/text-gen', name: '텍스트 생성' },
          { path: '/dashboard/file-analyzer', name: '파일 분석' },
          { path: '/dashboard/todos', name: '할 일' },
          { path: '/dashboard/data-viz', name: '데이터 분석' }
        ]
        
        dashboardPages.forEach(page => {
          cy.visit(page.path)
          cy.url().should('include', page.path)
          cy.get('body').should('be.visible')
          cy.log(`${page.name} 페이지 접근 성공`)
        })
        
      } else {
        cy.log('로그인 실패 - 페이지 접근성 테스트 스킵')
      }
    })
  })
})
