# 🧠 IQZone - 클라우드 동기화 IQ 테스트

과학적 문제 설계를 기반으로 한 **클라우드 동기화** 종합 인지능력 평가 웹 애플리케이션입니다.

## 🌟 주요 기능

*   **🔥 클라우드 동기화**: Firebase를 통한 실시간 크로스 디바이스 랭킹 공유
*   **🧠 25문항 종합 테스트**: 패턴 인식, 수열 추론, 공간 지각, 논리 추론, 언어 유추
*   **📊 실시간 랭킹**: 전체 랭킹 + 주간 랭킹 (매주 월요일 초기화)
*   **🎯 나이별 보정**: 과학적 나이 보정 알고리즘 적용
*   **📱 반응형 디자인**: 모바일과 데스크톱 완벽 지원
*   **🔒 보안 강화**: 도메인 기반 접근 제어 및 Firebase 보안 규칙

## 🚀 실행 방법

### 온라인 (권장)
- **라이브 사이트**: [https://cattowel39200.github.io/iqtest/](https://cattowel39200.github.io/iqtest/)
- **단축 URL**: [https://zrr.kr/uEjxpV](https://zrr.kr/uEjxpV)

### 로컬 실행
1. `index.html` 파일을 브라우저에서 열기
2. 닉네임과 나이 입력 후 테스트 시작
3. 결과 확인 및 랭킹 등록

## 🛠️ 기술 스택

*   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Backend**: Firebase Firestore (NoSQL Database)
*   **인증**: 도메인 기반 접근 제어
*   **배포**: GitHub Pages
*   **보안**: Firebase Security Rules

## 🔒 보안

본 프로젝트는 다음 보안 조치를 적용합니다:
- 승인된 도메인에서만 Firebase 접근 허용
- Firestore 보안 규칙을 통한 데이터 접근 제어
- API 키 HTTP 리퍼러 제한
- 자세한 내용: `FIREBASE_SECURITY.md` 참조

## 📝 라이선스

MIT License
