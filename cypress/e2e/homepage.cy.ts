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

  it('메인 콘텐츠 요소들이 존재한다', () => {
    // 메인 제목 확인
    cy.get('h1').should('contain', 'AI 어시스턴트 대시보드')
    
    // 설명 텍스트 확인
    cy.contains('Gemini AI를 활용한').should('exist')
    
    // 로그인 버튼 확인
    cy.get('a[href="/auth"]').should('contain', '로그인')
    
    // 대시보드 미리보기 버튼 확인
    cy.get('a[href="/dashboard"]').should('contain', '대시보드')
  })
})