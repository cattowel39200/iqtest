# IQ 테스트 웹서비스 설계 가이드

## 1. 측정 영역 및 이론적 배경

### 1.1 Cattell-Horn-Carroll (CHC) 이론 기반 설계

현대 IQ 테스트는 CHC 이론을 기반으로 합니다. 본 테스트는 다음 5가지 핵심 인지 영역을 측정합니다:

| 영역 | CHC 요인 | 측정 내용 |
|------|----------|-----------|
| 패턴 인식 | Gf (유동 지능) | 새로운 상황에서 규칙 발견 능력 |
| 수열 추론 | Gq (양적 지식) | 수학적 패턴 인식 및 추론 |
| 공간 추론 | Gv (시공간 처리) | 도형 조작 및 공간 지각 |
| 논리 추론 | Gf (유동 지능) | 연역적/귀납적 사고력 |
| 언어 유추 | Gc (결정 지능) | 개념 간 관계 파악 능력 |

---

## 2. 문제 설계 원칙

### 2.1 난이도 분포

신뢰성 있는 측정을 위해 각 카테고리별 난이도를 3단계로 구분합니다:

```
난이도 1 (쉬움): 약 70% 정답률 목표 - 기초 능력 확인
난이도 2 (보통): 약 50% 정답률 목표 - 평균 변별
난이도 3 (어려움): 약 30% 정답률 목표 - 상위 능력 변별
```

### 2.2 문제 유형별 설계 지침

#### 패턴 인식 (Matrix Reasoning)
- 3x3 또는 2x3 행렬 사용
- 규칙: 증가, 감소, 회전, 반전, 중첩
- 단일 규칙 → 복합 규칙으로 난이도 증가

```
쉬움: 단일 차원 변화 (크기만 증가)
보통: 두 차원 동시 변화 (크기 + 색상)
어려움: 세 차원 이상 또는 비선형 규칙
```

#### 수열 추론 (Number Series)
- 등차, 등비, 피보나치, 제곱수, 복합 수열
- 난이도별 수열 복잡도 증가

```javascript
// 난이도별 수열 예시
easy: [2, 4, 6, 8, ?]           // 단순 등차
medium: [1, 1, 2, 3, 5, 8, ?]   // 피보나치
hard: [2, 6, 12, 20, 30, ?]     // 복합 패턴 n(n+1)
```

#### 공간 추론 (Spatial Reasoning)
- 회전 (90°, 180°, 270°)
- 반사 (거울, 수평, 수직)
- 전개도 접기
- 단면 추론

#### 논리 추론 (Logical Reasoning)
- 삼단논법
- 조건문 (대우, 역, 이)
- 순서/관계 추론
- 수학적 논리

#### 언어 유추 (Verbal Analogies)
- A:B = C:? 형식
- 관계 유형: 반의어, 유의어, 기능, 장소, 부분-전체

---

## 3. 점수 산출 방법론

### 3.1 원점수 계산

```javascript
// 기본 점수 계산
function calculateRawScore(answers, questions) {
    let weightedScore = 0;
    let maxPossible = 0;
    
    questions.forEach((q, i) => {
        const difficultyWeight = q.difficulty; // 1, 2, or 3
        maxPossible += difficultyWeight;
        
        if (answers[i] === q.correct) {
            // 시간 보너스 (선택적)
            const timeBonus = Math.max(0, 1 - (responseTime[i] / maxTime)) * 0.2;
            weightedScore += difficultyWeight * (1 + timeBonus);
        }
    });
    
    return weightedScore / maxPossible; // 0~1 사이 비율
}
```

### 3.2 IQ 척도 변환 (표준화)

IQ 점수는 정규분포를 따르며, 평균 100, 표준편차 15로 설정됩니다.

```javascript
// 표준화 공식
function convertToIQ(rawPercentage) {
    // 원점수 비율을 z-score로 변환
    // 0.5(50%)가 평균, 범위 조정
    const zScore = (rawPercentage - 0.5) * 4; // -2 ~ +2 범위
    
    // IQ 척도로 변환: IQ = 100 + (z × 15)
    const iqScore = 100 + (zScore * 15);
    
    // 범위 제한 (55 ~ 145)
    return Math.max(55, Math.min(145, Math.round(iqScore)));
}
```

### 3.3 백분위 산출

```javascript
// IQ → 백분위 변환 (정규분포 기반)
function iqToPercentile(iq) {
    const z = (iq - 100) / 15;
    // 표준정규분포 누적확률
    return Math.round(normalCDF(z) * 100);
}

function normalCDF(z) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t * Math.exp(-z*z);
    
    return 0.5 * (1.0 + sign * y);
}
```

---

## 4. IQ 분류 체계

| IQ 범위 | 분류 | 백분위 | 인구 비율 |
|---------|------|--------|-----------|
| 130+ | 매우 우수 (Very Superior) | 98+ | 약 2% |
| 120-129 | 우수 (Superior) | 91-97 | 약 7% |
| 110-119 | 평균 상 (High Average) | 75-90 | 약 16% |
| 90-109 | 평균 (Average) | 25-74 | 약 50% |
| 80-89 | 평균 하 (Low Average) | 9-24 | 약 16% |
| 70-79 | 경계선 (Borderline) | 2-8 | 약 7% |
| 69 이하 | 지적 장애 범위 | 2 미만 | 약 2% |

---

## 5. 신뢰도 확보 방안

### 5.1 내적 일관성 (Cronbach's Alpha)

목표: α ≥ 0.80

```javascript
// 크론바흐 알파 계산
function cronbachAlpha(itemScores) {
    const n = itemScores[0].length; // 문항 수
    const k = itemScores.length;     // 응시자 수
    
    // 각 문항의 분산
    const itemVariances = [];
    for (let i = 0; i < n; i++) {
        const itemData = itemScores.map(s => s[i]);
        itemVariances.push(variance(itemData));
    }
    
    // 총점의 분산
    const totalScores = itemScores.map(s => s.reduce((a, b) => a + b, 0));
    const totalVariance = variance(totalScores);
    
    // 알파 계산
    const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
    return (n / (n - 1)) * (1 - sumItemVar / totalVariance);
}
```

### 5.2 검사-재검사 신뢰도

- 최소 2주 간격 재검사
- 목표 상관계수: r ≥ 0.85

### 5.3 문항 분석

```javascript
// 문항 난이도 지수
function itemDifficulty(correctCount, totalCount) {
    return correctCount / totalCount;
    // 이상적 범위: 0.3 ~ 0.7
}

// 문항 변별도
function itemDiscrimination(upperGroupCorrect, lowerGroupCorrect, groupSize) {
    return (upperGroupCorrect - lowerGroupCorrect) / groupSize;
    // 이상적 값: ≥ 0.30
}
```

---

## 6. 표준화 절차 (실제 서비스 운영 시)

### 6.1 표본 수집
- 최소 표본: 1,000명 이상
- 연령, 성별, 교육 수준 균형 분포
- 한국 인구 통계 대표성 확보

### 6.2 규준 개발
```javascript
// 연령대별 규준 테이블 구조
const norms = {
    '18-24': { mean: 102.3, sd: 14.8 },
    '25-34': { mean: 101.5, sd: 15.1 },
    '35-44': { mean: 100.2, sd: 15.0 },
    '45-54': { mean: 99.1, sd: 14.9 },
    '55-64': { mean: 97.8, sd: 15.2 }
};

// 연령 보정 적용
function ageAdjustedIQ(rawIQ, age, norms) {
    const ageGroup = getAgeGroup(age);
    const normData = norms[ageGroup];
    const zScore = (rawIQ - normData.mean) / normData.sd;
    return 100 + (zScore * 15);
}
```

---

## 7. 법적/윤리적 고려사항

### 7.1 필수 안내문
- "본 테스트는 참고용이며, 공식적인 IQ 측정을 대체하지 않습니다."
- "정확한 평가를 위해서는 공인된 기관에서 전문가 검사를 받으세요."

### 7.2 개인정보 처리
- 결과 데이터 익명화
- 제3자 제공 금지
- 삭제 요청권 보장

### 7.3 결과 해석 주의사항
- 단일 테스트로 지능을 완전히 측정할 수 없음
- 환경, 컨디션, 동기에 따라 결과 변동 가능
- 극단적 결과에 대한 전문가 상담 권고

---

## 8. 확장 기능 제안

### 8.1 적응형 테스트 (CAT)
문항반응이론(IRT) 기반으로 응시자 능력에 맞춰 난이도 자동 조절

### 8.2 영역별 상세 리포트
각 인지 영역의 강약점 분석 및 개선 방안 제시

### 8.3 추적 관리
정기적 재검사를 통한 인지 능력 변화 추적

---

## 9. 기술 구현 체크리스트

- [ ] 문항 풀 확장 (카테고리별 최소 30문항)
- [ ] 문항 무작위화 알고리즘
- [ ] 타이머 및 응답 시간 기록
- [ ] 결과 저장 및 이력 관리
- [ ] 부정행위 방지 (탭 전환 감지 등)
- [ ] 반응형 디자인 (모바일 지원)
- [ ] 접근성 (스크린 리더 지원)
- [ ] 다국어 지원
