# 개발 진행 규칙
- 소스를 고치기 전에 무조건 테스트부터 한다. 

# AI 어시스턴트 대시보드 요구사항

## 📌 프로젝트 개요

AI 어시스턴트 대시보드는 다양한 AI 기능을 하나의 웹 대시보드에서 제공하는 올인원 생산성 툴입니다.

사용자는 로그인 후, 다음과 같은 AI 기반 서비스를 이용할 수 있습니다.

1. **AI 챗봇**
  - 문서 요약
  - 질문 응답 (OpenAI API 기반)
2. **AI 텍스트 생성기**
  - 블로그 글 초안
  - 마케팅 문구
3. **파일 분석**
  - PDF 업로드 → AI 요약/검색
4. **할 일 관리 + AI 추천**
  - 사용자의 일정 기반 오늘 해야 할 일 자동 추천
5. **데이터 시각화**
  - CSV 업로드 → AI 분석 → 그래프/차트 생성

---

## 🛠 기술 스택

### Frontend

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **DaisyUI** (Tailwind CSS 기반 UI)
- **yarn** (패키지 매니저)

### Backend / Infra

- **Supabase** (인증, DB, 스토리지)
- **Google Gemini API** (AI 모델 - Gemini 1.5 Flash)
- **Vercel** (배포)
- **OpenWeatherMap API** (날씨 예시: 확장 가능)

---

## 📂 폴더 구조

```
/src
 ├─ app
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │   ├─ api
 │   │   ├─ chat/route.ts         # AI 챗봇
 │   │   ├─ text-gen/route.ts     # AI 텍스트 생성
 │   │   ├─ file-analyze/route.ts # 파일 분석
 │   │   ├─ todos/route.ts        # 할 일 관리 + AI 추천
 │   │   └─ csv-analyze/route.ts  # 데이터 시각화
 │   ├─ dashboard
 │   │   ├─ page.tsx
 │   │   └─ components
 │   │       ├─ AIChat.tsx
 │   │       ├─ TextGenerator.tsx
 │   │       ├─ FileAnalyzer.tsx
 │   │       ├─ TodoList.tsx
 │   │       ├─ DataVisualizer.tsx
 │   │       └─ Chart.tsx
 │   └─ auth
 │       └─ page.tsx
 ├─ lib
 │   ├─ supabaseClient.ts
 │   ├─ gemini.ts
 │   ├─ fileParser.ts
 │   └─ chartHelper.ts
 ├─ types
 │   ├─ chat.ts
 │   ├─ todo.ts
 │   └─ csv.ts
 └─ styles
     └─ globals.css

```

## 🗄 DB 스키마 (Supabase)

### users

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 사용자 고유 ID |
| email | text | 이메일 |
| name | text | 사용자 이름 |
| created_at | timestamp | 생성일 |

### ai_chat

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 대화 ID |
| user_id | uuid, FK | users.id |
| role | text | 'user' 또는 'assistant' |
| message | text | 대화 내용 |
| created_at | timestamp | 생성일 |

### ai_text_gen

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 생성 ID |
| user_id | uuid, FK | users.id |
| prompt | text | 사용자 입력 |
| result | text | AI 생성 결과 |
| created_at | timestamp | 생성일 |

### files

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 파일 ID |
| user_id | uuid, FK | users.id |
| file_name | text | 파일명 |
| file_url | text | 파일 경로 |
| summary | text | 요약 |
| metadata | jsonb | 추가 메타데이터 |
| created_at | timestamp | 생성일 |

### todos

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 할 일 ID |
| user_id | uuid, FK | users.id |
| task | text | 할 일 내용 |
| ai_recommended | boolean | AI 추천 여부 |
| is_done | boolean | 완료 여부 |
| due_date | date | 마감일 |
| created_at | timestamp | 생성일 |

### csv_analysis

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | uuid, PK | 분석 ID |
| user_id | uuid, FK | users.id |
| csv_url | text | CSV 파일 경로 |
| analysis_text | text | 분석 내용 |
| chart_data | jsonb | 차트 데이터 |
| created_at | timestamp | 생성일 |

## 🚀 개발 우선순위 (MVP)

1. **Supabase 인증** (회원가입 / 로그인 / 로그아웃)
2. **대시보드 기본 레이아웃 구현**
3. **AI 챗봇 기능**
4. **파일 업로드 + AI 분석**
5. **TODO 리스트 + AI 추천**
6. **CSV 업로드 + 데이터 시각화**
