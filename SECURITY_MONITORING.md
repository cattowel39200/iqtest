# 🤖 IQZone 자동 보안 모니터링 시스템

> **자동 생성된 보안 로그**: 2024년 12월 8일 구축
> **모니터링 대상**: 웹사이트 보안, Firebase 연결, 사용자 활동

## 🎯 시스템 개요

IQZone에는 **자동 보안 모니터링 시스템**이 내장되어 있어 실시간으로 보안 위협을 감지하고 로그를 기록합니다.

### 🔍 모니터링 항목
- **도메인 접근 제어**: 승인되지 않은 도메인에서의 접근 감지
- **Firebase 연결 상태**: 클라우드 동기화 상태 모니터링
- **의심스러운 활동**: 비정상적인 사용자 행동 패턴 감지
- **데이터 무결성**: 랭킹 데이터의 이상 현상 체크

---

## 🛠️ 보안 모니터링 접근 방법

### 방법 1: 브라우저 개발자 도구 (권장)
1. **웹사이트 접속**: https://cattowel39200.github.io/iqtest/
2. **F12** 눌러서 개발자 도구 열기
3. **Console 탭** 클릭
4. **다음 명령어 중 하나 입력**:

#### 📊 보안 통계 확인
```javascript
IQZoneSecurity.getSecurityStats()
```

#### 📋 전체 보안 로그 확인
```javascript
IQZoneSecurity.getSecurityLog()
```

#### 📈 상세 보안 리포트 생성
```javascript
IQZoneSecurity.generateReport()
```

#### 🗑️ 보안 로그 초기화
```javascript
IQZoneSecurity.clearLog()
```

### 방법 2: 로컬 스토리지 직접 확인
1. **개발자 도구 → Application 탭**
2. **Local Storage → 해당 도메인**
3. **`iqzone_security_log` 키 확인**

---

## 📊 보안 이벤트 유형

### 🟢 INFO (정보)
- **Firebase 클라우드 동기화 활성**: 정상 연결 상태
- **시스템 시작**: 보안 모니터링 시작 알림

### 🟡 WARNING (경고)
- **Firebase 연결 실패**: 네트워크 문제 또는 설정 오류
- **로컬 파일로 실행**: file:// 프로토콜 사용 감지

### 🔴 SECURITY_VIOLATION (보안 위반)
- **승인되지 않은 도메인 접근**: 화이트리스트에 없는 도메인
- **API 키 무단 사용**: 허가되지 않은 Firebase 접근

### 🟠 SUSPICIOUS_ACTIVITY (의심스러운 활동)
- **빠른 연속 제출**: 5초 이내 반복 제출 (봇 의심)
- **과도한 랭킹 데이터**: 1000개 이상의 비정상적 데이터

### 📋 REPORT (리포트)
- **정기 보안 리포트**: 매시간 자동 생성
- **수동 리포트**: 관리자가 요청한 보고서

---

## 🚨 보안 경고 대응 절차

### 즉시 조치가 필요한 경우

#### 1. SECURITY_VIOLATION 발생 시
```
🚨 보안 경고 [SECURITY_VIOLATION]: 승인되지 않은 도메인에서 접근
```
**대응 방법**:
- Firebase Console → 보안 규칙 재확인
- API 키 제한 설정 점검
- 필요 시 API 키 재생성

#### 2. 과도한 SUSPICIOUS_ACTIVITY 감지 시
```
🚨 보안 경고 [SUSPICIOUS_ACTIVITY]: 비정상적으로 빠른 연속 제출 시도
```
**대응 방법**:
- 해당 IP/사용자 패턴 조사
- 필요 시 Firebase 보안 규칙 강화
- Rate Limiting 추가 검토

### 정기 모니터링 절차

#### 매일 확인사항
```javascript
// 최근 24시간 보안 상태 확인
const stats = IQZoneSecurity.getSecurityStats();
console.log('보안 위반:', stats.securityViolations);
console.log('의심 활동:', stats.suspiciousActivity);
```

#### 주간 리포트 생성
```javascript
// 상세 보안 리포트
const report = IQZoneSecurity.generateReport();
```

---

## 📈 보안 성능 지표

### 정상 범위 (24시간 기준)
- **보안 위반**: 0건
- **의심 활동**: 5건 이하
- **Firebase 연결 실패**: 3회 이하

### 주의 필요 범위
- **보안 위반**: 1-2건
- **의심 활동**: 6-15건
- **Firebase 연결 실패**: 4-10회

### 긴급 대응 필요
- **보안 위반**: 3건 이상
- **의심 활동**: 16건 이상
- **Firebase 연결 실패**: 11회 이상

---

## 🔧 고급 모니터링 설정

### 커스텀 보안 체크 추가
```javascript
// 사용자 정의 보안 검사
function customSecurityCheck() {
    // 특정 조건 확인
    if (/* 위험 조건 */) {
        securityLog.log('CUSTOM_ALERT', '사용자 정의 보안 이벤트', {
            detail: '상세 정보'
        });
    }
}

// 5분마다 실행
setInterval(customSecurityCheck, 5 * 60 * 1000);
```

### 실시간 알림 설정
```javascript
// 심각한 이벤트 발생 시 즉시 알림
function setupRealTimeAlerts() {
    const originalLog = securityLog.log;
    securityLog.log = function(type, message, data) {
        originalLog.call(this, type, message, data);

        if (type === 'SECURITY_VIOLATION') {
            alert(`🚨 보안 경고: ${message}`);
        }
    };
}
```

---

## 📋 월간 보안 분석 템플릿

### 분석 쿼리 예시
```javascript
// 월간 보안 트렌드 분석
function monthlySecurityAnalysis() {
    const logs = IQZoneSecurity.getSecurityLog();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const monthlyEvents = logs.filter(log =>
        Date.now() - new Date(log.timestamp).getTime() < oneMonth
    );

    const analysis = {
        totalEvents: monthlyEvents.length,
        eventsByType: {},
        topDomains: {},
        securityTrends: []
    };

    monthlyEvents.forEach(event => {
        // 이벤트 유형별 통계
        analysis.eventsByType[event.type] =
            (analysis.eventsByType[event.type] || 0) + 1;

        // 도메인별 통계
        analysis.topDomains[event.domain] =
            (analysis.topDomains[event.domain] || 0) + 1;
    });

    return analysis;
}
```

---

## 🎯 보안 모니터링 모범 사례

### 1. 정기 점검 루틴
- **매일 오전**: 보안 통계 간단 확인
- **매주 금요일**: 상세 보안 리포트 검토
- **매월 첫째 주**: 월간 보안 분석 수행

### 2. 로그 관리
- **보관 기간**: 최근 100개 이벤트 (약 1-2주)
- **백업**: 중요 보안 이벤트는 별도 저장
- **정리**: 월 1회 오래된 로그 정리

### 3. 대응 체계
- **Level 1 (정보)**: 모니터링만
- **Level 2 (경고)**: 일일 점검 시 확인
- **Level 3 (위반)**: 즉시 조치 필요
- **Level 4 (긴급)**: 시스템 중단 고려

---

## 🔗 관련 문서

- **[보안 점검 체크리스트](SECURITY_CHECKLIST.md)**: 월간 수동 점검 가이드
- **[Firebase 보안 가이드](FIREBASE_SECURITY.md)**: 클라우드 보안 설정
- **[README.md](README.md)**: 프로젝트 전체 개요

---

## 📞 보안 사고 대응 연락처

- **Firebase 지원**: https://firebase.google.com/support/
- **GitHub 보안 팀**: security@github.com
- **프로젝트 관리자**: [연락처 정보]

---

## ✅ 모니터링 시스템 상태 체크

**마지막 업데이트**: 2024년 12월 8일
**시스템 버전**: 1.0
**다음 업데이트 예정**: 2025년 1월

**현재 상태**:
- ✅ 자동 로깅 활성화
- ✅ 실시간 모니터링 작동
- ✅ 정기 리포트 생성
- ✅ 개발자 도구 접근 가능