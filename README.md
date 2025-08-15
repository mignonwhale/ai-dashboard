
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

## yarn 최초 설치 시
1. choco로 nvm 설치
2. nvm으로 node 최신버전 설치
3. `corepack enable` 실행
4. yarn은 글로벌이 없으므로 해당 프로젝트에서 시작하면 된다.

## 클로드코드CLI 세팅

1. `git` 설치
2. `git(bin 경로)` 환경변수 `path`추가
3. 클로드코드 CLI 설치
```
yarn add @anthropic-ai/claude-code
```

