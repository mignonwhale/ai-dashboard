describe('홈페이지 테스트', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('홈페이지가 정상적으로 로드된다', () => {
    // 페이지 제목 확인 (실제 제목에 맞게 수정)
    cy.title().should('contain', 'Gemini')
    
    // 메인 콘텐츠 확인
    cy.get('body').should('be.visible')
    
    // 페이지가 정상적으로 렌더링되었는지 확인
    cy.get('h1, h2, .title').should('exist')
  })

  it('로그인 페이지로 이동할 수 있다', () => {
    // auth 링크가 있는지 확인하고 클릭
    cy.contains('로그인').click()
    cy.url().should('include', '/auth')
  })
})