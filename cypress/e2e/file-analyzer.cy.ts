describe('파일 분석 기능', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/dashboard/file-analyzer')
  })

  it('파일 분석 페이지가 로드된다', () => {
    cy.contains('파일 분석').should('be.visible')
    
    // 파일 업로드 영역 확인
    cy.get('input[type="file"], [data-cy="file-drop-zone"]').should('exist')
  })

  it('파일 드래그 앤 드롭 영역이 작동한다', () => {
    // 파일 업로드 영역에 마우스 오버
    cy.get('[data-cy="file-drop-zone"], .drop-zone').trigger('dragenter')
    
    // 드래그 상태 시각적 피드백 확인
    cy.get('.drag-over, .border-dashed').should('exist')
  })

  it('지원되지 않는 파일 형식에 대한 에러 처리', () => {
    // 이미지 파일 등 지원되지 않는 형식 테스트
    const invalidFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    cy.get('input[type="file"]').then(input => {
      const dt = new DataTransfer()
      dt.items.add(invalidFile)
      ;(input[0] as HTMLInputElement).files = dt.files
      input.trigger('change')
    })
    
    // 에러 메시지 확인
    cy.contains('지원되지 않는', { timeout: 5000 }).should('be.visible')
      .or('contain.text', '형식')
  })

  it('파일 크기 제한 확인', () => {
    // 큰 파일 시뮬레이션 (11MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { 
      type: 'text/plain' 
    })
    
    cy.get('input[type="file"]').then(input => {
      const dt = new DataTransfer()
      dt.items.add(largeFile)
      ;(input[0] as HTMLInputElement).files = dt.files
      input.trigger('change')
    })
    
    // 파일 크기 초과 에러 메시지 확인
    cy.contains('크기', { timeout: 5000 }).should('be.visible')
      .or('contain.text', '10MB')
  })

  it('유효한 파일 업로드 시 분석 진행', () => {
    // 테스트용 텍스트 파일 생성
    const testFile = new File(['이것은 테스트 파일입니다.\n분석할 내용이 들어있습니다.'], 'test.txt', { 
      type: 'text/plain' 
    })
    
    cy.get('input[type="file"]').then(input => {
      const dt = new DataTransfer()
      dt.items.add(testFile)
      ;(input[0] as HTMLInputElement).files = dt.files
      input.trigger('change')
    })
    
    // 파일 업로드 후 분석 버튼이 나타나는지 확인
    cy.get('button').contains('분석', { timeout: 10000 }).should('be.visible').click()
    
    // 분석 중 상태 확인
    cy.get('.loading, [data-loading="true"]').should('exist')
    
    // 분석 결과 확인 (최대 30초 대기)
    cy.get('[data-cy="analysis-result"], .analysis-result', { timeout: 30000 })
      .should('be.visible')
  })
})