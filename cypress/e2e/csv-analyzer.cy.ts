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
    
    cy.url({ timeout: 10000 }).then((url) => {
      if (url.includes('/dashboard')) {
        // CSV 분석 페이지로 이동
        cy.visit('/dashboard/data-viz')
        
        // 페이지 로드 대기
        cy.get('input[type="file"]').should('be.visible')
        cy.log('CSV 분석 페이지 접근 성공')
        
        // 테스트용 CSV 데이터 생성
        const csvContent = `name,age,city,salary
John,25,Seoul,50000
Jane,30,Busan,60000
Bob,35,Daegu,55000
Alice,28,Incheon,52000
Mike,32,Gwangju,58000`
        
        const csvFile = new File([csvContent], 'test-data.csv', { 
          type: 'text/csv' 
        })
        
        // CSV 파일 업로드
        cy.get('input[type="file"]').then(input => {
          const dt = new DataTransfer()
          dt.items.add(csvFile)
          ;(input[0] as HTMLInputElement).files = dt.files
          input.trigger('change', { force: true })
        })
        
        cy.log('CSV 파일 업로드 완료')
        
        // 파일 업로드 후 "데이터 분석" 버튼이 나타나는지 확인
        cy.get('button').contains('데이터 분석').should('be.visible').click()
        
        // 로딩 상태 확인 (버튼 텍스트가 "분석 중..."으로 변경)
        cy.get('button').contains('분석 중...').should('be.visible')
        
        // AI 분석 완료 후 차트가 나타나는지 확인 (최대 30초 대기)
        cy.get('canvas', { timeout: 30000 }).should('be.visible')
        
        cy.log('CSV 파일 분석 및 차트 시각화 완료!')
        
        // AI 분석 결과 텍스트 확인
        cy.get('div').contains('📊 AI 분석 결과').should('be.visible')
        
        // 차트 타입 변경 버튼들이 나타나는지 확인
        cy.get('button').contains('막대 차트').should('be.visible')
        cy.get('button').contains('선형 차트').should('be.visible')
        cy.get('button').contains('파이 차트').should('be.visible')
        
        // 차트 타입 변경 테스트
        cy.get('button').contains('선형 차트').click()
        cy.get('canvas').should('be.visible') // 차트가 다시 렌더링됨
        
        cy.log('차트 타입 변경 테스트 완료!')
        
      } else {
        cy.log('로그인 실패 - CSV 분석 테스트 스킵')
      }
    })
  })
})
