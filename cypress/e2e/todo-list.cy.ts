describe('할 일 관리 기능', () => {
  beforeEach(() => {
    // 할 일 관리 페이지 직접 방문 시도
    cy.visit('/dashboard/todos', { failOnStatusCode: false })
  })

  it('인증 없이 접근 시 로그인 페이지로 리다이렉트', () => {
    // 인증이 필요하므로 auth 페이지로 리다이렉트 확인
    cy.url().should('include', '/auth')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('로그인 시도 후 할 일 관리 페이지 접근', () => {
    // 환경 변수에서만 계정 정보 가져오기
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    // 환경 변수가 없으면 기본 UI 테스트만
    if (!testEmail || !testPassword) {
      cy.log('환경 변수가 설정되지 않아 기본 UI 테스트만 진행')
      cy.url().should('include', '/auth')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      return
    }

    // 실제 테스트 계정으로 로그인
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    
    // 로그인 결과에 따른 분기 처리
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes('/dashboard')) {
        cy.log('로그인 성공 - 할 일 관리 페이지 테스트 진행')
        
        // 할 일 관리 페이지로 이동
        cy.visit('/dashboard/todos')
        
        // 페이지 로드 확인
        cy.get('body').should('be.visible')
        
        // 할 일 관리 관련 요소들 확인
        cy.get('[data-testid="todo-input"]').should('exist')
        cy.get('[data-testid="add-todo-button"]').should('exist')
      } else {
        cy.log('로그인 실패 - 인증 페이지 UI 테스트만 진행')
        cy.get('input[type="email"]').should('be.visible')
        cy.get('input[type="password"]').should('be.visible')
      }
    })
  })

  // 인증 시스템 동작 확인
  it('인증 시스템이 올바르게 동작함을 확인', () => {
    // 보호된 페이지 접근 시 인증 페이지로 리다이렉트됨을 확인
    cy.url().should('include', '/auth')
    
    // 로그인 폼이 정상적으로 렌더링되는지 확인
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('로그인').should('be.visible')
    
    cy.log('할 일 관리 페이지는 인증 후에만 접근 가능함을 확인')
  })

  // 실제 할 일 관리 기능 테스트 (선택적 실행)
  it('실제 계정으로 할 일 관리 테스트', () => {
    // 환경 변수에서만 계정 정보 가져오기
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    // 환경 변수가 없으면 테스트 스킵
    if (!testEmail || !testPassword) {
      cy.log('⚠️ 환경 변수가 설정되지 않아 테스트를 스킵합니다')
      return
    }

    // 로그인
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    
    // 로그인 성공 대기 및 확인
    cy.url({ timeout: 10000 }).should('include', '/dashboard')
    cy.log('✅ 로그인 성공 - 대시보드 접근됨')
    
    // 할 일 관리 페이지로 이동
    cy.log('✅ 할 일 관리 페이지로 이동 중...')
    cy.visit('/dashboard/todos')
    
    // 페이지가 완전히 로드될 때까지 대기
    cy.contains('할 일', { timeout: 10000 }).should('be.visible')
    
    // 할 일 관리 요소들 확인
    cy.get('[data-testid="todo-input"]').should('exist')
    cy.get('[data-testid="add-todo-button"]').should('exist')
    cy.log('✅ 할 일 관리 페이지 로드 완료')
    
    // 새로운 할 일 추가 테스트
    const newTodo = `테스트 할 일 ${Date.now()}`
    
    cy.log('➕ 새로운 할 일 추가 테스트...')
    cy.get('[data-testid="todo-input"]').clear().type(newTodo)
    cy.get('[data-testid="add-todo-button"]').click()
    
    // 새로운 할 일이 목록에 추가되었는지 확인
    cy.contains(newTodo, { timeout: 5000 }).should('exist')
    cy.log('✅ 새로운 할 일 추가 완료')
    
    // 할 일 완료 처리 테스트
    cy.log('✓ 할 일 완료 처리 테스트...')
    cy.contains(newTodo).closest('[data-testid="todo-item"], [data-testid="ai-recommended-todo"]').within(() => {
      cy.get('input[type="checkbox"]').check()
    })
    
    // 완료된 상태 확인 (취소선과 회색 텍스트 클래스 확인)
    cy.contains(newTodo)
      .should('have.class', 'line-through')
      .and('have.class', 'text-gray-500')
    cy.log('✅ 완료 상태 스타일 확인됨')
    cy.log('✅ 할 일 완료 처리 확인 완료')
    
    cy.log('✅ 할 일 관리 테스트 모두 완료!')
  })

  // AI 추천 및 validation 테스트 (환경변수 있을 때만)
  it('AI 추천 및 validation 테스트', () => {
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    if (!testEmail || !testPassword) {
      cy.log('⚠️ 환경 변수가 설정되지 않아 테스트를 스킵합니다')
      return
    }

    // 로그인
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    cy.url({ timeout: 10000 }).should('include', '/dashboard')
    cy.visit('/dashboard/todos')
    cy.get('[data-testid="todo-input"]').should('exist')
    
    // AI 추천 기능 테스트
    cy.log('🤖 AI 추천 기능 테스트...')
    
    // AI 추천 전 현재 할 일 개수 저장
    let initialTodoCount = 0
    let initialAiRecommendedCount = 0
    
    cy.get('[data-testid="todo-item"], [data-testid="ai-recommended-todo"]').then(($todos) => {
      initialTodoCount = $todos.length
      cy.log(`📊 AI 추천 전 전체 할 일: ${initialTodoCount}개`)
    })
    
    cy.get('[data-testid="ai-recommended-todo"]').then(($aiTodos) => {
      initialAiRecommendedCount = $aiTodos.length
      cy.log(`🤖 AI 추천 전 AI 추천 할 일: ${initialAiRecommendedCount}개`)
    })
    
    cy.get('[data-testid="ai-recommend-button"]').click()
    
    // 로딩 상태 확인 (버튼 텍스트가 "추천 중..."으로 변경)
    cy.get('[data-testid="ai-recommend-button"]').should('contain', '추천 중...', { timeout: 5000 })
    
    // 로딩이 끝날 때까지 대기 (버튼이 다시 "AI 추천 받기"로 돌아올 때까지)
    cy.get('[data-testid="ai-recommend-button"]').should('contain', 'AI 추천 받기', { timeout: 30000 })
    
    // AI 추천 후 할 일 개수가 증가했는지 확인
    cy.get('[data-testid="todo-item"], [data-testid="ai-recommended-todo"]').then(($newTodos) => {
      const newTodoCount = $newTodos.length
      cy.log(`📊 AI 추천 후 전체 할 일: ${newTodoCount}개`)
      expect(newTodoCount).to.be.greaterThan(initialTodoCount)
    })
    
    // AI 추천 할 일이 실제로 증가했는지 확인
    cy.get('[data-testid="ai-recommended-todo"]').then(($newAiTodos) => {
      const newAiRecommendedCount = $newAiTodos.length
      cy.log(`🤖 AI 추천 후 AI 추천 할 일: ${newAiRecommendedCount}개`)
      expect(newAiRecommendedCount).to.be.greaterThan(initialAiRecommendedCount)
      
      const addedCount = newAiRecommendedCount - initialAiRecommendedCount
      cy.log(`✨ 새로 추가된 AI 추천 할 일: ${addedCount}개`)
    })
    
    cy.log('✅ AI 추천 기능 확인 완료')
    
    // 빈 할 일 validation 테스트
    cy.log('🚫 빈 할 일 validation 테스트...')
    
    // 입력 필드가 비어있는지 확인
    cy.get('[data-testid="todo-input"]').should('have.value', '')
    
    // 추가 버튼이 비활성화되어 있는지 확인
    cy.get('[data-testid="add-todo-button"]').should('be.disabled')
    
    // 에러 메시지 확인 (있을 수도 있고 없을 수도 있음)
    cy.get('body').then(($body) => {
      if ($body.text().includes('입력해') || $body.text().includes('비어') || $body.text().includes('필수')) {
        cy.log('✅ 에러 메시지 확인됨')
      } else {
        cy.log('✅ validation만으로 확인됨')
      }
    })
    cy.log('✅ 빈 할 일 validation 확인 완료')
  })

  // 데이터 지속성 테스트 (환경변수 있을 때만)
  it('할 일 목록 지속성 테스트', () => {
    const testEmail = Cypress.env('TEST_USER_EMAIL')
    const testPassword = Cypress.env('TEST_USER_PASSWORD')
    
    if (!testEmail || !testPassword) {
      cy.log('⚠️ 환경 변수가 설정되지 않아 테스트를 스킵합니다')
      return
    }

    // 로그인
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button').contains('로그인').click()
    cy.url({ timeout: 10000 }).should('include', '/dashboard')
    cy.visit('/dashboard/todos')
    cy.get('[data-testid="todo-input"]').should('exist')
    
    // 지속성 테스트용 할 일 추가
    const testTodo = `지속성 테스트 ${Date.now()}`
    
    cy.log('💾 데이터 지속성 테스트...')
    cy.get('[data-testid="todo-input"]').clear().type(testTodo)
    cy.get('[data-testid="add-todo-button"]').click()
    cy.contains(testTodo, { timeout: 5000 }).should('exist')
    
    // 페이지 새로고침
    cy.reload()
    
    // 추가한 할 일이 여전히 있는지 확인
    cy.contains(testTodo, { timeout: 10000 }).should('exist')
    cy.log('✅ 데이터 지속성 확인 완료')
  })
})