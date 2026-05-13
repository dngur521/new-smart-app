# Smart Home Dashboard — 프론트엔드

라즈베리파이 기반 스마트홈 시스템의 React 웹 대시보드.  
에어컨 IR 제어, 실시간 온습도 확인, CCTV 스트리밍, 시스템 모니터링을 제공한다.

백엔드: [smart-home-web-server](../smart-home-web-server) (Flask, 라즈베리파이 2)

---

## 기술 스택

- **React 18** + **Vite**
- **MUI (Material UI)** — UI 컴포넌트
- **TanStack Query** — 서버 상태 관리 및 캐싱
- **Axios** — HTTP 클라이언트 (HttpOnly 쿠키 인증)
- **React Router v6** — 클라이언트 사이드 라우팅
- **dayjs** — 날짜 포맷

---

## 개발 환경 실행

```bash
npm install
npm run dev
```

백엔드 서버(`localhost:5000`)가 실행 중이어야 API 요청이 정상 동작한다.  
Vite 개발 서버가 `/api` 요청을 백엔드로 프록시한다.

---

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성되며, 백엔드 Flask 서버가 이를 정적 파일로 서빙한다.

---

## 환경 변수

`.env.example`을 복사해 `.env`를 생성한다.

```bash
cp .env.example .env
```

| 변수 | 설명 | 기본값 |
|---|---|---|
| `VITE_API_TARGET` | 백엔드 서버 주소 (개발 시 프록시 대상) | `http://localhost:5000` |
| `VITE_CCTV_STREAM_URL` | Nginx로 프록시된 MJPEG 스트림 경로 | `/cctv-stream/` |

> `.env`는 `.gitignore`에 포함되어 있으므로 커밋되지 않는다.

---

## 페이지 구성

| 경로 | 페이지 | 인증 필요 |
|---|---|---|
| `/` | 홈 | ✗ |
| `/auth/login` | 로그인 | ✗ |
| `/auth/register` | 회원가입 | ✗ |
| `/aircon/control` | 에어컨 제어 | ✓ |
| `/aircon/history` | 에어컨 제어 기록 | ✓ |
| `/temp/check` | 실시간 온습도 | ✓ |
| `/temp/history` | 온습도 기록 | ✓ |
| `/cctv` | CCTV 스트리밍 | ✓ |
| `/system` | 시스템 모니터링 | ✓ |
| `/console` | 시스템 콘솔 (ttyd) | ✓ |
| `/user/profile` | 프로필 / 비밀번호 변경 | ✓ |

---

## 인증 방식

JWT를 **HttpOnly 쿠키**로 관리한다. 백엔드가 로그인 시 `access_token`, `refresh_token`을 쿠키로 발급하며, 브라우저가 이후 요청에 자동으로 첨부한다.

- `access_token` 만료(401) 시 Axios 인터셉터가 자동으로 토큰 갱신 시도
- `refresh_token`도 만료된 경우 로그아웃 처리 후 로그인 페이지로 이동
