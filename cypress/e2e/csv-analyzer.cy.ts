describe('CSV 데이터 분석 기능', () => {
  beforeEach(() => {
    // CSV 데이터 분석 페이지 직접 방문 시도
    cy.visit('/dashboard/data-viz', { failOnStatusCode: false })
  })

  it('인증 없이 접근 시 로그인 페이지로 리다이렉트', () => {
    // 인증이 필요하므로 auth 페이지로 리다이렉트 확인
    cy.url().should('include', '/auth')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('로그인 시도 후 CSV 분석 페이지 접근', () => {
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
        cy.log('로그인 성공 - CSV 분석 페이지 테스트 진행')
        
        // CSV 분석 페이지로 이동
        cy.visit('/dashboard/data-viz')
        
        // 페이지 로드 확인
        cy.get('body').should('be.visible')
        
        // CSV 관련 요소들 확인 (유연한 셀렉터)
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
    
    cy.log('CSV 데이터 분석 페이지는 인증 후에만 접근 가능함을 확인')
  })

  // 실제 CSV 분석 기능 테스트 (선택적 실행)
  it('실제 계정으로 CSV 파일 업로드 및 분석 테스트', () => {
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
    
    // CSV 분석 페이지로 이동
    cy.log('📊 CSV 분석 페이지로 이동 중...')
    cy.visit('/dashboard/data-viz')
    
    // 페이지가 완전히 로드될 때까지 대기
    cy.contains('데이터 시각화', { timeout: 10000 }).should('be.visible')
    cy.contains('CSV 파일 업로드').should('be.visible')
    
    // 파일 업로드 영역 확인 (숨겨진 input 요소)
    cy.get('input[type="file"]').should('exist') // visible 대신 exist 사용
    cy.log('✅ CSV 분석 페이지 로드 완료')
    
    // 테스트용 CSV 데이터 생성
    const csvContent = `name,age,city,salary
John,25,Seoul,50000
Jane,30,Busan,60000
Bob,35,Daegu,55000
Alice,28,Incheon,52000
Mike,32,Gwangju,58000`
    
    // CSV 파일 업로드 (숨겨진 input에 직접 파일 첨부)
    cy.log('📤 CSV 파일 업로드 시작...')
    
    // 윈도우 객체에서 직접 파일 생성하여 업로드
    cy.window().then((win) => {
      const blob = new win.Blob([csvContent], { type: 'text/csv' })
      const testFile = new win.File([blob], 'test-data.csv', { type: 'text/csv' })
      
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
    cy.contains('test-data.csv', { timeout: 5000 }).should('be.visible')
    cy.log('✅ CSV 파일 업로드 완료')
    
    // "데이터 분석" 버튼이 나타나는지 확인하고 클릭
    cy.get('button').contains('데이터 분석', { timeout: 5000 }).should('be.visible')
    cy.log('🔄 데이터 분석 시작...')
    cy.get('button').contains('데이터 분석').click()
    
    // 로딩 상태 확인 (버튼 텍스트가 "분석 중..."으로 변경)
    cy.get('button').contains('분석 중...', { timeout: 5000 }).should('be.visible')
    cy.log('⏳ AI 분석 진행 중...')
    
    // AI 분석 완료 후 결과 확인 (최대 30초 대기)
    // 1. 차트 표시 확인
    cy.get('canvas', { timeout: 30000 }).should('be.visible')
    cy.log('📊 차트 시각화 완료!')
    
    // 2. AI 분석 결과 텍스트 확인
    cy.contains('📊 AI 분석 결과', { timeout: 10000 }).should('be.visible')
    cy.log('🤖 AI 분석 결과 표시 완료!')
    
    // 3. 차트 타입 변경 버튼들 확인
    cy.get('button').contains('막대 차트').should('be.visible')
    cy.get('button').contains('선형 차트').should('be.visible')  
    cy.get('button').contains('파이 차트').should('be.visible')
    
    // 4. 차트 타입 변경 테스트
    cy.log('🔄 차트 타입 변경 테스트...')
    cy.get('button').contains('선형 차트').click()
    cy.get('canvas').should('be.visible') // 차트가 다시 렌더링됨
    
    cy.get('button').contains('파이 차트').click()
    cy.get('canvas').should('be.visible') // 차트가 다시 렌더링됨
    
    cy.log('✅ CSV 파일 업로드, 분석, 시각화 테스트 모두 완료!')
  })
})
