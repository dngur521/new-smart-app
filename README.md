# Smart Home Dashboard — 프론트엔드

라즈베리파이 기반 스마트홈 시스템의 React 웹 대시보드.  
에어컨 IR 제어, 실시간 온습도·미세먼지 확인, CCTV 스트리밍, AI 챗봇, 시스템 모니터링을 제공한다.

백엔드: [smart-home-web-server](https://github.com/dngur521/smart-home-web-server) (Flask, 라즈베리파이 5)

---

## 기술 스택

- **React 18** + **Vite**
- **MUI (Material UI)** — UI 컴포넌트
- **@mui/x-charts** — LineChart (온습도·미세먼지 추이)
- **@mui/x-date-pickers** — DateTimePicker (기록 날짜 탐색, 예약 시각 입력)
- **TanStack Query** — 서버 상태 관리 및 캐싱
- **Axios** — HTTP 클라이언트 (HttpOnly 쿠키 인증)
- **React Router v6** — 클라이언트 사이드 라우팅
- **dayjs** — 날짜 포맷
- **OpenWeatherMap API** — 외부 날씨 데이터

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

| 변수                    | 설명                                   | 기본값                  |
| ----------------------- | -------------------------------------- | ----------------------- |
| `VITE_API_TARGET`       | 백엔드 서버 주소 (개발 시 프록시 대상) | `http://localhost:5000` |
| `VITE_CCTV_STREAM_URL`  | Nginx로 프록시된 MJPEG 스트림 경로     | `/cctv-stream/`         |
| `VITE_WEATHER_API_KEY`  | OpenWeatherMap API 키 (홈 날씨 카드)   | —                       |
| `VITE_WEATHER_CITY`     | 날씨 조회 도시명                       | `Seoul`                 |

> `.env`는 `.gitignore`에 포함되어 있으므로 커밋되지 않는다.

---

## 페이지 구성

| 경로                | 페이지                 | 인증 필요 |
| ------------------- | ---------------------- | --------- |
| `/`                 | 홈 대시보드            | ✗ (일부)  |
| `/auth/login`       | 로그인                 | ✗         |
| `/auth/register`    | 회원가입               | ✗         |
| `/aircon/control`   | 에어컨 제어            | ✓         |
| `/aircon/schedule`  | 에어컨 예약            | ✓         |
| `/aircon/history`   | 에어컨 제어 기록       | ✓         |
| `/temp/check`       | 실시간 온습도·미세먼지 | ✓         |
| `/temp/history`     | 온습도·미세먼지 기록   | ✓         |
| `/cctv`             | CCTV 스트리밍          | ✓         |
| `/system`           | 시스템 모니터링        | ✓         |
| `/console`          | 시스템 콘솔 (ttyd)     | ✓         |
| `/user/profile`     | 프로필 / 비밀번호 변경 | ✓         |

### 홈 대시보드 (`/`)

비로그인 시에도 날씨·시계를 확인할 수 있으며, 로그인 후 아래 항목이 활성화된다.

- 실시간 시계 + OpenWeatherMap 외부 날씨 (기온·체감·습도·풍속)
- 실내 환경 요약 (온도·습도·PM1.0·PM2.5·PM10)
- 에어컨 마지막 상태 + 빠른 제어 버튼 (전원 ON / 파워냉방 / 전원 OFF)
- 오늘 실내 온도·습도 추이 차트 + 미세먼지 추이 차트

---

## 주요 기능

### 에어컨 제어
- 단축 명령어 (전원 ON/OFF, 파워냉방) 및 상세 제어 (모드·온도·풍량)
- 페이지 진입 시 마지막 유효 설정값을 드롭다운에 자동 반영
- 제어 기록 페이지에서 날짜/시간으로 특정 기록 위치로 바로 이동 가능

### 에어컨 예약
- 켜기(모드·온도·풍량 지정) / 끄기 예약, 1분 단위 시각 설정
- APScheduler 1분 간격 실행 — 켜기는 전원 ON 후 2초 뒤 온도 설정 순서로 전송
- 예약 목록 테이블 (상태: 대기중·완료·취소됨)
- pending 예약 개별 취소 / 취소됨 전체 삭제 / N일 이전 기록 일괄 삭제 (확인 다이얼로그)

### 에어컨 실시간 상태
- TENT6000 빛센서 기반 에어컨 켜짐/꺼짐 감지 (`GET /api/arduino/aircon-status`)
- 에어컨 제어 페이지, 예약 페이지, 홈 대시보드 에어컨 카드 제목 우측에 상태 배지 표시
- 초록 원 "에어컨 켜짐" / 빨간 원 "에어컨 꺼짐"
- 0.5초 간격 5회 측정 후 `light_value ≥ threshold` 1회 이상이면 켜짐 판단, ~5초 주기 자동 폴링

### AI 챗봇
- 우하단 고정 FAB 클릭 시 채팅 패널 표시 (로그인 시에만 노출)
- 자연어로 에어컨 제어·온도 조회 등 가능 (백엔드: Google Gemini 2.5 Flash, Python-first fast path로 LLM 미호출 최소화)
- 대화 히스토리 최근 10턴 누적해 문맥 유지, 응답 대기 중 로딩 인디케이터

### 실시간 온습도·미세먼지
- DHT22 센서 5초 폴링 (온도·습도)
- 별도 아두이노 + 미세먼지 센서 5초 폴링 (PM1.0·PM2.5·PM10)
- 수치에 따른 동적 색상 그라데이션 — 한국 환경부 PM 기준 적용

### 온습도·미세먼지 기록
- `dht-history` 조회 후 그 타임스탬프 범위로 `dust-history`를 순차 조회, 5분 버킷으로 프론트 병합
- 날짜/시간 입력으로 해당 시점 기록 페이지로 바로 이동
- 오늘 온도·습도 / 미세먼지 추이 차트 상단 표시

### CCTV
- Nginx로 프록시한 MJPEG 실시간 스트리밍
- 해상도 드롭다운으로 실시간 변경 — 지원 목록 API 조회 후 선택, mjpg_streamer 재시작 + 스트림 자동 재연결
- PTZ 서보 D-패드 제어 — 상/하/좌/우 버튼, 클릭 1회 또는 꾹 누르는 동안 200ms 간격 연속 이동

### 테마
- 라이트 / 다크 / 시스템 설정 3가지 모드 지원
- 선택값 `localStorage` 저장, 시스템 설정 시 OS 다크모드 변경에 실시간 반응

---

## 인증 방식

JWT를 **HttpOnly 쿠키**로 관리한다. 백엔드가 로그인 시 `access_token`, `refresh_token`을 쿠키로 발급하며, 브라우저가 이후 요청에 자동으로 첨부한다.

- `access_token` 만료(401) 시 Axios 인터셉터가 자동으로 토큰 갱신 시도
- `refresh_token`도 만료된 경우 로그아웃 처리 후 로그인 페이지로 이동
