describe('AI 텍스트 생성기', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/dashboard/text-gen')
  })

  it('텍스트 생성기 페이지가 로드된다', () => {
    cy.contains('텍스트 생성').should('be.visible')
    
    // 프롬프트 입력 필드 확인
    cy.get('textarea, input').should('be.visible')
    
    // 생성 버튼 확인
    cy.get('button').contains('생성').should('be.visible')
  })

  it('텍스트 생성 요청이 가능하다', () => {
    const testPrompt = '블로그 글 제목 5개 추천해줘'
    
    // 프롬프트 입력
    cy.get('textarea, input').first().type(testPrompt)
    
    // 생성 버튼 클릭
    cy.get('button').contains('생성').click()
    
    // 로딩 상태 확인
    cy.get('.loading, [data-loading="true"]').should('exist')
    
    // 생성된 텍스트 확인 (최대 30초 대기)
    cy.get('[data-cy="generated-text"], .result', { timeout: 30000 }).should('be.visible')
  })

  it('빈 프롬프트로는 생성할 수 없다', () => {
    // 빈 상태에서 생성 버튼 클릭
    cy.get('button').contains('생성').click()
    
    // 에러 메시지나 validation 확인
    cy.get('textarea:invalid, input:invalid').should('exist')
    cy.contains('입력해', { timeout: 5000 }).should('be.visible')
      .or('contain.text', '필수')
      .or('contain.text', '비어')
  })

  it('생성된 텍스트를 복사할 수 있다', () => {
    const testPrompt = '간단한 인사말 작성해줘'
    
    // 프롬프트 입력 및 생성
    cy.get('textarea, input').first().type(testPrompt)
    cy.get('button').contains('생성').click()
    
    // 생성 완료 대기
    cy.get('[data-cy="generated-text"], .result', { timeout: 30000 }).should('be.visible')
    
    // 복사 버튼이 있는지 확인
    cy.get('button').contains('복사').should('be.visible')
  })
})