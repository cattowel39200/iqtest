# 🔒 Firebase 보안 강화 가이드

## 긴급 보안 조치 필요사항

### 1️⃣ Firebase Console 보안 규칙 업데이트

**Firebase Console → Firestore Database → 규칙**에서 다음 규칙을 적용하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 랭킹 데이터 보안 규칙
    match /rankings/{document} {
      // 읽기: 모든 사용자 허용 (공개 랭킹)
      allow read: if true;

      // 쓰기: 제한된 조건에서만 허용
      allow write: if
        // 요청 크기 제한 (DoS 방지)
        request.resource.size() < 50000 &&

        // 데이터 형식 검증
        request.resource.data.keys().hasAll(['allTime', 'weekly']) &&

        // 요청 빈도 제한 (rate limiting)
        request.time > resource.data.lastUpdated + duration.value(10, 's');
    }

    // 기본 규칙: 모든 다른 접근 차단
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2️⃣ API 키 제한 설정

**Firebase Console → 설정 → 일반 → 웹 API 키**에서:

1. **HTTP 리퍼러 제한** 추가:
   - `https://cattowel39200.github.io/*`
   - `https://*.github.io/*`
   - `http://localhost/*` (개발용)

2. **API 제한사항** 설정:
   - Firestore API만 활성화
   - 다른 불필요한 API 비활성화

### 3️⃣ 프로젝트 보안 설정

1. **Authentication** → **Settings**:
   - 승인된 도메인만 추가
   - 익명 로그인 비활성화

2. **Storage** → **Rules**:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if false; // 파일 업로드 차단
       }
     }
   }
   ```

## 🚨 보안 위험 요소

### 현재 위험 상황
- ✅ **해결됨**: 도메인 기반 접근 제어 추가
- ✅ **해결됨**: 불필요한 파일 제거
- ⚠️ **추가 필요**: Firebase 콘솔 보안 규칙 적용
- ⚠️ **권장사항**: API 키 재생성 고려

### 장기 보안 개선사항

1. **사용자 인증 도입** (선택사항):
   - Google OAuth 또는 익명 인증
   - 사용자별 데이터 분리

2. **서버사이드 검증**:
   - Firebase Functions로 데이터 검증
   - 클라이언트 조작 방지

3. **모니터링**:
   - Firebase Analytics로 비정상 접근 감지
   - 로그 모니터링 설정

## 📋 보안 체크리스트

- [ ] Firebase 보안 규칙 업데이트 완료
- [ ] API 키 HTTP 리퍼러 제한 설정
- [ ] 불필요한 Firebase 서비스 비활성화
- [ ] 승인된 도메인 목록 설정
- [ ] 정기적인 보안 검토 일정 수립

## ⚡ 즉시 적용 가이드

1. Firebase Console 접속
2. 프로젝트 선택: `iqzone-rankings`
3. Firestore Database → 규칙 → 위의 보안 규칙 복사/붙여넣기
4. "게시" 버튼 클릭
5. 설정 → 일반 → API 키 제한 설정

**적용 후 테스트**: 웹사이트에서 랭킹이 정상 작동하는지 확인