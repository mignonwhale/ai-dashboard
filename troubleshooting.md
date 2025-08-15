# 🔧 Troubleshooting Guide

## Cypress 테스트 관련 문제

### 1. AI 챗봇 테스트 - 요소 가시성 문제

**문제**: `p.mb-2.last:mb-0` 요소가 보이지 않는 에러
```
Timed out retrying after 5000ms: expected 'p.mb-2.last:mb-0' to be 'visible'
This element <p.mb-2.last:mb-0> is not visible because its content is being clipped by one of its parent elements, which has a CSS property of overflow: hidden, clip, scroll or auto
```

**원인**: 
- ReactMarkdown 컴포넌트에서 생성되는 `<p className="mb-2 last:mb-0">` 요소가 `overflow-y-auto` 컨테이너에 의해 클리핑됨
- 스크롤 위치나 컨테이너 크기로 인해 요소가 화면에 보이지 않음

**해결방법**:
```typescript
// 직접적인 가시성 검사 대신 존재 여부 확인
cy.contains(testMessage, { timeout: 5000 }).should('exist')

// 또는 특정 컨테이너 내에서 확인
cy.get('[data-testid="chat-messages"], .space-y-4').within(() => {
  cy.contains(testMessage, { timeout: 5000 }).should('exist')
})

// AI 응답 로딩 상태로 확인
cy.get('.animate-bounce', { timeout: 10000 }).should('exist')
cy.get('.animate-bounce', { timeout: 15000 }).should('not.exist')
```

### 2. 인증 테스트 - 이름 필드 찾기 실패

**문제**: 회원가입 폼에서 이름 입력 필드를 찾을 수 없음
```
Timed out retrying after 10000ms: Expected to find element: input[placeholder*="이름"], input[name="name"], but never found it.
```

**원인**: 
- 이름 필드는 회원가입 모드에서만 표시됨 (`!isLogin && !isPasswordReset`)
- 로그인 모드에서는 이름 필드가 DOM에 존재하지 않음

**해결방법**:
```typescript
// 1. 회원가입 모드로 전환 후 필드 확인
cy.contains('회원가입').click()
cy.contains('AI 어시스턴트 가입하기').should('be.visible')

// 2. 실제 placeholder 텍스트 사용
cy.get('input[placeholder="홍길동"]').should('be.visible')

// 3. 비밀번호 필드 개수로 확인
cy.get('input[type="password"]').should('have.length', 2) // 비밀번호 + 확인
```

### 3. CSV 분석 테스트 - 숨겨진 파일 입력 요소

**문제**: 숨겨진 파일 입력 요소에 대한 가시성 에러
```
Timed out retrying after 10000ms: expected '<input.hidden>' to be 'visible'
This element <input.hidden> is not visible because it has CSS property: display: none
```

**원인**: 
- DataVisualizer 컴포넌트에서 `<input type="file" className="hidden">` 사용
- 드래그 앤 드롭 UI를 위해 실제 input은 숨겨져 있음

**해결방법**:
```typescript
// 1. visible 대신 exist 사용
cy.get('input[type="file"]').should('exist')

// 2. 브라우저 윈도우 객체로 파일 생성
cy.window().then((win) => {
  const blob = new win.Blob([csvContent], { type: 'text/csv' })
  const testFile = new win.File([blob], 'test-data.csv', { type: 'text/csv' })
  
  cy.get('input[type="file"]').then(($input) => {
    const input = $input[0] as HTMLInputElement
    const dataTransfer = new win.DataTransfer()
    dataTransfer.items.add(testFile)
    input.files = dataTransfer.files
    input.dispatchEvent(new win.Event('change', { bubbles: true }))
  })
})
```

### 4. CSV 파일 업로드 - selectFile 에러

**문제**: Cypress selectFile 메서드가 문자열을 파일 경로로 인식
```
cy.selectFile("name,age,city,salary...") failed because the file does not exist at the following path:
```

**원인**: 
- `selectFile()` 메서드는 실제 파일 경로를 기대함
- 메모리상의 문자열 내용을 직접 전달할 수 없음

**해결방법**: 위의 브라우저 윈도우 객체를 사용한 파일 생성 방법 적용

## 개발 서버 관련 문제

### 1. Webpack 캐시 손상

**문제**: 
```
[webpack.cache.PackFileCacheStrategy] Restoring failed for CopyFilePlugin|...|polyfill-nomodule.js from pack: Error: invalid code lengths set
```

**원인**: Next.js Webpack 캐시 파일 손상

**해결방법**:
```bash
# 캐시 디렉터리 삭제 후 서버 재시작
rm -rf .next
yarn dev
```

### 2. Supabase 환경변수 누락

**문제**: 
```
Error: supabaseUrl is required.
```

**원인**: 환경변수가 설정되지 않음

**해결방법**:
```bash
# .env.local 파일 생성
echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "GEMINI_API_KEY=your-gemini-key" >> .env.local
```

## 포트 관련 문제

### 1. 개발 서버 포트 변경

**문제**: 개발 서버가 예상과 다른 포트에서 실행

**해결방법**:
```typescript
// cypress.config.ts에서 baseUrl 업데이트
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:실제포트번호',
    // ...
  },
})
```

## 테스트 모범 사례

### 1. 안정적인 요소 선택
```typescript
// ❌ 불안정한 방법
cy.get('.css-class-123').click()

// ✅ 안정적인 방법
cy.get('[data-testid="submit-button"]').click()
cy.contains('로그인').click()
```

### 2. 적절한 대기 시간
```typescript
// ❌ 고정된 짧은 시간
cy.wait(1000)

// ✅ 조건부 대기
cy.get('.loading', { timeout: 10000 }).should('not.exist')
cy.contains('로드 완료', { timeout: 30000 }).should('be.visible')
```

### 3. 에러 처리
```typescript
// 환경변수 확인 후 테스트 스킵
const testEmail = Cypress.env('TEST_USER_EMAIL')
if (!testEmail) {
  cy.log('환경 변수가 없어 테스트를 스킵합니다')
  return
}
```