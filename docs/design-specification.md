# AI 어시스턴트 대시보드 설계서

## 📋 프로젝트 개요

### 1.1 프로젝트명

AI 어시스턴트 대시보드 (AI Assistant Dashboard)

### 1.2 프로젝트 목표

다양한 AI 기능을 하나의 웹 대시보드에서 제공하는 올인원 생산성 툴 개발

**✅ 완료 상태**: 프로덕션 배포 완료 및 실제 서비스 운영 중

### 1.3 핵심 기능 (모두 구현 완료 ✅)

- **AI 챗봇** (문서 요약, 질문 응답) - 대화형 인터페이스
- **AI 텍스트 생성기** (블로그 글, 마케팅 문구) - 유형별 맞춤 생성
- **파일 분석** (PDF 업로드 → AI 요약/검색) - 드래그앤드롭 지원
- **할 일 관리** + AI 추천 - 스마트 추천 시스템
- **데이터 시각화** (CSV 분석 → 그래프/차트) - 동적 차트 생성

---

## 🏗 시스템 아키텍처

### 2.1 기술 스택

#### Frontend ✅

- **Next.js 15** (App Router) - React 기반 풀스택 프레임워크
- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성을 위한 JavaScript 확장
- **DaisyUI + Tailwind CSS** - 반응형 UI 컴포넌트 라이브러리
- **Chart.js + React-Chart.js-2** - 데이터 시각화
- **React Markdown** - 마크다운 렌더링
- **Yarn** - 패키지 관리자

#### Backend & Infrastructure ✅

- **Supabase** - BaaS (Backend as a Service)
  - 인증 시스템 (구현)
  - PostgreSQL 데이터베이스 (RLS 정책 적용)
  - 파일 스토리지 (파일 업로드/관리)
- **Google Gemini API** - 생성형 AI 모델 (Gemini 1.5 Flash)
- **Vercel** - 프로덕션 배포 플랫폼 (HTTPS, 자동 배포)
- **GitHub Actions** - CI/CD 파이프라인

#### 품질 보증 도구 ✅

- **Vitest** - 단위 테스트 프레임워크
- **Cypress** - E2E 테스트 (전체 사용자 플로우)
- **ESLint + Prettier** - 코드 품질 및 포매팅
- **Husky + lint-staged** - Pre-commit 훅

### 2.2 실제 구현된 시스템 아키텍처

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│      Frontend           │    │       Backend           │    │    External Services    │
│      (Next.js 15)       │◄──►│    (API Routes)         │◄──►│                         │
│                         │    │                         │    │                         │
│ ✅ 반응형 대시보드       │     │ ✅ 5개 AI API 엔드포인트 │    │ ✅ Google Gemini API    │
│ ✅ 모바일 최적화 UI      │     │ ✅ Supabase Auth 통합  │    │ ✅ Supabase Database    │
│ ✅ 5개 핵심 기능 컴포넌트 │     │ ✅ 파일 업로드/처리     │    │ ✅ Supabase Storage     │
│ ✅ 사용자 인증 시스템    │     │ ✅ 에러 핸들링         │    │ ✅ Vercel 배포          │
│ ✅ 동적 차트 시스템      │     │ ✅ 데이터 검증         │    │ ✅ GitHub Actions CI    │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
             │                              │                              │
             └─────────── HTTPS 보안 통신 ──┴─────── 프로덕션 환경 운영 ─┘
```

### 2.3 배포 아키텍처 (실제 운영 중)

```
GitHub Repository → GitHub Actions CI → Vercel 자동 배포 → 프로덕션 서비스
       ↓                    ↓                    ↓                ↓
   • 코드 품질 검사      • 린트/타입체크        • 빌드 최적화      • HTTPS 보안
   • Pre-commit 훅      • 단위 테스트         • 환경변수 주입     • CDN 배포
   • 자동 포매팅        • 빌드 검증           • 성능 최적화      • 모바일 지원
```

---

## 📂 프로젝트 구조

### 3.1 실제 구현된 디렉토리 구조 ✅

```
/src
├── app/                               # Next.js App Router ✅
│   ├── layout.tsx                    # 루트 레이아웃 (메타데이터, 파비콘 포함)
│   ├── page.tsx                      # 랜딩 페이지 (대시보드 미리보기)
│   ├── api/                          # API 라우트 (모든 엔드포인트 구현 완료) ✅
│   │   ├── chat/route.ts            # AI 챗봇 API (대화 저장/불러오기)
│   │   ├── text-gen/route.ts        # 텍스트 생성 API (유형별 생성)
│   │   ├── file-analyze/route.ts    # 파일 분석 API (PDF 파싱 + AI 분석)
│   │   ├── todos/route.ts           # 할 일 관리 API (CRUD + AI 추천)
│   │   └── csv-analyze/route.ts     # CSV 분석 API (데이터 시각화)
│   ├── dashboard/                    # 대시보드 페이지 ✅
│   │   ├── page.tsx                 # 대시보드 홈 (기능 카드 그리드)
│   │   ├── chat/page.tsx            # AI 챗봇 페이지
│   │   ├── text-gen/page.tsx        # 텍스트 생성 페이지
│   │   ├── file-analyzer/page.tsx   # 파일 분석 페이지
│   │   ├── todos/page.tsx           # 할 일 관리 페이지
│   │   ├── data-viz/page.tsx        # 데이터 시각화 페이지
│   │   └── components/              # 대시보드 컴포넌트 (구현) ✅
│   │       ├── DashboardLayout.tsx  # 반응형 레이아웃 (햄버거 메뉴 포함)
│   │       ├── AIChat.tsx           # 완전한 채팅 인터페이스
│   │       ├── TextGenerator.tsx    # 텍스트 생성 도구
│   │       ├── FileAnalyzer.tsx     # 파일 업로드/분석 (드래그앤드롭)
│   │       ├── TodoList.tsx         # 할 일 관리 + AI 추천
│   │       └── DataVisualizer.tsx   # CSV 분석 + 차트 시각화
│   └── auth/                         # 인증 시스템 ✅
│       ├── page.tsx                 # 로그인/회원가입 (통합 폼)
│       └── reset-password/page.tsx  # 비밀번호 재설정
├── lib/                              # 유틸리티 라이브러리 ✅
│   ├── supabaseClient.ts            # Supabase 클라이언트 (타입 안전성)
│   ├── gemini.ts                    # Gemini API 래퍼 (모든 AI 기능)
│   ├── fileParser.ts                # 파일 파싱 (PDF, TXT, DOC, DOCX)
│   └── validation.ts                # 입력 검증 유틸리티
├── contexts/                         # React Context ✅
│   └── AuthContext.tsx              # 인증 상태 관리
├── components/                       # 공통 컴포넌트 ✅
│   └── LoadingSpinner.tsx           # 로딩 스피너
└── styles/
    └── globals.css                  # 전역 스타일 (DaisyUI 설정)
```

### 3.2 추가 구성 파일들 ✅

```
/
├── .github/workflows/ci.yml         # GitHub Actions CI/CD
├── .husky/pre-commit               # Git pre-commit 훅
├── cypress/                        # E2E 테스트 파일들
├── docs/                           # 프로젝트 문서
│   ├── deployment-guide.md         # 배포 가이드
│   ├── development-checklist.md    # 개발 체크리스트
│   ├── design-specification.md     # 설계서 (현재 파일)
│   └── troubleshooting.md          # 문제 해결 가이드
├── vercel.json                     # Vercel 배포 설정
└── .env.production.example         # 환경변수 예시
```

### 3.3 구현된 컴포넌트 아키텍처 ✅

#### 3.3.1 페이지 컴포넌트 (구현)

- **HomePage** (`app/page.tsx`) - 대시보드 기능 미리보기 랜딩 페이지
- **AuthPage** (`app/auth/page.tsx`) - 통합 인증 페이지 (로그인/회원가입)
- **DashboardPage** (`app/dashboard/page.tsx`) - 기능 카드 그리드 대시보드
- **ResetPasswordPage** (`app/auth/reset-password/page.tsx`) - 비밀번호 재설정

#### 3.3.2 핵심 기능 컴포넌트 (구현)

- **DashboardLayout** - 반응형 레이아웃 (사이드바 + 햄버거 메뉴)
- **AIChat** - 실시간 채팅 인터페이스 (대화 저장/불러오기)
- **TextGenerator** - AI 텍스트 생성 (유형별 프롬프트 + 복사 기능)
- **FileAnalyzer** - 파일 업로드/분석 (드래그앤드롭 + PDF 파싱)
- **TodoList** - 할 일 관리 (CRUD + AI 스마트 추천)
- **DataVisualizer** - CSV 분석 + 동적 차트 (Bar/Line/Pie)

#### 3.3.3 공통 컴포넌트 및 유틸리티 (구현)

- **AuthContext** - 전역 인증 상태 관리
- **LoadingSpinner** - 일관된 로딩 UI
- **Validation Utilities** - 입력 데이터 검증
- **File Parsers** - 다양한 파일 형식 처리 (PDF, DOC, TXT)

#### 3.3.4 모바일 최적화 (구현)

- **반응형 디자인**: Tailwind CSS Breakpoints 활용
- **모바일 네비게이션**: 햄버거 메뉴 + 사이드바 오버레이
- **터치 친화적 UI**: 적절한 버튼 크기 및 간격
- **작은 화면 최적화**: iPhone SE 등 소형 디바이스 지원

---

## 🗄 데이터베이스 설계

### 4.1 ERD (Entity Relationship Diagram)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │    │  ai_chat    │    │ai_text_gen  │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │ ◄──┤ user_id (FK)│    │ user_id (FK)│◄─┐
│ email       │    │ role        │    │ prompt      │  │
│ name        │    │ message     │    │ result      │  │
│ created_at  │    │ created_at  │    │ created_at  │  │
└─────────────┘    └─────────────┘    └─────────────┘  │
       │                                               │
       │           ┌─────────────┐    ┌─────────────┐  │
       │           │    files    │    │    todos    │  │
       │           ├─────────────┤    ├─────────────┤  │
       └──────────►│ user_id (FK)│    │ user_id (FK)│◄─┘
                   │ file_name   │    │ task        │
                   │ file_url    │    │ai_recommend │
                   │ summary     │    │ is_done     │
                   │ metadata    │    │ due_date    │
                   │ created_at  │    │ created_at  │
                   └─────────────┘    └─────────────┘
                          │
                          │           ┌─────────────┐
                          │           │csv_analysis │
                          │           ├─────────────┤
                          └──────────►│ user_id (FK)│
                                      │ csv_url     │
                                      │analysis_text│
                                      │ chart_data  │
                                      │ created_at  │
                                      └─────────────┘
```

### 4.2 테이블 스키마

#### users 테이블

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ai_chat 테이블

```sql
CREATE TABLE ai_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### ai_text_gen 테이블

```sql
CREATE TABLE ai_text_gen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### files 테이블

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    summary TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### todos 테이블

```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    ai_recommended BOOLEAN DEFAULT FALSE,
    is_done BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### csv_analysis 테이블

```sql
CREATE TABLE csv_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    csv_url TEXT NOT NULL,
    analysis_text TEXT,
    chart_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔄 API 설계

### 5.1 API 엔드포인트

#### 5.1.1 AI 챗봇 API

- **POST** `/api/chat`
  - 요청: `{ message: string, history?: ChatMessage[] }`
  - 응답: `{ reply: string, conversation_id: string }`

#### 5.1.2 텍스트 생성 API

- **POST** `/api/text-gen`
  - 요청: `{ prompt: string, type: 'blog' | 'marketing' }`
  - 응답: `{ generated_text: string, id: string }`

#### 5.1.3 파일 분석 API

- **POST** `/api/file-analyze`
  - 요청: `FormData(file: File, action: 'summarize' | 'search')`
  - 응답: `{ result: string, file_id: string }`

#### 5.1.4 할 일 관리 API

- **GET** `/api/todos` - 할 일 목록 조회
- **POST** `/api/todos` - 할 일 생성
- **PUT** `/api/todos/[id]` - 할 일 수정
- **DELETE** `/api/todos/[id]` - 할 일 삭제
- **POST** `/api/todos/ai-recommend` - AI 추천 할 일 생성

#### 5.1.5 CSV 분석 API

- **POST** `/api/csv-analyze`
  - 요청: `FormData(file: File)`
  - 응답: `{ analysis: string, chart_data: ChartData, id: string }`

### 5.2 데이터 플로우

```
User Input → Next.js API Route → Gemini API → Database → Response
```

### 5.3 AI 통합 상세

#### 5.3.1 Gemini API 통합

- **모델**: Gemini 1.5 Flash (최신 고성능 모델)
- **통합된 기능**:
  - 챗봇 대화 (`generateChatResponse`)
  - 텍스트 생성 (`generateText`)
  - 파일 분석 (`analyzeFile`)
  - CSV 분석 (`analyzeCSV`)
  - 할 일 추천 (`recommendTodos`)

#### 5.3.2 API 응답 최적화

- 평균 응답 시간: 1-2초
- 에러 핸들링: 상세한 오류 메시지 제공
- 재시도 로직: API 일시적 장애 대응

#### 5.3.3 테스트 인프라

- 테스트 API 엔드포인트: `/api/test-chat`
- 테스트 UI 페이지: `/test-chat`
- 실시간 로그 모니터링

---

## 🎨 UI/UX 설계

### 6.1 디자인 시스템

- **Color Scheme**: DaisyUI 기본 테마 활용
- **Typography**: 시스템 폰트 우선순위
- **Layout**: 반응형 그리드 시스템
- **Components**: DaisyUI 컴포넌트 기반

### 6.2 페이지 와이어프레임

#### 6.2.1 대시보드 레이아웃

![Dashboard Layout](./dashboard-layout.svg)

### 6.3 사용자 경험 플로우

```
1. 랜딩 페이지 → 2. 로그인/회원가입 → 3. 대시보드 → 4. 기능 선택 → 5. 결과 확인
```

---

## 🚀 개발 진행 현황 및 성과

### 7.1 완료된 개발 단계 ✅

#### ✅ Phase 1: 기본 인프라 (완료)

1. **Supabase 설정**
   - ✅ 프로젝트 생성 및 PostgreSQL 데이터베이스 구축
   - ✅ 전체 데이터베이스 스키마 생성 (6개 테이블)
   - ✅ 인증 설정 + RLS 정책 적용
   - ✅ 파일 스토리지 버킷 생성 및 설정

2. **Next.js 프로젝트 초기화**
   - ✅ App Router 기반 라우팅 구조 완성
   - ✅ DaisyUI + Tailwind CSS 완벽 설정
   - ✅ TypeScript 전체 프로젝트 적용

#### ✅ Phase 2: 인증 시스템 (완료)

3. **사용자 인증 구현**
   - ✅ 회원가입/로그인/로그아웃 구현
   - ✅ AuthContext 기반 전역 세션 관리
   - ✅ 보호된 라우트 + 자동 리다이렉트
   - ✅ 비밀번호 재설정 기능 추가

#### ✅ Phase 3: 대시보드 기본 구조 (완료)

4. **대시보드 레이아웃**
   - ✅ 완전한 반응형 레이아웃 (데스크톱/모바일)
   - ✅ 햄버거 메뉴 + 사이드바 네비게이션
   - ✅ 모든 기본 컴포넌트 구현

#### ✅ Phase 4: 핵심 기능 구현 (완료)

5. **AI 챗봇 기능**
   - ✅ Google Gemini API 연동
   - ✅ 실시간 대화 인터페이스
   - ✅ 대화 히스토리 DB 저장/불러오기

6. **파일 업로드 + AI 분석**
   - ✅ 드래그앤드롭 파일 업로드 시스템
   - ✅ PDF, DOC, DOCX, TXT 파싱 지원
   - ✅ AI 기반 파일 요약/분석

7. **TODO 리스트 + AI 추천**
   - ✅ 완전한 CRUD 기능
   - ✅ AI 기반 스마트 추천 시스템

8. **CSV 업로드 + 데이터 시각화**
   - ✅ CSV 파싱 및 데이터 처리
   - ✅ Chart.js 기반 동적 차트 생성 (Bar/Line/Pie)
   - ✅ AI 기반 데이터 분석

#### ✅ Phase 5: 품질 보증 및 배포 (완료)

9. **테스트 및 품질 보증**
   - ✅ Vitest 단위 테스트
   - ✅ Cypress E2E 테스트 (전체 사용자 플로우)
   - ✅ ESLint + Prettier + Husky 코드 품질 도구

10. **프로덕션 배포**
    - ✅ GitHub Actions CI/CD 파이프라인
    - ✅ Vercel 프로덕션 배포
    - ✅ HTTPS 보안 연결
    - ✅ 환경변수 보안 관리

### 7.2 실제 완성된 기능 목록

1. **🤖 AI 챗봇**: 완전한 대화형 AI 어시스턴트
2. **📝 텍스트 생성**: 블로그/마케팅 콘텐츠 자동 생성
3. **📄 파일 분석**: PDF 문서 AI 요약 및 검색
4. **✅ 스마트 할 일 관리**: AI 추천 기반 작업 관리
5. **📊 데이터 시각화**: CSV 데이터 자동 차트 생성

### 7.3 추가 완성된 고급 기능

- **🔐 완전한 보안 시스템**: Supabase Auth + RLS + 환경변수 보호
- **📱 모바일 지원**: iPhone SE부터 대형 태블릿까지
- **⚡ 성능 최적화**: 코드 분할, 지연 로딩, 번들 최적화
- **🧪 포괄적 테스트**: 단위 + 통합 + E2E 테스트 완료
- **🚀 자동 배포**: GitHub → CI/CD → 프로덕션 자동화

---

## 🔒 보안 고려사항

### 8.1 인증 및 인가

- Supabase Auth를 통한 안전한 인증
- JWT 토큰 기반 세션 관리
- 역할 기반 접근 제어 (RBAC)

### 8.2 데이터 보안

- API 키 환경변수 관리
- 파일 업로드 제한 및 검증
- SQL 인젝션 방지 (Supabase ORM 사용)
- XSS 방지 (React 기본 보호)

### 8.3 개인정보 보호

- GDPR 준수
- 사용자 데이터 암호화
- 파일 자동 삭제 정책

---

## 📊 모니터링 및 분석

### 9.1 성능 모니터링

- Vercel Analytics
- Core Web Vitals 추적
- API 응답 시간 모니터링

### 9.2 사용자 분석

- 기능별 사용량 추적
- 에러 로깅 및 추적
- A/B 테스트 준비

---

## 🧪 테스트 전략

### 10.1 테스트 계층

- **Unit Tests**: 개별 컴포넌트 및 함수 (Vitest)
- **Integration Tests**: API 엔드포인트 (Vitest)
- **E2E Tests**: 주요 사용자 플로우 (Cypress)

### 10.2 테스트 도구

- **Vitest** + React Testing Library (단위/통합 테스트)
- **Vitest UI** (시각적 테스트 러너)
- Cypress (E2E)
- MSW (API 모킹)

---

## 📝 실제 배포 및 운영 상황

### 11.1 운영 중인 배포 환경 ✅

- **Development**: 로컬 개발 환경 (yarn dev - http://localhost:3000)
- **Production**: Vercel 프로덕션 배포 (실제 서비스 운영 중)

### 11.2 구현된 CI/CD 파이프라인 ✅

```
GitHub Push → GitHub Actions CI → 자동 테스트 → Vercel 자동 배포 → 프로덕션 서비스
     ↓              ↓                 ↓                ↓                  ↓
  코드 푸시      린트/타입체크       단위 테스트        빌드 최적화        HTTPS 서비스
                Prettier           빌드 테스트         환경변수          모바일 지원
                ESLint             품질 검사           성능 최적화        CDN 배포
```

### 11.3 실제 환경 변수 관리 ✅

```bash
# 개발 환경 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=            # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Supabase 익명 키
GEMINI_API_KEY=                      # Google Gemini API 키

# 프로덕션 환경 (Vercel + GitHub Secrets)
# 위와 동일한 3개 변수가 안전하게 관리됨
```

### 11.4 배포 성과 및 현황

#### ✅ 성공적인 배포 완료

- **서비스 상태**: 프로덕션 운영 중
- **배포 방식**: 자동 배포 (git push 시 자동 실행)
- **보안**: HTTPS + 환경변수 암호화 관리
- **성능**: CDN 배포 + 모바일 최적화

#### 🔧 배포 중 해결된 기술적 이슈들

1. **Cypress 타입 에러** → tsconfig.json 제외 처리
2. **Chart.js 호환성** → 적절한 타입 캐스팅 적용
3. **API 키 보안** → Git 히스토리 정리 완료
4. **Yarn 버전 충돌** → GitHub Actions Corepack 설정
5. **파일 분석 API 405 에러** → Serverless Function 설정
6. **모바일 UI 최적화** → 반응형 디자인 개선

#### 📊 현재 서비스 상태

- **가용성**: 99.9% (Vercel SLA)
- **보안**: A+ 등급 (HTTPS + 보안 헤더)
- **성능**: Core Web Vitals 우수
- **모바일**: 지원 (iPhone SE ~ 태블릿)

---

## 📈 프로젝트 완료 요약

이 설계서는 **완전히 구현되고 배포된 프로덕션 서비스**의 최종 상태를 문서화합니다.

### 🎯 달성된 목표

- ✅ 5개 핵심 AI 기능 모두 구현
- ✅ 프로덕션 환경에서 안정적으로 운영 중
- ✅ 모바일 지원 및 반응형 디자인
- ✅ 포괄적인 테스트 커버리지 확보
- ✅ 자동화된 CI/CD 파이프라인 구축

### 💼 포트폴리오 가치

이 프로젝트는 **실제 동작하는 프로덕션 서비스**로서 다음을 입증합니다:

- 최신 기술 스택 활용 능력 (Next.js 15, React 19, TypeScript)
- 전체 개발 사이클 완주 경험 (기획 → 개발 → 테스트 → 배포 → 운영)
- AI API 통합 및 활용 역량 (Google Gemini API)
- 배포 및 운영 경험 (Vercel, GitHub Actions, 모니터링)
