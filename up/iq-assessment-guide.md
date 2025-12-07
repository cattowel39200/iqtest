# 공인 IQ 평가 메커니즘 적용 설명서

## Official IQ Assessment Mechanism Implementation Guide

**버전:** 1.0  
**작성일:** 2025년 12월  
**목적:** 웹 기반 IQ 테스트 서비스에 공인기관 수준의 심리측정 방법론 적용

---

## 목차

1. [개요](#1-개요)
2. [IRT 기반 능력 추정](#2-irt-기반-능력-추정)
3. [95% 신뢰구간 산출](#3-95-신뢰구간-산출)
4. [영역별 상세 분석 리포트](#4-영역별-상세-분석-리포트)
5. [연령별 규준 적용](#5-연령별-규준-적용)
6. [통합 구현 가이드](#6-통합-구현-가이드)
7. [품질 관리](#7-품질-관리)

---

## 1. 개요

### 1.1 현재 방식의 한계

기존 방식 (고전검사이론, CTT):
- 단순 정답률 기반 점수 산출
- 문항 난이도 미반영
- 추측 확률 미고려
- 측정 오차 불명확

### 1.2 개선 목표

| 항목 | 현재 | 목표 |
|------|------|------|
| 이론적 기반 | 고전검사이론 (CTT) | 문항반응이론 (IRT) |
| 능력 추정 | 정답률 × 가중치 | 최대우도추정 (MLE) |
| 오차 표시 | 없음 | 95% 신뢰구간 |
| 분석 수준 | 총점만 | 영역별 상세 분석 |
| 규준 | 단일 | 연령별 차등 적용 |

### 1.3 핵심 용어 정의

```
θ (theta)    : 잠재 능력치 (latent ability), 평균 0, 표준편차 1
a (변별도)   : 문항이 능력을 구분하는 정도 (0.5~2.5)
b (난이도)   : 문항의 어려움 정도 (-3 ~ +3)
c (추측모수) : 우연히 맞출 확률 (4지선다: 0.25)
SEM         : 측정의 표준오차 (Standard Error of Measurement)
ICC         : 문항특성곡선 (Item Characteristic Curve)
```

---

## 2. IRT 기반 능력 추정

### 2.1 문항반응이론 (IRT) 개념

IRT는 피험자의 능력(θ)과 문항 특성(a, b, c)의 관계를 수학적으로 모델링합니다.

#### 2.1.1 3모수 로지스틱 모델 (3PL Model)

정답 확률 공식:

```
P(θ) = c + (1 - c) × [e^(a(θ-b)) / (1 + e^(a(θ-b)))]

여기서:
- P(θ): 능력 θ인 사람이 정답을 맞출 확률
- a: 변별도 (discrimination)
- b: 난이도 (difficulty)  
- c: 추측모수 (guessing parameter)
- e: 자연상수 (≈2.718)
```

#### 2.1.2 문항특성곡선 (ICC) 시각화

```
확률
1.0 ┤                                    ●●●●●●●●●●
    │                               ●●●●
0.8 ┤                           ●●●
    │                        ●●●
0.6 ┤                     ●●●
    │                  ●●●
0.4 ┤               ●●●
    │           ●●●●
0.25┤- - - - ●●●- - - - - - - - - - - - - - - - - (추측확률 c)
    │     ●●●
0.0 ┼────────────────────────────────────────────→ 능력(θ)
       -3   -2   -1    0    1    2    3
              ↑
           난이도(b)
```

### 2.2 문항 모수 설정

#### 2.2.1 난이도별 모수 기준표

| 난이도 등급 | b (난이도) | a (변별도) | c (추측) | 설명 |
|-------------|------------|------------|----------|------|
| 매우 쉬움 | -2.0 | 1.0 | 0.25 | 하위 10%도 풀 수 있음 |
| 쉬움 | -1.0 | 1.2 | 0.25 | 평균 이하도 쉽게 풀음 |
| 보통 | 0.0 | 1.5 | 0.25 | 평균 수준에서 50% 정답 |
| 어려움 | 1.0 | 1.8 | 0.25 | 평균 이상만 풀 수 있음 |
| 매우 어려움 | 2.0 | 2.0 | 0.25 | 상위 10%만 풀 수 있음 |
| 최고난도 | 2.5 | 2.2 | 0.25 | 상위 2%만 풀 수 있음 |

#### 2.2.2 영역별 문항 모수 예시

```javascript
const itemParameters = {
    pattern: [
        { id: 'p1', b: -1.0, a: 1.2, c: 0.25 },  // 쉬움
        { id: 'p2', b: -0.5, a: 1.3, c: 0.25 },  // 쉬움-보통
        { id: 'p3', b: 0.0, a: 1.5, c: 0.25 },   // 보통
        { id: 'p4', b: 0.5, a: 1.6, c: 0.25 },   // 보통-어려움
        { id: 'p5', b: 1.0, a: 1.8, c: 0.25 },   // 어려움
        { id: 'p6', b: 1.5, a: 1.9, c: 0.25 },   // 어려움
        { id: 'p7', b: 2.0, a: 2.0, c: 0.25 },   // 매우 어려움
        { id: 'p8', b: 2.0, a: 2.0, c: 0.25 },   // 매우 어려움
        { id: 'p9', b: 2.5, a: 2.2, c: 0.25 },   // 최고난도
        { id: 'p10', b: 2.5, a: 2.2, c: 0.25 }   // 최고난도
    ],
    numerical: [ /* 동일 구조 */ ],
    spatial: [ /* 동일 구조 */ ],
    logical: [ /* 동일 구조 */ ],
    verbal: [ /* 동일 구조 */ ]
};
```

### 2.3 능력 추정 알고리즘

#### 2.3.1 최대우도추정 (Maximum Likelihood Estimation)

```javascript
/**
 * 3PL 모델 정답 확률 계산
 * @param {number} theta - 능력치
 * @param {object} item - 문항 모수 {a, b, c}
 * @returns {number} - 정답 확률 (0~1)
 */
function calculateProbability(theta, item) {
    const { a, b, c = 0.25 } = item;
    const exponent = a * (theta - b);
    const expValue = Math.exp(exponent);
    return c + (1 - c) * (expValue / (1 + expValue));
}

/**
 * 우도함수의 1차 미분 (Newton-Raphson용)
 */
function likelihoodDerivative(theta, responses, items) {
    let firstDerivative = 0;
    let secondDerivative = 0;
    
    items.forEach((item, i) => {
        const p = calculateProbability(theta, item);
        const q = 1 - p;
        const pStar = (p - item.c) / (1 - item.c);  // 추측 보정
        const w = item.a * item.a * pStar * q;       // 정보량
        
        // 1차 미분
        firstDerivative += item.a * pStar * (responses[i] - p) / p;
        
        // 2차 미분 (Fisher 정보량)
        secondDerivative -= w;
    });
    
    return { first: firstDerivative, second: secondDerivative };
}

/**
 * Newton-Raphson 방법으로 능력치 추정
 * @param {array} responses - 응답 배열 (1: 정답, 0: 오답)
 * @param {array} items - 문항 모수 배열
 * @param {number} maxIter - 최대 반복 횟수
 * @param {number} tolerance - 수렴 기준
 * @returns {object} - { theta, se, converged }
 */
function estimateAbilityMLE(responses, items, maxIter = 50, tolerance = 0.001) {
    let theta = 0;  // 초기값: 평균 능력
    let converged = false;
    
    for (let iter = 0; iter < maxIter; iter++) {
        const { first, second } = likelihoodDerivative(theta, responses, items);
        
        // Newton-Raphson 업데이트
        const delta = first / Math.abs(second);
        theta += delta;
        
        // 범위 제한 (-4 ~ +4)
        theta = Math.max(-4, Math.min(4, theta));
        
        // 수렴 확인
        if (Math.abs(delta) < tolerance) {
            converged = true;
            break;
        }
    }
    
    // 표준오차 계산 (Fisher 정보량의 역수의 제곱근)
    const information = calculateFisherInformation(theta, items);
    const se = 1 / Math.sqrt(information);
    
    return { theta, se, converged };
}

/**
 * Fisher 정보량 계산
 */
function calculateFisherInformation(theta, items) {
    let information = 0;
    
    items.forEach(item => {
        const p = calculateProbability(theta, item);
        const q = 1 - p;
        const pStar = (p - item.c) / (1 - item.c);
        
        // 문항 정보량
        const itemInfo = item.a * item.a * pStar * pStar * q / p;
        information += itemInfo;
    });
    
    return information;
}
```

#### 2.3.2 베이지안 기대사후추정 (EAP)

MLE가 수렴하지 않는 극단적 응답 패턴에 대비:

```javascript
/**
 * EAP (Expected A Posteriori) 추정
 * 전체 정답 또는 전체 오답 시 사용
 */
function estimateAbilityEAP(responses, items, numQuadrature = 41) {
    // 적분 구간: -4 ~ +4
    const thetaPoints = [];
    const step = 8 / (numQuadrature - 1);
    
    for (let i = 0; i < numQuadrature; i++) {
        thetaPoints.push(-4 + i * step);
    }
    
    // 사전분포: 표준정규분포
    function prior(theta) {
        return Math.exp(-theta * theta / 2) / Math.sqrt(2 * Math.PI);
    }
    
    // 우도함수
    function likelihood(theta, responses, items) {
        let L = 1;
        items.forEach((item, i) => {
            const p = calculateProbability(theta, item);
            L *= responses[i] === 1 ? p : (1 - p);
        });
        return L;
    }
    
    // 분자: θ × L(θ) × π(θ)
    let numerator = 0;
    // 분모: L(θ) × π(θ)
    let denominator = 0;
    
    thetaPoints.forEach(theta => {
        const L = likelihood(theta, responses, items);
        const pi = prior(theta);
        const weight = L * pi;
        
        numerator += theta * weight;
        denominator += weight;
    });
    
    const thetaEAP = numerator / denominator;
    
    // EAP의 사후 표준편차 계산
    let variance = 0;
    thetaPoints.forEach(theta => {
        const L = likelihood(theta, responses, items);
        const pi = prior(theta);
        const weight = L * pi / denominator;
        variance += weight * Math.pow(theta - thetaEAP, 2);
    });
    
    const se = Math.sqrt(variance);
    
    return { theta: thetaEAP, se };
}
```

### 2.4 능력치 → IQ 변환

```javascript
/**
 * theta를 IQ 점수로 변환
 * theta: 평균 0, 표준편차 1
 * IQ: 평균 100, 표준편차 15
 */
function thetaToIQ(theta) {
    return Math.round(100 + theta * 15);
}

/**
 * IQ를 theta로 역변환
 */
function iqToTheta(iq) {
    return (iq - 100) / 15;
}

/**
 * 완전한 IQ 산출 파이프라인
 */
function calculateIQ(responses, items) {
    // 1. 응답 패턴 확인
    const totalCorrect = responses.reduce((sum, r) => sum + r, 0);
    const totalItems = responses.length;
    
    let result;
    
    // 2. 극단적 응답 패턴 처리
    if (totalCorrect === 0 || totalCorrect === totalItems) {
        // EAP 사용 (전체 정답/오답)
        result = estimateAbilityEAP(responses, items);
    } else {
        // MLE 사용 (일반적 패턴)
        result = estimateAbilityMLE(responses, items);
        
        // MLE 미수렴 시 EAP로 대체
        if (!result.converged) {
            result = estimateAbilityEAP(responses, items);
        }
    }
    
    // 3. IQ 변환
    const iq = thetaToIQ(result.theta);
    const seMeasurement = result.se * 15;  // IQ 척도로 변환
    
    // 4. 범위 제한 (40 ~ 160)
    const finalIQ = Math.max(40, Math.min(160, iq));
    
    return {
        theta: result.theta,
        iq: finalIQ,
        se: seMeasurement,
        rawScore: totalCorrect,
        totalItems: totalItems
    };
}
```

---

## 3. 95% 신뢰구간 산출

### 3.1 신뢰구간 개념

신뢰구간은 "진짜 IQ가 이 범위 안에 있을 확률이 95%"를 의미합니다.

```
측정된 IQ: 125
표준오차(SEM): 4
95% 신뢰구간: 125 ± (1.96 × 4) = 125 ± 8 = [117, 133]

해석: 이 사람의 진짜 IQ가 117~133 사이에 있을 확률이 95%
```

### 3.2 신뢰구간 계산

```javascript
/**
 * 신뢰구간 계산
 * @param {number} iq - 추정된 IQ
 * @param {number} se - 측정의 표준오차 (IQ 척도)
 * @param {number} confidenceLevel - 신뢰수준 (0.95 = 95%)
 * @returns {object} - { lower, upper, margin }
 */
function calculateConfidenceInterval(iq, se, confidenceLevel = 0.95) {
    // Z 값 계산 (정규분포 기준)
    const zValues = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    };
    
    const z = zValues[confidenceLevel] || 1.96;
    const margin = Math.round(z * se);
    
    return {
        lower: Math.max(40, iq - margin),
        upper: Math.min(160, iq + margin),
        margin: margin,
        confidenceLevel: confidenceLevel * 100
    };
}

/**
 * 신뢰구간 해석 텍스트 생성
 */
function interpretConfidenceInterval(iq, ci, lang = 'ko') {
    if (lang === 'ko') {
        return `측정된 IQ는 ${iq}이며, 95% 신뢰구간은 ${ci.lower}~${ci.upper}입니다. ` +
               `이는 귀하의 실제 IQ가 이 범위 내에 있을 확률이 95%임을 의미합니다.`;
    } else {
        return `Your measured IQ is ${iq} with a 95% confidence interval of ${ci.lower}-${ci.upper}. ` +
               `This means there is a 95% probability that your true IQ falls within this range.`;
    }
}
```

### 3.3 조건부 표준오차 (CSEM)

능력 수준에 따라 측정 정밀도가 다릅니다:

```javascript
/**
 * 조건부 표준오차 계산
 * 특정 능력 수준에서의 측정 정밀도
 */
function conditionalSEM(theta, items) {
    const information = calculateFisherInformation(theta, items);
    const sem = 1 / Math.sqrt(information);
    return sem * 15;  // IQ 척도로 변환
}

/**
 * 능력 수준별 SEM 테이블 생성
 */
function generateSEMTable(items) {
    const table = [];
    
    for (let iq = 70; iq <= 145; iq += 5) {
        const theta = iqToTheta(iq);
        const sem = conditionalSEM(theta, items);
        const ci = calculateConfidenceInterval(iq, sem);
        
        table.push({
            iq: iq,
            theta: theta.toFixed(2),
            sem: sem.toFixed(1),
            ci95: `${ci.lower}-${ci.upper}`
        });
    }
    
    return table;
}
```

### 3.4 신뢰구간 시각화

```javascript
/**
 * 신뢰구간 시각화 데이터 생성
 */
function visualizeConfidenceInterval(iq, ci) {
    return {
        // 메인 바
        mainBar: {
            start: ci.lower,
            end: ci.upper,
            center: iq
        },
        // 확률 분포 곡선 (정규분포 근사)
        distribution: generateNormalCurve(iq, ci.margin / 1.96, 50),
        // 기준선
        benchmarks: [
            { value: 100, label: '평균' },
            { value: 120, label: '우수' },
            { value: 130, label: '멘사' }
        ]
    };
}

function generateNormalCurve(mean, sd, points) {
    const curve = [];
    const range = sd * 4;
    const step = (range * 2) / points;
    
    for (let i = 0; i <= points; i++) {
        const x = mean - range + (i * step);
        const z = (x - mean) / sd;
        const y = Math.exp(-z * z / 2) / (sd * Math.sqrt(2 * Math.PI));
        curve.push({ x, y });
    }
    
    return curve;
}
```

---

## 4. 영역별 상세 분석 리포트

### 4.1 분석 영역 정의

```javascript
const cognitivedomains = {
    pattern: {
        code: 'VCI',
        name: { ko: '패턴 인식', en: 'Pattern Recognition' },
        description: {
            ko: '시각적 패턴과 규칙을 인식하고 예측하는 능력',
            en: 'Ability to recognize and predict visual patterns and rules'
        },
        subskills: ['행렬 추론', '시각적 유추', '규칙 발견']
    },
    numerical: {
        code: 'NRI',
        name: { ko: '수리 추론', en: 'Numerical Reasoning' },
        description: {
            ko: '수학적 관계와 수열 패턴을 파악하는 능력',
            en: 'Ability to understand mathematical relationships and sequences'
        },
        subskills: ['수열 분석', '수학적 추론', '계산 능력']
    },
    spatial: {
        code: 'SPI',
        name: { ko: '공간 지각', en: 'Spatial Perception' },
        description: {
            ko: '공간에서 물체의 관계와 변환을 이해하는 능력',
            en: 'Ability to understand spatial relationships and transformations'
        },
        subskills: ['심적 회전', '공간 시각화', '도형 조작']
    },
    logical: {
        code: 'LRI',
        name: { ko: '논리 추론', en: 'Logical Reasoning' },
        description: {
            ko: '논리적 규칙과 관계를 분석하고 결론을 도출하는 능력',
            en: 'Ability to analyze logical rules and derive conclusions'
        },
        subskills: ['연역 추론', '귀납 추론', '조건 분석']
    },
    verbal: {
        code: 'VAI',
        name: { ko: '언어 유추', en: 'Verbal Analogies' },
        description: {
            ko: '언어적 개념 간의 관계를 파악하고 유추하는 능력',
            en: 'Ability to understand relationships between verbal concepts'
        },
        subskills: ['유추 추론', '개념 관계', '어휘 지식']
    }
};
```

### 4.2 영역별 점수 계산

```javascript
/**
 * 영역별 IRT 점수 계산
 */
function calculateDomainScores(responses, items, domains) {
    const domainResults = {};
    
    Object.keys(domains).forEach(domainKey => {
        // 해당 영역 문항만 필터링
        const domainItems = items.filter(item => item.domain === domainKey);
        const domainResponses = responses.filter((_, i) => items[i].domain === domainKey);
        
        if (domainItems.length === 0) return;
        
        // IRT 능력 추정
        const result = calculateIQ(domainResponses, domainItems);
        
        // 환산점수 계산 (평균 10, 표준편차 3)
        const scaledScore = Math.round(10 + (result.theta * 3));
        const clampedScaled = Math.max(1, Math.min(19, scaledScore));
        
        domainResults[domainKey] = {
            domain: domains[domainKey],
            theta: result.theta,
            iq: result.iq,
            scaledScore: clampedScaled,
            se: result.se,
            ci: calculateConfidenceInterval(result.iq, result.se),
            rawScore: result.rawScore,
            totalItems: result.totalItems,
            accuracy: Math.round((result.rawScore / result.totalItems) * 100)
        };
    });
    
    return domainResults;
}

/**
 * 영역별 강약점 분석
 */
function analyzeStrengthsWeaknesses(domainResults) {
    const scores = Object.entries(domainResults).map(([key, data]) => ({
        domain: key,
        scaledScore: data.scaledScore,
        iq: data.iq
    }));
    
    // 평균 계산
    const avgScaled = scores.reduce((sum, s) => sum + s.scaledScore, 0) / scores.length;
    
    // 강점/약점 분류 (평균 대비 ±1 표준편차)
    const strengths = [];
    const weaknesses = [];
    const average = [];
    
    scores.forEach(s => {
        const deviation = s.scaledScore - avgScaled;
        
        if (deviation >= 3) {
            strengths.push({ ...s, level: 'significant', deviation });
        } else if (deviation >= 1.5) {
            strengths.push({ ...s, level: 'moderate', deviation });
        } else if (deviation <= -3) {
            weaknesses.push({ ...s, level: 'significant', deviation });
        } else if (deviation <= -1.5) {
            weaknesses.push({ ...s, level: 'moderate', deviation });
        } else {
            average.push({ ...s, deviation });
        }
    });
    
    return {
        strengths: strengths.sort((a, b) => b.deviation - a.deviation),
        weaknesses: weaknesses.sort((a, b) => a.deviation - b.deviation),
        average: average,
        overallAverage: avgScaled
    };
}
```

### 4.3 상세 리포트 생성

```javascript
/**
 * 종합 분석 리포트 생성
 */
function generateDetailedReport(responses, items, userInfo) {
    // 1. 전체 IQ 계산
    const overallResult = calculateIQ(responses, items);
    
    // 2. 영역별 점수 계산
    const domainScores = calculateDomainScores(responses, items, cognitivedomains);
    
    // 3. 강약점 분석
    const analysis = analyzeStrengthsWeaknesses(domainScores);
    
    // 4. IQ 분류
    const classification = classifyIQ(overallResult.iq);
    
    // 5. 백분위 계산
    const percentile = iqToPercentile(overallResult.iq);
    
    // 6. 신뢰구간
    const ci = calculateConfidenceInterval(overallResult.iq, overallResult.se);
    
    return {
        // 기본 정보
        testDate: new Date().toISOString(),
        userAge: userInfo.age,
        testDuration: userInfo.duration,
        
        // 전체 결과
        overall: {
            iq: overallResult.iq,
            theta: overallResult.theta,
            se: overallResult.se,
            confidenceInterval: ci,
            classification: classification,
            percentile: percentile,
            rawScore: overallResult.rawScore,
            totalItems: overallResult.totalItems
        },
        
        // 영역별 결과
        domains: domainScores,
        
        // 강약점 분석
        analysis: analysis,
        
        // 프로파일 일관성
        profileConsistency: calculateProfileConsistency(domainScores),
        
        // 권고사항
        recommendations: generateRecommendations(analysis, classification)
    };
}

/**
 * IQ 분류
 */
function classifyIQ(iq) {
    const classifications = [
        { min: 145, label: { ko: '최우수 (Very Superior)', en: 'Very Superior' }, code: 'VS' },
        { min: 130, label: { ko: '매우 우수 (Superior)', en: 'Superior' }, code: 'S' },
        { min: 120, label: { ko: '우수 (High Average)', en: 'High Average' }, code: 'HA' },
        { min: 110, label: { ko: '평균 상 (Above Average)', en: 'Above Average' }, code: 'AA' },
        { min: 90, label: { ko: '평균 (Average)', en: 'Average' }, code: 'A' },
        { min: 80, label: { ko: '평균 하 (Low Average)', en: 'Low Average' }, code: 'LA' },
        { min: 70, label: { ko: '경계선 (Borderline)', en: 'Borderline' }, code: 'B' },
        { min: 0, label: { ko: '매우 낮음 (Very Low)', en: 'Very Low' }, code: 'VL' }
    ];
    
    for (const c of classifications) {
        if (iq >= c.min) return c;
    }
    
    return classifications[classifications.length - 1];
}

/**
 * IQ → 백분위 변환
 */
function iqToPercentile(iq) {
    // 표준정규분포 누적확률 (CDF) 근사
    const z = (iq - 100) / 15;
    
    // Abramowitz and Stegun 근사식
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    let percentile = z > 0 ? (1 - p) * 100 : p * 100;
    
    return Math.round(percentile * 10) / 10;  // 소수점 1자리
}

/**
 * 권고사항 생성
 */
function generateRecommendations(analysis, classification) {
    const recommendations = [];
    
    // 강점 활용 권고
    if (analysis.strengths.length > 0) {
        const topStrength = analysis.strengths[0];
        recommendations.push({
            type: 'strength',
            domain: topStrength.domain,
            text: {
                ko: `${cognitivedomains[topStrength.domain].name.ko} 영역에서 뛰어난 능력을 보이고 있습니다. 이 강점을 활용한 학습이나 직업 선택을 고려해보세요.`,
                en: `You show excellent ability in ${cognitivedomains[topStrength.domain].name.en}. Consider leveraging this strength in your learning or career choices.`
            }
        });
    }
    
    // 약점 보완 권고
    if (analysis.weaknesses.length > 0) {
        const topWeakness = analysis.weaknesses[0];
        recommendations.push({
            type: 'improvement',
            domain: topWeakness.domain,
            text: {
                ko: `${cognitivedomains[topWeakness.domain].name.ko} 영역은 상대적 약점입니다. 관련 훈련을 통해 개선할 수 있습니다.`,
                en: `${cognitivedomains[topWeakness.domain].name.en} is a relative weakness. This can be improved through targeted practice.`
            }
        });
    }
    
    return recommendations;
}
```

### 4.4 리포트 출력 형식

```javascript
/**
 * HTML 리포트 생성
 */
function generateHTMLReport(report, lang = 'ko') {
    return `
    <div class="iq-report">
        <header class="report-header">
            <h1>${lang === 'ko' ? '인지능력 평가 결과 보고서' : 'Cognitive Assessment Report'}</h1>
            <p class="test-date">${new Date(report.testDate).toLocaleDateString()}</p>
        </header>
        
        <section class="overall-result">
            <h2>${lang === 'ko' ? '종합 결과' : 'Overall Results'}</h2>
            
            <div class="iq-display">
                <div class="iq-score">${report.overall.iq}</div>
                <div class="iq-label">IQ</div>
                <div class="confidence-interval">
                    95% CI: ${report.overall.confidenceInterval.lower} - ${report.overall.confidenceInterval.upper}
                </div>
            </div>
            
            <div class="classification">
                <span class="label">${report.overall.classification.label[lang]}</span>
                <span class="percentile">
                    ${lang === 'ko' ? '백분위' : 'Percentile'}: ${report.overall.percentile}%
                </span>
            </div>
        </section>
        
        <section class="domain-results">
            <h2>${lang === 'ko' ? '영역별 결과' : 'Domain Results'}</h2>
            
            <div class="domain-chart">
                ${Object.entries(report.domains).map(([key, data]) => `
                    <div class="domain-bar">
                        <div class="domain-name">${data.domain.name[lang]}</div>
                        <div class="bar-container">
                            <div class="bar" style="width: ${(data.scaledScore / 19) * 100}%">
                                <span class="score">${data.scaledScore}</span>
                            </div>
                        </div>
                        <div class="domain-iq">IQ ${data.iq}</div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <section class="analysis">
            <h2>${lang === 'ko' ? '강약점 분석' : 'Strengths & Weaknesses'}</h2>
            
            <div class="strengths">
                <h3>💪 ${lang === 'ko' ? '강점' : 'Strengths'}</h3>
                <ul>
                    ${report.analysis.strengths.map(s => `
                        <li>${cognitivedomains[s.domain].name[lang]}</li>
                    `).join('') || `<li>${lang === 'ko' ? '특별히 두드러진 강점 없음' : 'No significant strengths'}</li>`}
                </ul>
            </div>
            
            <div class="weaknesses">
                <h3>📈 ${lang === 'ko' ? '개선 영역' : 'Areas for Improvement'}</h3>
                <ul>
                    ${report.analysis.weaknesses.map(w => `
                        <li>${cognitivedomains[w.domain].name[lang]}</li>
                    `).join('') || `<li>${lang === 'ko' ? '특별히 약한 영역 없음' : 'No significant weaknesses'}</li>`}
                </ul>
            </div>
        </section>
        
        <section class="recommendations">
            <h2>${lang === 'ko' ? '권고사항' : 'Recommendations'}</h2>
            <ul>
                ${report.recommendations.map(r => `
                    <li class="${r.type}">${r.text[lang]}</li>
                `).join('')}
            </ul>
        </section>
        
        <footer class="report-footer">
            <p class="disclaimer">
                ${lang === 'ko' 
                    ? '본 결과는 참고용이며, 공인된 심리검사를 대체하지 않습니다.'
                    : 'These results are for reference only and do not replace certified psychological assessments.'}
            </p>
        </footer>
    </div>
    `;
}
```

---

## 5. 연령별 규준 적용

### 5.1 연령 규준의 필요성

동일한 원점수라도 연령에 따라 다른 IQ로 해석해야 합니다:
- 30세 성인이 10문제 중 8개 정답 → IQ 110
- 15세 청소년이 10문제 중 8개 정답 → IQ 115 (같은 수준이 더 높게 평가)
- 60세 성인이 10문제 중 8개 정답 → IQ 120 (연령 대비 우수)

### 5.2 연령대 정의

```javascript
const ageGroups = [
    { id: 'teen', range: [13, 17], label: { ko: '청소년', en: 'Teenager' } },
    { id: 'young', range: [18, 29], label: { ko: '청년', en: 'Young Adult' } },
    { id: 'adult', range: [30, 44], label: { ko: '성인', en: 'Adult' } },
    { id: 'middle', range: [45, 59], label: { ko: '중년', en: 'Middle Age' } },
    { id: 'senior', range: [60, 99], label: { ko: '장년', en: 'Senior' } }
];

function getAgeGroup(age) {
    for (const group of ageGroups) {
        if (age >= group.range[0] && age <= group.range[1]) {
            return group;
        }
    }
    return ageGroups[2];  // 기본값: 성인
}
```

### 5.3 연령별 규준 테이블

```javascript
/**
 * 연령별 규준 데이터
 * 각 연령대의 평균 능력치(theta)와 표준편차
 * 
 * 참고: 실제 표준화 연구 데이터 기반으로 조정 필요
 */
const ageNorms = {
    teen: {
        // 청소년은 아직 발달 중이므로 기준이 약간 낮음
        thetaMean: -0.2,
        thetaSD: 1.0,
        // 영역별 보정
        domainAdjustments: {
            pattern: 0.1,    // 패턴은 청소년이 강함
            numerical: 0.0,
            spatial: 0.1,
            logical: -0.1,   // 논리는 아직 발달 중
            verbal: -0.2     // 언어는 경험 부족
        }
    },
    young: {
        // 청년기: 인지능력 최고조
        thetaMean: 0.1,
        thetaSD: 1.0,
        domainAdjustments: {
            pattern: 0.0,
            numerical: 0.0,
            spatial: 0.05,
            logical: 0.0,
            verbal: 0.0
        }
    },
    adult: {
        // 성인: 기준 집단 (보정 없음)
        thetaMean: 0.0,
        thetaSD: 1.0,
        domainAdjustments: {
            pattern: 0.0,
            numerical: 0.0,
            spatial: 0.0,
            logical: 0.0,
            verbal: 0.0
        }
    },
    middle: {
        // 중년: 처리 속도 감소 시작
        thetaMean: -0.1,
        thetaSD: 1.0,
        domainAdjustments: {
            pattern: -0.1,
            numerical: 0.0,
            spatial: -0.1,
            logical: 0.05,   // 경험적 추론 강함
            verbal: 0.1      // 어휘력 최고조
        }
    },
    senior: {
        // 장년: 유동지능 감소, 결정지능 유지
        thetaMean: -0.3,
        thetaSD: 1.1,
        domainAdjustments: {
            pattern: -0.2,
            numerical: -0.1,
            spatial: -0.2,
            logical: 0.0,
            verbal: 0.15     // 어휘력 유지/향상
        }
    }
};
```

### 5.4 연령 보정 적용

```javascript
/**
 * 연령 보정된 IQ 계산
 */
function calculateAgeAdjustedIQ(theta, age, domain = null) {
    const ageGroup = getAgeGroup(age);
    const norms = ageNorms[ageGroup.id];
    
    // 연령대별 평균/표준편차로 보정
    let adjustedTheta = theta;
    
    // 영역별 추가 보정
    if (domain && norms.domainAdjustments[domain]) {
        adjustedTheta += norms.domainAdjustments[domain];
    }
    
    // 연령 규준 적용
    // (원래 theta - 연령대 평균) / 연령대 표준편차 → 표준화
    const normalizedTheta = (adjustedTheta - norms.thetaMean) / norms.thetaSD;
    
    // IQ로 변환
    const iq = Math.round(100 + normalizedTheta * 15);
    
    return {
        rawTheta: theta,
        adjustedTheta: normalizedTheta,
        iq: Math.max(40, Math.min(160, iq)),
        ageGroup: ageGroup,
        adjustment: normalizedTheta - theta
    };
}

/**
 * 완전한 연령 보정 파이프라인
 */
function calculateAgeNormedResults(responses, items, age) {
    // 1. 원시 IRT 추정
    const rawResult = calculateIQ(responses, items);
    
    // 2. 전체 점수 연령 보정
    const overallAdjusted = calculateAgeAdjustedIQ(rawResult.theta, age);
    
    // 3. 영역별 점수 연령 보정
    const domainResults = {};
    Object.keys(cognitivedomains).forEach(domain => {
        const domainItems = items.filter(i => i.domain === domain);
        const domainResponses = responses.filter((_, i) => items[i].domain === domain);
        
        if (domainItems.length === 0) return;
        
        const domainRaw = calculateIQ(domainResponses, domainItems);
        const domainAdjusted = calculateAgeAdjustedIQ(domainRaw.theta, age, domain);
        
        domainResults[domain] = {
            rawIQ: thetaToIQ(domainRaw.theta),
            ageAdjustedIQ: domainAdjusted.iq,
            adjustment: domainAdjusted.adjustment
        };
    });
    
    return {
        overall: {
            rawIQ: thetaToIQ(rawResult.theta),
            ageAdjustedIQ: overallAdjusted.iq,
            ageGroup: overallAdjusted.ageGroup,
            adjustment: Math.round(overallAdjusted.adjustment * 15)
        },
        domains: domainResults,
        interpretation: generateAgeInterpretation(overallAdjusted, age)
    };
}

/**
 * 연령 보정 해석 텍스트
 */
function generateAgeInterpretation(result, age, lang = 'ko') {
    const adjustment = Math.round(result.adjustment * 15);
    const ageGroup = result.ageGroup;
    
    if (lang === 'ko') {
        if (adjustment > 2) {
            return `${ageGroup.label.ko} 연령대 평균보다 ${Math.abs(adjustment)}점 높은 수준입니다. 동일 연령대에서 우수한 인지능력을 보이고 있습니다.`;
        } else if (adjustment < -2) {
            return `${ageGroup.label.ko} 연령대 평균보다 ${Math.abs(adjustment)}점 낮은 수준입니다. 인지 훈련을 통한 개선을 권장합니다.`;
        } else {
            return `${ageGroup.label.ko} 연령대의 평균적인 인지능력 수준입니다.`;
        }
    } else {
        if (adjustment > 2) {
            return `Your score is ${Math.abs(adjustment)} points above the ${ageGroup.label.en} average. You demonstrate superior cognitive ability for your age group.`;
        } else if (adjustment < -2) {
            return `Your score is ${Math.abs(adjustment)} points below the ${ageGroup.label.en} average. Cognitive training may help improvement.`;
        } else {
            return `Your cognitive ability is average for the ${ageGroup.label.en} age group.`;
        }
    }
}
```

### 5.5 연령 입력 UI

```javascript
/**
 * 연령 입력 및 검증
 */
function validateAge(age) {
    const numAge = parseInt(age, 10);
    
    if (isNaN(numAge)) {
        return { valid: false, error: '유효한 나이를 입력하세요.' };
    }
    
    if (numAge < 13) {
        return { valid: false, error: '본 테스트는 13세 이상을 대상으로 합니다.' };
    }
    
    if (numAge > 99) {
        return { valid: false, error: '유효한 나이를 입력하세요.' };
    }
    
    return { valid: true, age: numAge, ageGroup: getAgeGroup(numAge) };
}
```

---

## 6. 통합 구현 가이드

### 6.1 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      사용자 인터페이스                        │
├─────────────────────────────────────────────────────────────┤
│  연령 입력 → 영역 선택 → 테스트 실시 → 결과 확인 → 리포트    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      테스트 엔진                             │
├─────────────────────────────────────────────────────────────┤
│  문항 제시 → 응답 수집 → 시간 기록 → 다음 문항              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      채점 엔진                               │
├─────────────────────────────────────────────────────────────┤
│  응답 코딩 → IRT 추정 → 연령 보정 → 신뢰구간 → 분류         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      분석 엔진                               │
├─────────────────────────────────────────────────────────────┤
│  영역별 점수 → 강약점 분석 → 프로파일 생성 → 권고사항        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      리포트 생성기                           │
├─────────────────────────────────────────────────────────────┤
│  데이터 포맷팅 → 시각화 → HTML/PDF 출력 → 저장/인쇄         │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 메인 실행 코드

```javascript
/**
 * 완전한 IQ 평가 시스템
 */
class IQAssessmentSystem {
    constructor() {
        this.items = [];
        this.responses = [];
        this.responseTimes = [];
        this.userInfo = {};
        this.currentIndex = 0;
    }
    
    /**
     * 테스트 초기화
     */
    initialize(userAge, selectedDomain = null) {
        // 연령 검증
        const ageValidation = validateAge(userAge);
        if (!ageValidation.valid) {
            throw new Error(ageValidation.error);
        }
        
        this.userInfo = {
            age: ageValidation.age,
            ageGroup: ageValidation.ageGroup,
            selectedDomain: selectedDomain,
            startTime: Date.now()
        };
        
        // 문항 로드 및 섞기
        if (selectedDomain) {
            this.items = this.loadDomainItems(selectedDomain);
        } else {
            this.items = this.loadAllItems();
        }
        
        this.responses = new Array(this.items.length).fill(null);
        this.responseTimes = new Array(this.items.length).fill(null);
        this.currentIndex = 0;
        
        return {
            totalItems: this.items.length,
            ageGroup: this.userInfo.ageGroup,
            domain: selectedDomain
        };
    }
    
    /**
     * 응답 기록
     */
    recordResponse(itemIndex, selectedOption, responseTime) {
        const item = this.items[itemIndex];
        const isCorrect = selectedOption === item.correctAnswer ? 1 : 0;
        
        this.responses[itemIndex] = isCorrect;
        this.responseTimes[itemIndex] = responseTime;
        
        return {
            recorded: true,
            isCorrect: isCorrect,
            correctAnswer: item.correctAnswer
        };
    }
    
    /**
     * 최종 결과 계산
     */
    calculateResults() {
        const endTime = Date.now();
        this.userInfo.duration = Math.round((endTime - this.userInfo.startTime) / 1000);
        
        // 1. IRT 기반 능력 추정
        const irtResult = calculateIQ(this.responses, this.items);
        
        // 2. 연령 보정
        const ageAdjusted = calculateAgeAdjustedIQ(
            irtResult.theta, 
            this.userInfo.age
        );
        
        // 3. 신뢰구간
        const ci = calculateConfidenceInterval(ageAdjusted.iq, irtResult.se);
        
        // 4. 영역별 분석
        const domainScores = calculateDomainScores(
            this.responses, 
            this.items, 
            cognitivedomains
        );
        
        // 5. 강약점 분석
        const analysis = analyzeStrengthsWeaknesses(domainScores);
        
        // 6. 분류 및 백분위
        const classification = classifyIQ(ageAdjusted.iq);
        const percentile = iqToPercentile(ageAdjusted.iq);
        
        return {
            userInfo: this.userInfo,
            overall: {
                rawTheta: irtResult.theta,
                rawIQ: thetaToIQ(irtResult.theta),
                ageAdjustedIQ: ageAdjusted.iq,
                se: irtResult.se,
                confidenceInterval: ci,
                classification: classification,
                percentile: percentile
            },
            domains: domainScores,
            analysis: analysis,
            recommendations: generateRecommendations(analysis, classification),
            rawData: {
                responses: this.responses,
                responseTimes: this.responseTimes,
                totalCorrect: this.responses.filter(r => r === 1).length,
                totalItems: this.items.length
            }
        };
    }
    
    /**
     * 리포트 생성
     */
    generateReport(lang = 'ko') {
        const results = this.calculateResults();
        return generateHTMLReport(results, lang);
    }
}

// 사용 예시
const assessment = new IQAssessmentSystem();

// 1. 초기화
assessment.initialize(25, 'pattern');  // 25세, 패턴 인식 선택

// 2. 테스트 진행 중 응답 기록
assessment.recordResponse(0, 1, 15000);  // 문항 0, 선택지 1, 15초
assessment.recordResponse(1, 2, 20000);  // 문항 1, 선택지 2, 20초
// ... 계속

// 3. 결과 계산
const results = assessment.calculateResults();
console.log(results.overall.ageAdjustedIQ);  // 연령 보정 IQ
console.log(results.overall.confidenceInterval);  // 95% CI

// 4. 리포트 생성
const htmlReport = assessment.generateReport('ko');
```

### 6.3 UI 통합 예시

```html
<!-- 연령 입력 -->
<div class="age-input-section">
    <label>나이를 입력하세요</label>
    <input type="number" id="userAge" min="13" max="99" placeholder="만 나이">
    <p class="age-note">* 연령별 규준을 적용하여 정확한 IQ를 산출합니다.</p>
</div>

<!-- 결과 표시 -->
<div class="result-display">
    <div class="iq-main">
        <span class="iq-value" id="finalIQ">--</span>
        <span class="iq-label">IQ (연령 보정)</span>
    </div>
    
    <div class="confidence-interval">
        <span class="ci-label">95% 신뢰구간</span>
        <span class="ci-range" id="ciRange">-- ~ --</span>
    </div>
    
    <div class="classification">
        <span class="class-label" id="iqClass">--</span>
        <span class="percentile" id="percentileValue">백분위 --%</span>
    </div>
</div>

<script>
// 결과 표시 함수
function displayResults(results) {
    document.getElementById('finalIQ').textContent = results.overall.ageAdjustedIQ;
    
    const ci = results.overall.confidenceInterval;
    document.getElementById('ciRange').textContent = `${ci.lower} ~ ${ci.upper}`;
    
    document.getElementById('iqClass').textContent = 
        results.overall.classification.label.ko;
    
    document.getElementById('percentileValue').textContent = 
        `백분위 ${results.overall.percentile}%`;
}
</script>
```

---

## 7. 품질 관리

### 7.1 문항 분석

```javascript
/**
 * 문항 통계 분석
 * 실제 응답 데이터 수집 후 문항 모수 교정에 사용
 */
function analyzeItemStatistics(allResponses, item) {
    const n = allResponses.length;
    
    // 정답률
    const correctCount = allResponses.filter(r => r === 1).length;
    const pValue = correctCount / n;
    
    // 점이연 상관 (변별도 지표)
    // 상위 27% vs 하위 27% 비교
    const sorted = [...allResponses].sort((a, b) => b.total - a.total);
    const upperGroup = sorted.slice(0, Math.floor(n * 0.27));
    const lowerGroup = sorted.slice(-Math.floor(n * 0.27));
    
    const upperCorrect = upperGroup.filter(r => r[item.id] === 1).length;
    const lowerCorrect = lowerGroup.filter(r => r[item.id] === 1).length;
    
    const discrimination = (upperCorrect - lowerCorrect) / upperGroup.length;
    
    return {
        itemId: item.id,
        pValue: pValue,
        discrimination: discrimination,
        quality: evaluateItemQuality(pValue, discrimination)
    };
}

function evaluateItemQuality(p, d) {
    // 난이도 평가 (0.3 ~ 0.7이 이상적)
    const difficultyOK = p >= 0.2 && p <= 0.8;
    
    // 변별도 평가 (0.3 이상이 양호)
    const discriminationOK = d >= 0.3;
    
    if (difficultyOK && discriminationOK) return 'good';
    if (difficultyOK || discriminationOK) return 'acceptable';
    return 'review';
}
```

### 7.2 신뢰도 검증

```javascript
/**
 * 내적 일관성 신뢰도 (Cronbach's Alpha)
 */
function calculateCronbachAlpha(responses) {
    const n = responses.length;
    const k = responses[0].length;  // 문항 수
    
    // 각 문항의 분산
    let sumItemVariance = 0;
    for (let j = 0; j < k; j++) {
        const itemScores = responses.map(r => r[j]);
        sumItemVariance += variance(itemScores);
    }
    
    // 총점의 분산
    const totalScores = responses.map(r => r.reduce((a, b) => a + b, 0));
    const totalVariance = variance(totalScores);
    
    // Cronbach's Alpha
    const alpha = (k / (k - 1)) * (1 - sumItemVariance / totalVariance);
    
    return {
        alpha: alpha,
        interpretation: alpha >= 0.9 ? 'excellent' : 
                        alpha >= 0.8 ? 'good' : 
                        alpha >= 0.7 ? 'acceptable' : 'poor'
    };
}

function variance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
}
```

### 7.3 측정 표준오차 모니터링

```javascript
/**
 * 테스트 전체의 측정 정밀도 평가
 */
function evaluateMeasurementPrecision(items) {
    // 다양한 능력 수준에서 정보량 계산
    const thetaLevels = [-2, -1, 0, 1, 2];
    
    const precisionTable = thetaLevels.map(theta => {
        const info = calculateFisherInformation(theta, items);
        const sem = 1 / Math.sqrt(info);
        const semIQ = sem * 15;
        
        return {
            theta: theta,
            iq: thetaToIQ(theta),
            information: info,
            sem: semIQ,
            precision: semIQ < 4 ? 'excellent' : 
                       semIQ < 6 ? 'good' : 
                       semIQ < 8 ? 'acceptable' : 'poor'
        };
    });
    
    return {
        table: precisionTable,
        averageSEM: precisionTable.reduce((sum, p) => sum + p.sem, 0) / thetaLevels.length,
        recommendation: generatePrecisionRecommendation(precisionTable)
    };
}
```

---

## 부록

### A. 참고 문헌

1. Wechsler, D. (2008). WAIS-IV Administration and Scoring Manual.
2. Embretson, S. E., & Reise, S. P. (2000). Item Response Theory for Psychologists.
3. Lord, F. M. (1980). Applications of Item Response Theory to Practical Testing Problems.

### B. 용어 사전

| 용어 | 정의 |
|------|------|
| IRT | Item Response Theory, 문항반응이론 |
| MLE | Maximum Likelihood Estimation, 최대우도추정 |
| EAP | Expected A Posteriori, 기대사후추정 |
| SEM | Standard Error of Measurement, 측정의 표준오차 |
| ICC | Item Characteristic Curve, 문항특성곡선 |
| 3PL | 3-Parameter Logistic Model, 3모수 로지스틱 모델 |

### C. 버전 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-12 | 최초 작성 |

---

**문서 끝**
