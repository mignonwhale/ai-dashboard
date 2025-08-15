# 테스트 환경에서 인증 정보 관리 모범 사례

## 🚫 하지 말아야 할 것
- ✗ 하드코딩으로 실제 계정 정보 입력
- ✗ Git 리포지토리에 민감한 정보 커밋
- ✗ 프로덕션 데이터베이스에서 테스트

## ✅ 실제 프로덕션에서 사용하는 방법들

### 1. **환경 변수 방식** (현재 적용됨)
```json
// cypress.env.json (Git에 포함하지 않음)
{
  "TEST_USER_EMAIL": "test-user@example.com",
  "TEST_USER_PASSWORD": "secure-test-password"
}
```

```javascript
// 테스트에서 안전하게 사용 (fallback 없이)
const testEmail = Cypress.env('TEST_USER_EMAIL')
const testPassword = Cypress.env('TEST_USER_PASSWORD')

// 환경 변수가 없으면 테스트 스킵
if (!testEmail || !testPassword) {
  cy.log('환경 변수가 설정되지 않아 테스트를 스킵합니다')
  return
}
```

**⚠️ 주의사항:**
- fallback으로 실제 계정 정보를 하드코딩하지 마세요
- `cypress.env.example.json`은 Git에 포함해도 되지만 실제 값은 제외

### 2. **전용 테스트 데이터베이스 + 시딩**
```javascript
// cypress/support/commands.ts
Cypress.Commands.add('seedTestUser', () => {
  cy.task('db:seed', {
    email: 'test@example.com',
    password: 'hashed-password',
    verified: true
  })
})

// 테스트에서
beforeEach(() => {
  cy.seedTestUser()
})
```

### 3. **API 직접 인증** (가장 빠름)
```javascript
Cypress.Commands.add('loginByAPI', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password })
    .then((resp) => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth-token', resp.body.token)
      })
    })
})

// 테스트에서
beforeEach(() => {
  cy.loginByAPI('test@example.com', 'password123')
})
```

### 4. **Mock 인증** (API 모킹)
```javascript
// cypress/support/commands.ts
Cypress.Commands.add('mockAuth', () => {
  cy.intercept('GET', '/api/auth/user', { 
    statusCode: 200,
    body: { id: 'test-123', email: 'test@example.com' }
  })
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200, 
    body: { token: 'mock-jwt-token' }
  })
})
```

### 5. **테스트 전용 계정 자동 생성**
```javascript
Cypress.Commands.add('createTestUser', () => {
  const timestamp = Date.now()
  const testUser = {
    email: `test-${timestamp}@cypress.local`,
    password: 'Test123!@#',
    name: 'Cypress Test User'
  }
  
  cy.request('POST', '/api/auth/register', testUser)
    .then(() => testUser)
})

// 테스트에서
beforeEach(() => {
  cy.createTestUser().then((user) => {
    cy.wrap(user).as('testUser')
  })
})
```

## 🏢 기업 환경에서의 추가 방식

### 6. **CI/CD 환경 변수**
```yaml
# GitHub Actions
env:
  CYPRESS_TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  CYPRESS_TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

### 7. **테스트 환경별 구성**
```javascript
// cypress.config.ts
export default defineConfig({
  env: {
    ...process.env.NODE_ENV === 'test' && {
      TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
      TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
    }
  }
})
```

### 8. **Vault/Secret 관리 도구**
```javascript
// CI 환경에서
cy.task('getSecret', 'test-user-credentials').then((creds) => {
  cy.get('input[type="email"]').type(creds.email)
  cy.get('input[type="password"]').type(creds.password)
})
```

## 🎯 권장 사항

1. **로컬 개발**: 환경 변수 + 전용 테스트 DB
2. **CI/CD**: Mock 인증 또는 테스트 계정 자동 생성
3. **스테이징**: 실제 인증 플로우 테스트
4. **프로덕션**: 읽기 전용 테스트만 허용

## 📁 파일 구조 예시
```
cypress/
├── fixtures/
│   └── users.json          # 테스트 사용자 데이터
├── support/
│   ├── auth-commands.ts    # 인증 관련 커스텀 명령
│   └── database-tasks.ts   # DB 시딩 작업
├── e2e/
│   └── auth.cy.ts         # 인증 테스트
└── env/
    ├── local.json         # 로컬 환경 설정
    ├── ci.json           # CI 환경 설정
    └── staging.json      # 스테이징 환경 설정
```

현재 프로젝트에는 **환경 변수 방식**이 적용되어 있으며, `cypress.env.json` 파일이 Git에서 제외되어 보안이 유지됩니다.