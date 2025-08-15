# 📋 Development Checklist

## 🚀 개발 환경 설정

### 필수 환경변수
- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `GEMINI_API_KEY` 설정

### 개발 서버 실행
- [ ] `yarn install` 의존성 설치
- [ ] `yarn dev` 개발 서버 시작
- [ ] 포트 확인 (기본 3000, 충돌시 자동 변경)

## 🧪 테스트 설정

### Cypress 설정
- [ ] `cypress.config.ts`에서 `baseUrl` 확인
- [ ] 개발 서버 포트와 일치하는지 확인
- [ ] `cypress.env.json` 파일 설정 (선택사항)
  ```json
  {
    "TEST_USER_EMAIL": "test@example.com",
    "TEST_USER_PASSWORD": "password123"
  }
  ```

### 테스트 실행 전 체크리스트
- [ ] 개발 서버가 정상 실행 중인지 확인
- [ ] Supabase 연결 확인
- [ ] API 키 유효성 확인
- [ ] 캐시 문제 시 `.next` 폴더 삭제

## 🔍 테스트 케이스별 체크리스트

### 인증 테스트 (`auth.cy.ts`)
- [ ] 로그인 페이지 로드 확인
- [ ] 회원가입 모드 전환 테스트
- [ ] 이름 필드 표시 확인 (회원가입 모드에서만)
- [ ] 유효성 검사 테스트
- [ ] 환경변수 기반 실제 로그인 테스트

### AI 챗봇 테스트 (`ai-chat.cy.ts`)
- [ ] 인증 리다이렉트 확인
- [ ] 챗봇 UI 로드 확인
- [ ] 메시지 전송 테스트
- [ ] AI 응답 로딩 상태 확인
- [ ] 마크다운 렌더링 확인 (스크롤 가능 영역)

### CSV 분석 테스트 (`csv-analyzer.cy.ts`)
- [ ] 데이터 시각화 페이지 접근
- [ ] 파일 업로드 영역 확인
- [ ] CSV 파일 업로드 (숨겨진 input 처리)
- [ ] 분석 버튼 클릭
- [ ] AI 분석 결과 확인
- [ ] 차트 시각화 확인
- [ ] 차트 타입 변경 테스트

## 🐛 일반적인 문제 해결

### Cypress 관련
- [ ] 요소 가시성 문제 → `should('exist')` 사용
- [ ] 숨겨진 input → `{ force: true }` 옵션
- [ ] 파일 업로드 → 브라우저 윈도우 객체 활용
- [ ] 타임아웃 조정 → `{ timeout: 30000 }` 설정

### 개발 서버 관련
- [ ] Webpack 캐시 문제 → `.next` 삭제
- [ ] 포트 충돌 → `cypress.config.ts` 업데이트
- [ ] 환경변수 누락 → `.env.local` 확인

## 📱 기능별 테스트 가이드

### 1. 인증 시스템
```typescript
// 로그인 모드 확인
cy.contains('로그인').should('be.visible')

// 회원가입 모드로 전환
cy.contains('회원가입').click()
cy.contains('AI 어시스턴트 가입하기').should('be.visible')

// 필드 확인
cy.get('input[placeholder="홍길동"]').should('be.visible')
```

### 2. 파일 업로드
```typescript
// 브라우저 API 사용
cy.window().then((win) => {
  const blob = new win.Blob([content], { type: 'text/csv' })
  const file = new win.File([blob], 'test.csv', { type: 'text/csv' })
  
  cy.get('input[type="file"]').then(($input) => {
    const input = $input[0] as HTMLInputElement
    const dataTransfer = new win.DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files
    input.dispatchEvent(new win.Event('change', { bubbles: true }))
  })
})
```

### 3. AI 응답 대기
```typescript
// 로딩 상태 확인
cy.get('.animate-bounce', { timeout: 10000 }).should('exist')

// 완료 상태 확인  
cy.get('.animate-bounce', { timeout: 30000 }).should('not.exist')

// 결과 확인
cy.contains('📊 AI 분석 결과').should('be.visible')
```

## 🚢 배포 전 체크리스트

### 코드 품질
- [ ] TypeScript 에러 없음
- [ ] ESLint 에러 없음
- [ ] 콘솔 에러 없음
- [ ] 모든 Cypress 테스트 통과

### 기능 테스트
- [ ] 모든 페이지 정상 로드
- [ ] 인증 플로우 작동
- [ ] AI 기능들 정상 동작
- [ ] 파일 업로드/분석 작동
- [ ] 반응형 디자인 확인

### 보안 체크
- [ ] API 키 노출 없음
- [ ] 민감한 정보 로깅 없음
- [ ] 환경변수 적절히 설정
- [ ] `.gitignore`에 중요 파일 포함

## 📝 커밋 가이드라인

### 커밋 메시지 형식
```
타입(범위): 간단한 설명

상세 설명 (선택사항)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 타입별 예시
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `test`: 테스트 관련
- `docs`: 문서 업데이트
- `refactor`: 코드 리팩토링
- `style`: 코드 스타일 변경

### 예시
```bash
git commit -m "test: Cypress 테스트 오류 수정 및 안정성 개선

- AI 챗봇 요소 가시성 문제 해결
- 인증 폼 회원가입 모드 테스트 수정  
- CSV 파일 업로드 숨겨진 input 처리
- 브라우저 API 활용한 파일 생성 로직 개선

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```