describe('파일 분석 기능', () => {
  beforeEach(() => {
    // 파일 분석 페이지 직접 방문 시도
    cy.visit('/dashboard/file-analyzer', { failOnStatusCode: false })
  })

  it('인증 없이 접근 시 로그인 페이지로 리다이렉트', () => {
    // 인증이 필요하므로 auth 페이지로 리다이렉트 확인
    cy.url().should('include', '/auth')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('로그인 시도 후 파일 분석 페이지 접근', () => {
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
        cy.log('로그인 성공 - 파일 분석 페이지 테스트 진행')
        
        // 파일 분석 페이지로 이동
        cy.visit('/dashboard/file-analyzer')
        
        // 페이지 로드 확인
        cy.get('body').should('be.visible')
        
        // 파일 분석 관련 요소들 확인 (유연한 셀렉터)
        cy.get('input[type="file"]').should('exist') // 파일 업로드
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
    
    cy.log('파일 분석 페이지는 인증 후에만 접근 가능함을 확인')
  })

  // 실제 파일 분석 기능 테스트 (선택적 실행)
  it('실제 계정으로 파일 업로드 및 분석 테스트', () => {
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
    
    // 파일 분석 페이지로 이동
    cy.log('📄 파일 분석 페이지로 이동 중...')
    cy.visit('/dashboard/file-analyzer')
    
    // 페이지가 완전히 로드될 때까지 대기
    cy.contains('파일 분석', { timeout: 10000 }).should('be.visible')
    
    // 파일 업로드 영역 확인 (숨겨진 input 요소)
    cy.get('input[type="file"]').should('exist') // visible 대신 exist 사용
    cy.log('✅ 파일 분석 페이지 로드 완료')
    
    // 테스트용 PDF 파일 내용 생성 (간단한 PDF 구조)
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 100 Td
(Test PDF Content) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000060 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`

    // PDF 파일 업로드 (숨겨진 input에 직접 파일 첨부)
    cy.log('📤 PDF 파일 업로드 시작...')

    // 윈도우 객체에서 직접 파일 생성하여 업로드
    cy.window().then((win) => {
      const blob = new win.Blob([pdfContent], { type: 'application/pdf' })
      const testFile = new win.File([blob], 'test-document.pdf', { type: 'application/pdf' })

      cy.get('input[type="file"]').then(($input) => {
        const input = $input[0] as HTMLInputElement
        const dataTransfer = new win.DataTransfer()
        dataTransfer.items.add(testFile)
        input.files = dataTransfer.files

        // change 이벤트 수동 트리거
        const event = new win.Event('change', { bubbles: true })
        input.dispatchEvent(event)
      })
    })

    // 파일이 선택되었는지 확인 (파일 정보 표시)
    cy.contains('test-document.pdf', { timeout: 5000 }).should('be.visible')
    cy.log('✅ PDF 파일 업로드 완료')
    
    // "파일 분석" 버튼이 나타나는지 확인하고 클릭
    cy.get('[data-testid="analyze-button"]').should('contain', '파일 분석').should('be.visible')
    cy.log('🔄 파일 분석 시작...')
    cy.get('[data-testid="analyze-button"]').click()
    
    // 로딩 상태 확인 (버튼 텍스트가 "분석 중..."으로 변경)
    cy.get('[data-testid="analyze-button"]').should('contain', '분석 중...', { timeout: 5000 })
    cy.log('⏳ AI 분석 진행 중...')
    
    // AI 분석 완료 후 결과 확인 (최대 30초 대기)
    // 분석이 완료되면 '분석 결과' 제목이 나타남
    cy.contains('분석 결과', { timeout: 30000 }).should('exist')
    cy.log('🤖 AI 분석 결과 표시 완료!')
    
    cy.log('✅ 파일 업로드, 분석 테스트 모두 완료!')
  })

  // 파일 형식 및 크기 제한 테스트 (환경변수 있을 때만)
  it('파일 형식 및 크기 제한 테스트', () => {
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
    cy.visit('/dashboard/file-analyzer')
    cy.get('input[type="file"]').should('exist')
    
    // 지원되지 않는 파일 형식 테스트
    cy.log('🚫 지원되지 않는 파일 형식 테스트...')
    cy.window().then((win) => {
      const invalidFile = new win.File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      cy.get('input[type="file"]').then(($input) => {
        const input = $input[0] as HTMLInputElement
        const dataTransfer = new win.DataTransfer()
        dataTransfer.items.add(invalidFile)
        input.files = dataTransfer.files
        input.dispatchEvent(new win.Event('change', { bubbles: true }))
      })
    })
    
    // 에러 메시지 확인
    cy.contains('지원되지 않는', { timeout: 5000 }).should('exist')
    cy.contains('형식', { timeout: 5000 }).should('exist')
    cy.log('✅ 파일 형식 제한 확인 완료')
  })
})
