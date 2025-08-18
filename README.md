# AI 어시스턴트 대시보드

## 📌 프로젝트 개요

AI 어시스턴트 대시보드는 다양한 AI 기능을 하나의 웹 대시보드에서 제공하는 올인원 생산성 툴입니다.

### 주요 기능

1. **AI 챗봇** - 문서 요약, 질문 응답 (Google Gemini API 기반)
2. **AI 텍스트 생성기** - 블로그 글 초안, 마케팅 문구 생성
3. **파일 분석** - PDF, DOC, TXT 업로드 → AI 요약/검색
4. **할 일 관리 + AI 추천** - 사용자의 일정 기반 스마트 추천
5. **데이터 시각화** - CSV 업로드 → AI 분석 → 그래프/차트 생성

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI/UX**: DaisyUI, Tailwind CSS
- **Backend**: Supabase (인증, DB, 스토리지)
- **AI**: Google Gemini API (Gemini 1.5 Flash)
- **Deployment**: Vercel
- **Package Manager**: Yarn

## 🚀 빠른 시작

### 1. 필수 요구사항

- Node.js 18.x 이상
- Yarn (최신 버전)
- Git

### 2. 프로젝트 클론 및 설치

```bash
git clone https://github.com/your-username/ai-dashboard.git
cd ai-dashboard
yarn install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 4. 데이터베이스 설정

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. `sql/supabase_setup.sql` 파일을 실행하여 테이블 생성
3. `sql/supabase-rls-policies.sql` 파일을 실행하여 보안 정책 설정

### 5. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인하세요.

## 📋 사용 가능한 스크립트

```bash
# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# 린트 검사
yarn lint

# 타입 체크
yarn type-check

# 단위 테스트 실행
yarn test

# 테스트 감시 모드
yarn test:watch

# E2E 테스트 실행
yarn cypress:run

# Cypress 테스트 UI 열기
yarn cypress:open

# 코드 포매팅
yarn format
```

## 🔐 보안 설정

### API 키 보안

- **중요**: API 키를 절대 코드에 하드코딩하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
- 프로덕션 환경에서는 Vercel의 환경 변수 설정을 사용하세요

### 파일 업로드 보안

- 파일 크기 제한: 10MB
- 허용 파일 형식: PDF, TXT, DOC, DOCX, CSV
- 파일 검증 로직 포함

## 🧪 테스트

### 단위 테스트

```bash
yarn test
```

### E2E 테스트

```bash
# Headless 모드로 실행
yarn cypress:run

# Interactive 모드로 실행
yarn cypress:open
```

### 테스트 환경 설정

E2E 테스트를 위해 `cypress.env.json` 파일을 생성하고 테스트용 환경 변수를 설정하세요:

```json
{
  "NEXT_PUBLIC_SUPABASE_URL": "your_test_supabase_url",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your_test_supabase_anon_key",
  "GEMINI_API_KEY": "your_test_gemini_api_key"
}
```

## 🚀 배포

### 빠른 배포 가이드

**포트폴리오 프로젝트에 최적화된 배포 프로세스:**

1. **GitHub Secrets 설정** (CI 테스트용)

   ```bash
   # GitHub 저장소 → Settings → Secrets → Actions
   NEXT_PUBLIC_SUPABASE_URL=your_value
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
   GEMINI_API_KEY=your_value
   ```

2. **Vercel 프로젝트 생성**
   - [Vercel](https://vercel.com)에서 GitHub 저장소 연결
   - Framework: Next.js (자동 감지)

3. **Vercel 환경변수 설정**

   ```bash
   # Vercel 대시보드 → Settings → Environment Variables
   NEXT_PUBLIC_SUPABASE_URL=your_value
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
   GEMINI_API_KEY=your_value
   ```

4. **자동 배포**
   ```bash
   git push origin main  # 자동으로 CI 테스트 → Vercel 배포
   ```

### CI/CD 파이프라인

**GitHub Actions 자동 실행:**

- ✅ ESLint 코드 검사
- ✅ TypeScript 타입 체크
- ✅ 단위 테스트 실행
- ✅ 빌드 테스트
- ✅ Cypress E2E 테스트

**Vercel 자동 배포:**

- ✅ GitHub 푸시 감지
- ✅ 프로덕션 빌드
- ✅ 도메인 배포

### 📖 상세 배포 가이드

자세한 배포 과정은 [배포 가이드 문서](docs/deployment-guide.md)를 참조하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── chat/          # AI 챗봇 API
│   │   ├── text-gen/      # 텍스트 생성 API
│   │   ├── file-analyze/  # 파일 분석 API
│   │   ├── todos/         # 할 일 관리 API
│   │   └── csv-analyze/   # CSV 분석 API
│   ├── dashboard/         # 대시보드 페이지
│   └── auth/             # 인증 페이지
├── components/           # 공통 컴포넌트
├── contexts/            # React Context
├── lib/                # 유틸리티 함수
└── types/              # TypeScript 타입 정의
```

## 🔧 개발 도구

### Yarn 최초 설치 시 (Windows)

1. choco로 nvm 설치
2. nvm으로 node 최신버전 설치

```bash
# Windows (Chocolatey)
choco install nvm
nvm install latest
nvm use latest
```

3. corepack 활성화

```
corepack enable
```

4. yarn은 글로벌이 없으므로 해당 프로젝트에서 시작하면 된다.

### yarn 세팅

1. `package.json`에 `"packageManager": "yarn@x.x.x"` 추가
2. `yarn.lock` 생성 및 `package.json`초기화

```
yarn init
```

3. 최초 생성된 버전에 + yarn 버전이 들어간 `package.json`로 원복

4. `yarnrc.yml` 추가
5. 개별 프로젝트에서 Yarn 사용

```bash
yarn install
```

### Claude Code CLI 설정(window)

1. `git` 설치
2. `git(bin 경로)` 환경변수 `path`추가
3. 클로드코드 CLI 설치

```
yarn add @anthropic-ai/claude-code
```

## 📚 추가 문서

- [개발 체크리스트](docs/development-checklist.md)
- [설계 명세서](docs/design-specification.md)
- [배포 가이드](docs/deployment-guide.md) ⭐ **신규 추가**
- [테스트 가이드](docs/testing-authentication-best-practices.md)
- [문제 해결 가이드](docs/troubleshooting.md)

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🐛 문제 신고

버그나 기능 요청이 있으시면 [Issues](https://github.com/your-username/ai-dashboard/issues)에 신고해 주세요.

## 🔗 관련 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Google Gemini API 문서](https://ai.google.dev/docs)
- [DaisyUI 문서](https://daisyui.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 프로젝트 생성 (Project Creation)

```
yarn create next-app@latest my-newsletter-feed --typescript --tailwind --eslint
```

#### 1. yarn 세팅

1. `package.json`에 `"packageManager": "yarn@x.x.x"` 추가

2. `yarn.lock` 생성 및 `package.json`초기화

```
yarn init
```

3. 최초 생성된 버전에 + yarn 버전이 들어간 `package.json`로 원복

4. `yarnrc.yml` 추가

#### 2. 의존성 설치 (Installation) [AI]

이 프로젝트는 `yarn`을 패키지 매니저로 사용합니다. 프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 필요한 패키지를 설치하세요.

```bash
yarn
```

#### 3. 개발 서버 실행 (Running the Development Server) [AI]

설치가 완료되면, 아래 명령어를 실행하여 개발 서버를 시작하세요.

```bash
yarn dev
```

이제 브라우저에서 http://localhost:3000으로 접속하여 결과물을 확인할 수 있습니다.
