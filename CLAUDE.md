# CLAUDE.md — Smart Home Dashboard 프로젝트 지침

## 프로젝트 개요

- **프론트**: React 18 + Vite, MUI v5, TanStack Query v5, React Router v6
- **백엔드**: Flask (라즈베리파이), HttpOnly 쿠키 인증
- **통신**: Axios (`withCredentials: true`), `/api` 프록시 경유

---

## 커밋 메시지

이모지를 앞에 붙인 한국어 한 줄 메시지로 작성.

```
✨ feat: 새 기능
🐛 fix: 버그 수정
🎨 style: UI/스타일 변경
♻️ refactor: 리팩토링
📝 docs: 문서
🔧 chore: 설정/환경
```

---

## 노션 정리 요청 시 포맷

작업 하나당 항목 하나. 문제 → 원인 → 해결 순서로 구체적으로 작성.

```
- [영역] 작업 제목
    - **문제**: 어떤 문제가 있었는지
    - **원인**: 왜 그 문제가 발생했는지
    - **해결**:
        - 해결 방법 상세 항목 1
        - 해결 방법 상세 항목 2
```

영역 태그: `[프론트]` / `[백엔드]` / `[프론트 + 백엔드]` / `[아두이노]`

---

## 코드 작성 규칙

- 컴포넌트: `src/pages/`, 공통 컴포넌트: `src/components/`
- API 훅: `src/hooks/useApi.js` — TanStack Query `useQuery` / `useMutation` 사용
- 유틸: `src/utils/` (예: `commandUtils.js`, `colorUtils.js`)
- 인증 필요한 API 훅은 반드시 `enabled: isAuthenticated` 조건 추가
- 댓글/주석은 꼭 필요한 경우만 (이유가 명확하지 않은 로직)

---

## 응답 스타일

- 한국어로 소통
- 응답은 짧고 명확하게
- 이모지 사용 안 함 (커밋 메시지 제외)
