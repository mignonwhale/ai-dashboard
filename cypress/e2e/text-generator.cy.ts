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
      .or('contain.text', '입력')
  })
})