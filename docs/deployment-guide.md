# 🚀 AI 대시보드 배포 가이드

## 📋 개요

이 문서는 AI 어시스턴트 대시보드를 Vercel에 배포하는 전체 과정을 설명합니다.

## 🎯 포트폴리오 프로젝트 최적화

이 프로젝트는 **포트폴리오용 사이드 프로젝트**로 최적화되어 있습니다:

- 간소화된 CI/CD 파이프라인
- 최소한의 환경변수 설정
- Vercel 자체 배포 기능 활용

## 🏗 배포 아키텍처

```
GitHub Repository
       ↓
GitHub Actions (CI - 테스트만)
       ↓
Vercel (자동 배포)
       ↓
Production Site
```

## 📋 사전 준비사항

### 1. 필수 계정

- [GitHub](https://github.com) 계정
- [Vercel](https://vercel.com) 계정
- [Supabase](https://supabase.com) 계정 (이미 설정됨)
- [Google AI Studio](https://aistudio.google.com) 계정 (이미 설정됨)

### 2. 환경변수 확인

로컬 `.env.local` 파일에서 다음 값들을 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 배포 단계별 가이드

### 1단계: GitHub 저장소 준비

```bash
# 1. 모든 변경사항 커밋
git add .
git commit -m "feat: 배포 준비 완료"

# 2. GitHub에 푸시
git push origin main
```

### 2단계: GitHub Secrets 설정

**GitHub 저장소에서:**

1. **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **"Secrets and variables"** → **"Actions"** 클릭
3. **"New repository secret"** 버튼 클릭
4. 다음 3개 변수 추가:

```bash
Name: NEXT_PUBLIC_SUPABASE_URL
Secret: your_supabase_project_url

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Secret: your_supabase_anon_key

Name: GEMINI_API_KEY
Secret: your_gemini_api_key
```

### 3단계: Vercel 프로젝트 생성

**Vercel 대시보드에서:**

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인
2. **"New Project"** 클릭
3. **GitHub 저장소 선택** (`ai-dashboard`)
4. **Framework Preset**: Next.js (자동 감지)
5. **Build Settings**: 기본값 사용
   - Build Command: `yarn build`
   - Output Directory: `.next`
   - Install Command: `yarn install`

### 4단계: Vercel 환경변수 설정

**Vercel 프로젝트 설정에서:**

1. **Settings** 탭 클릭
2. **Environment Variables** 메뉴 클릭
3. 다음 변수들을 **Production**, **Preview**, **Development** 모두에 추가:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 5단계: 첫 배포 실행

1. Vercel에서 **"Deploy"** 버튼 클릭
2. 배포 과정 실시간 모니터링
3. 성공 시 도메인 URL 확인

## 🔄 자동 배포 워크플로우

### GitHub Actions CI (테스트)

```bash
git push origin main
      ↓
GitHub Actions 실행:
- ESLint 검사
- TypeScript 타입 체크
- 단위 테스트 실행
- 빌드 테스트
- Cypress E2E 테스트
      ↓
모든 테스트 통과 시 ✅
```

### Vercel 자동 배포

```bash
GitHub 푸시 감지
      ↓
Vercel 자동 빌드 시작
      ↓
환경변수 적용
      ↓
Next.js 빌드 실행
      ↓
배포 완료 + URL 생성
```

## 🌐 배포 후 확인사항

- 운영도메인: https://ai-dashboard-beta-mocha.vercel.app/

### 1. 기본 기능 테스트

- [x] 홈페이지 로딩 확인
- [x] 사용자 회원가입/로그인 테스트
- [x] AI 챗봇 기능 테스트
- [x] AI 텍스트 생성 기능 테스트
- [x] 파일 업로드 기능 테스트
- [x] 할 일 관리 기능 테스트
- [x] CSV 분석 기능 테스트

### 2. 성능 확인

- [x] 페이지 로딩 속도 확인
- [x] 모바일 반응형 디자인 확인
- [x] API 응답 시간 확인

### 3. 보안 확인

- [x] HTTPS 연결 확인
- [x] 환경변수 노출 여부 확인
- [x] 인증 플로우 정상 동작 확인

## 🔧 커스텀 도메인 설정 (선택사항)

### 무료 도메인 옵션

- Vercel 기본 도메인: `your-project.vercel.app`
- GitHub Pages 스타일: `your-username.github.io`

### 유료 도메인 연결

1. 도메인 구매 (Namecheap, GoDaddy 등)
2. Vercel 대시보드 → **Domains** 탭
3. **Add Domain** 클릭
4. DNS 설정 업데이트

## 🐛 일반적인 배포 문제 해결

### 1. 빌드 오류

```bash
# 문제: Type errors during build
해결: yarn type-check 로컬에서 실행 후 오류 수정

# 문제: Missing dependencies
해결: package.json 의존성 확인 및 yarn install 재실행
```

### 2. 환경변수 오류

```bash
# 문제: API calls failing in production
해결: Vercel 환경변수 설정 재확인

# 문제: Supabase connection errors
해결: NEXT_PUBLIC_* 프리픽스 확인
```

### 3. 배포 실패

```bash
# 문제: GitHub Actions failing
해결: GitHub Secrets 설정 확인

# 문제: Vercel deployment timeout
해결: 빌드 시간 최적화 또는 Vercel 플랜 업그레이드
```

## 📊 모니터링 및 분석

### Vercel Analytics (무료)

1. Vercel 대시보드 → **Analytics** 탭
2. 페이지 뷰, 성능 지표 확인
3. Core Web Vitals 모니터링

### 추가 모니터링 도구

- **Vercel Speed Insights**: 실제 사용자 성능 데이터
- **Supabase Dashboard**: 데이터베이스 사용량 모니터링
- **Google Analytics**: 사용자 행동 분석 (선택사항)

## 🚀 지속적인 개발

### 개발 워크플로우

```bash
1. 로컬에서 기능 개발
2. git commit (pre-commit hook으로 자동 검증)
3. git push origin main
4. GitHub Actions 자동 테스트
5. Vercel 자동 배포
6. 프로덕션 확인
```

### 브랜치 전략 (확장 시)

```bash
main → 프로덕션 배포
develop → 개발 브랜치
feature/* → 기능 개발 브랜치
```

## 📚 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [GitHub Actions 가이드](https://docs.github.com/en/actions)
- [Supabase 프로덕션 가이드](https://supabase.com/docs/guides/platform/going-to-prod)
