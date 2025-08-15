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
    // auth 링크나 버튼이 있는지 확인하고 클릭
    cy.get('a[href="/auth"], button').contains('로그인').click()
    cy.url().should('include', '/auth')
  })

  it('네비게이션 요소들이 존재한다', () => {
    // 기본적인 네비게이션 요소들 확인
    cy.get('nav, header, .navbar').should('exist')
    
    // 로고나 사이트 제목 확인
    cy.get('h1, .logo, [data-cy="site-title"]').should('exist')
  })
})