describe('할 일 관리 기능', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/dashboard/todos')
  })

  it('할 일 목록 페이지가 로드된다', () => {
    cy.contains('할 일').should('be.visible')
    
    // 새 할 일 입력 필드 확인
    cy.get('input[placeholder*="할 일"], textarea[placeholder*="할 일"]').should('be.visible')
    
    // 추가 버튼 확인
    cy.get('button').contains('추가').should('be.visible')
  })

  it('새로운 할 일을 추가할 수 있다', () => {
    const newTodo = '테스트 할 일 항목'
    
    // 할 일 입력
    cy.get('input[placeholder*="할 일"], textarea[placeholder*="할 일"]').type(newTodo)
    
    // 추가 버튼 클릭
    cy.get('button').contains('추가').click()
    
    // 새로운 할 일이 목록에 추가되었는지 확인
    cy.contains(newTodo).should('be.visible')
  })

  it('할 일을 완료 처리할 수 있다', () => {
    const testTodo = '완료할 테스트 항목'
    
    // 할 일 추가
    cy.get('input[placeholder*="할 일"], textarea[placeholder*="할 일"]').type(testTodo)
    cy.get('button').contains('추가').click()
    cy.contains(testTodo).should('be.visible')
    
    // 체크박스 클릭하여 완료 처리
    cy.contains(testTodo).parent().find('input[type="checkbox"]').check()
    
    // 완료된 상태 확인 (취소선, 회색 등)
    cy.contains(testTodo).should('have.class', 'line-through')
      .or('have.css', 'text-decoration-line', 'line-through')
      .or('have.css', 'opacity', '0.5')
  })

  it('할 일을 삭제할 수 있다', () => {
    const testTodo = '삭제할 테스트 항목'
    
    // 할 일 추가
    cy.get('input[placeholder*="할 일"], textarea[placeholder*="할 일"]').type(testTodo)
    cy.get('button').contains('추가').click()
    cy.contains(testTodo).should('be.visible')
    
    // 삭제 버튼 클릭
    cy.contains(testTodo).parent().find('button').contains('삭제').click()
    
    // 삭제 확인 (항목이 더 이상 보이지 않음)
    cy.contains(testTodo).should('not.exist')
  })

  it('AI 추천 기능이 작동한다', () => {
    // AI 추천 버튼 클릭
    cy.get('button').contains('추천').click()
    
    // 로딩 상태 확인
    cy.get('.loading, [data-loading="true"]').should('exist')
    
    // AI 추천 할 일이 추가되었는지 확인 (최대 30초 대기)
    cy.get('[data-cy="ai-recommended"], .ai-suggested', { timeout: 30000 })
      .should('be.visible')
  })

  it('빈 할 일은 추가할 수 없다', () => {
    // 빈 상태에서 추가 버튼 클릭
    cy.get('button').contains('추가').click()
    
    // 에러 메시지나 validation 확인
    cy.get('input:invalid, textarea:invalid').should('exist')
      .or('contain.text', '입력')
  })
})