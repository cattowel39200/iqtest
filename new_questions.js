// IQ 테스트 가이드라인 기반 새로운 문제 시스템
const questions = {
    // ============================================
    // 영역 1: 지각 추론 및 유동성 지능 (Perceptual Reasoning & Fluid Intelligence)
    // 가이드라인 기준: 레이븐 매트릭스 스타일, XOR 논리, 다중 변환 규칙
    // ============================================
    perceptual: [
        // 문항 1-1: 회전 및 연속성 (난이도: 하, IRT b = -1.5)
        {
            id: 'pr1',
            category: 'perceptual',
            categoryName: '지각 추론',
            difficulty: 1,
            irtB: -1.5,
            question: '3×3 행렬에서 빈 칸에 들어갈 도형을 고르세요.',
            matrix: ['↑', '→', '↓', '→', '↓', '←', '↓', '←', '?'],
            options: ['↑', '→', '↓', '←'],
            correct: 0,
            explanation: '각 행에서 화살표가 시계방향으로 90도씩 회전합니다.'
        },
        // 문항 1-2: XOR 논리 (난이도: 상, IRT b = +1.5)
        {
            id: 'pr2',
            category: 'perceptual',
            categoryName: '지각 추론',
            difficulty: 3,
            irtB: 1.5,
            question: '배타적 논리합(XOR) 규칙을 찾아 빈 칸을 채우세요.',
            matrix: ['|', '+', '─', '×', '○', '●', '□', '◧', '?'],
            options: ['■', '□', '◧', '○'],
            correct: 0,
            explanation: '각 행에서 첫 번째와 두 번째 도형을 겹쳤을 때 겹치는 부분은 사라지고 겹치지 않는 부분만 남습니다.'
        },
        // 문항 1-3: 다중 변환 (난이도: 최상, IRT b = +2.5)
        {
            id: 'pr3',
            category: 'perceptual',
            categoryName: '지각 추론',
            difficulty: 5,
            irtB: 2.5,
            question: '3가지 속성이 독립적으로 변하는 패턴을 분석하세요.',
            matrix: ['○¹', '△²', '□³', '△²', '□³', '○¹', '□³', '○¹', '?'],
            options: ['△²', '○¹', '□³', '◇⁴'],
            correct: 0,
            explanation: '각 행은 라틴 스퀘어 규칙을 따릅니다. 모양과 숫자가 각 행마다 한 번씩만 등장해야 합니다.'
        },
        // 문항 1-4: 패턴 증가 (난이도: 중, IRT b = 0.0)
        {
            id: 'pr4',
            category: 'perceptual',
            categoryName: '지각 추론',
            difficulty: 2,
            irtB: 0.0,
            question: '점의 개수가 변하는 규칙을 찾으세요.',
            matrix: ['•', '••', '•••', '••', '•••', '••••', '•••', '••••', '?'],
            options: ['••', '•••••', '••••', '•'],
            correct: 2,
            explanation: '각 행에서 점의 개수가 n, n+1, n+2 패턴으로 증가합니다.'
        },
        // 문항 1-5: 반사 대칭 (난이도: 중, IRT b = +0.5)
        {
            id: 'pr5',
            category: 'perceptual',
            categoryName: '지각 추론',
            difficulty: 2,
            irtB: 0.5,
            question: '반사 대칭 규칙을 적용하여 빈 칸을 찾으세요.',
            matrix: ['◄', '►', '◄', '▲', '▼', '▲', '◊', '◇', '?'],
            options: ['◊', '◇', '♦', '○'],
            correct: 0,
            explanation: '각 행에서 중간 기호를 축으로 좌우가 대칭입니다.'
        }
    ],

    // ============================================
    // 영역 2: 수리 논리 및 패턴 인식 (Quantitative Reasoning)
    // 가이드라인 기준: 다단계 수열, 교차 수열, 숫자 분해 패턴
    // ============================================
    quantitative: [
        // 문항 2-1: 다단계 등차/등비 수열 (난이도: 중, IRT b = 0.0)
        {
            id: 'qr1',
            category: 'quantitative',
            categoryName: '수리 논리',
            difficulty: 2,
            irtB: 0.0,
            question: '다음 수열의 빈칸에 들어갈 숫자는?',
            sequence: [4, 9, 19, 39, 79, '?'],
            options: ['119', '139', '149', '159'],
            correct: 3,
            explanation: '차이가 5, 10, 20, 40으로 2배씩 증가하므로 다음 차이는 80입니다. 79 + 80 = 159'
        },
        // 문항 2-2: 교차 수열 (난이도: 상, IRT b = +1.0)
        {
            id: 'qr2',
            category: 'quantitative',
            categoryName: '수리 논리',
            difficulty: 3,
            irtB: 1.0,
            question: '두 개의 수열이 섞인 패턴을 분석하세요.',
            sequence: [5, 24, 7, 21, 9, 18, 11, '?'],
            options: ['13', '14', '15', '16'],
            correct: 2,
            explanation: '홀수 번째: 5, 7, 9, 11 (+2씩), 짝수 번째: 24, 21, 18 (-3씩). 18-3=15'
        },
        // 문항 2-3: 숫자 분해 패턴 (난이도: 최상, IRT b = +2.8)
        {
            id: 'qr3',
            category: 'quantitative',
            categoryName: '수리 논리',
            difficulty: 5,
            irtB: 2.8,
            question: '자릿수의 합을 이용한 규칙을 찾으세요.',
            sequence: ['12→9', '23→25', '34→49', '45→?'],
            options: ['65', '73', '81', '89'],
            correct: 2,
            explanation: '각 수의 자릿수를 더한 후 제곱합니다. (1+2)²=9, (2+3)²=25, (3+4)²=49, (4+5)²=81'
        },
        // 문항 2-4: 소인수분해 수열 (난이도: 상, IRT b = +1.2)
        {
            id: 'qr4',
            category: 'quantitative',
            categoryName: '수리 논리',
            difficulty: 3,
            irtB: 1.2,
            question: '소수의 곱셈 패턴을 찾아보세요.',
            sequence: [2, 6, 30, 210, 2310, '?'],
            options: ['23100', '30030', '46200', '69300'],
            correct: 1,
            explanation: '연속 소수의 곱: 2, 2×3, 2×3×5, 2×3×5×7, 2×3×5×7×11, 2×3×5×7×11×13=30030'
        },
        // 문항 2-5: 룩앤세이 수열 (난이도: 상, IRT b = +1.8)
        {
            id: 'qr5',
            category: 'quantitative',
            categoryName: '수리 논리',
            difficulty: 4,
            irtB: 1.8,
            question: '다음 수열의 생성 규칙을 찾으세요.',
            sequence: [1, 11, 21, 1211, 111221, '?'],
            options: ['312211', '31121211', '3112221', '211213'],
            correct: 0,
            explanation: '"하나의 1" → 11, "두 개의 1" → 21, "하나의 2, 하나의 1" → 1211, ... "세 개의 1, 두 개의 2, 두 개의 1" → 312211'
        }
    ],

    // ============================================
    // 영역 3: 시공간 처리 능력 (Visual-Spatial Processing)
    // 가이드라인 기준: 큐브 회전, 전개도 접기, 블록 카운팅
    // ============================================
    spatial: [
        // 문항 3-1: 큐브 회전 (난이도: 중, IRT b = 0.5)
        {
            id: 'sp1',
            category: 'spatial',
            categoryName: '시공간 처리',
            difficulty: 2,
            irtB: 0.5,
            question: '주사위를 회전시켜 만들 수 없는 것은?',
            description: '기준 주사위: 앞면=1, 윗면=2, 우측면=3',
            options: [
                '앞면=2, 윗면=3, 우측면=1',
                '앞면=3, 윗면=1, 우측면=2',
                '앞면=1, 윗면=3, 우측면=4',
                '앞면=2, 윗면=1, 우측면=6'
            ],
            correct: 2,
            explanation: '주사위에서 1의 대면은 6, 2의 대면은 5, 3의 대면은 4입니다. 1-3-4가 한 모서리에서 만날 수 없습니다.'
        },
        // 문항 3-2: 전개도 접기 (난이도: 상, IRT b = +1.8)
        {
            id: 'sp2',
            category: 'spatial',
            categoryName: '시공간 처리',
            difficulty: 4,
            irtB: 1.8,
            question: '전개도를 접었을 때 점 A와 점 B가 만나는가?',
            description: '정육면체 전개도에서 인접하지 않은 두 점의 위치 관계',
            options: ['만난다', '만나지 않는다', '모서리에서 만난다', '알 수 없다'],
            correct: 1,
            explanation: '전개도 상에서 멀리 떨어진 두 점이지만 접었을 때 실제로는 인접한 면에 위치합니다.'
        },
        // 문항 3-3: 블록 카운팅 (난이도: 하, IRT b = -0.5)
        {
            id: 'sp3',
            category: 'spatial',
            categoryName: '시공간 처리',
            difficulty: 1,
            irtB: -0.5,
            question: '쌓기나무 구조물의 총 블록 개수는?',
            description: '3층 피라미드: 맨 위층 1개, 2층 4개 보임, 1층 일부 보임',
            options: ['6개', '9개', '14개', '20개'],
            correct: 2,
            explanation: '1층 9개, 2층 4개, 3층 1개로 총 14개입니다.'
        },
        // 문항 3-4: 단면 추론 (난이도: 중, IRT b = +0.3)
        {
            id: 'sp4',
            category: 'spatial',
            categoryName: '시공간 처리',
            difficulty: 2,
            irtB: 0.3,
            question: '정육면체를 대각선으로 자른 단면의 모양은?',
            options: ['정삼각형', '정사각형', '직사각형', '정육각형'],
            correct: 2,
            explanation: '정육면체를 대각선으로 자르면 직사각형 단면이 나타납니다.'
        },
        // 문항 3-5: 거울상 (난이도: 하, IRT b = -1.0)
        {
            id: 'sp5',
            category: 'spatial',
            categoryName: '시공간 처리',
            difficulty: 1,
            irtB: -1.0,
            question: '문자 "F"를 거울에 비춘 모양은?',
            options: ['F', 'Ꝼ', 'ᖴ', '⅂'],
            correct: 1,
            explanation: '거울에 비치면 좌우가 반전됩니다.'
        }
    ],

    // ============================================
    // 영역 4: 언어 및 논리 추론 (Verbal & Logical Reasoning)
    // 가이드라인 기준: 조건부 추론, 논리 그리드 퍼즐, 삼단논법
    // ============================================
    logical: [
        // 문항 4-1: 조건부 추론 (난이도: 중, IRT b = 0.2)
        {
            id: 'lg1',
            category: 'logical',
            categoryName: '논리 추론',
            difficulty: 2,
            irtB: 0.2,
            question: '크롬(거짓말쟁이)과 주석(정직한 로봇) 중 로봇 A가 말했다: "우리는 둘 다 크롬이다." A와 B의 정체는?',
            options: ['A=크롬, B=주석', 'A=주석, B=크롬', 'A=크롬, B=크롬', 'A=주석, B=주석'],
            correct: 0,
            explanation: 'A가 주석이면 거짓말을 할 수 없고, A가 크롬이면 "둘 다 크롬"이 거짓이므로 B는 주석입니다.'
        },
        // 문항 4-2: 논리 그리드 퍼즐 (난이도: 상, IRT b = +1.2)
        {
            id: 'lg2',
            category: 'logical',
            categoryName: '논리 추론',
            difficulty: 3,
            irtB: 1.2,
            question: '철수, 영희, 민수가 빨강/파랑/노랑 셔츠를 입고 사과/배/포도를 먹는다. 철수는 빨강 안 입음. 배 먹는 사람은 파랑 입음. 영희는 포도 먹음. 민수는 노랑 입음. 철수가 먹는 과일은?',
            options: ['사과', '배', '포도', '알 수 없음'],
            correct: 1,
            explanation: '민수=노랑, 영희=포도, 배=파랑 조건으로 추론하면 철수=파랑=배입니다.'
        },
        // 문항 4-3: 모자 색깔 추론 (난이도: 상, IRT b = +1.8)
        {
            id: 'lg3',
            category: 'logical',
            categoryName: '논리 추론',
            difficulty: 4,
            irtB: 1.8,
            question: '빨간 모자 3개, 파란 모자 2개 중에서 3명이 모자를 쓴다. A,B가 "모르겠다"고 한 후 C가 자신의 색을 맞혔다. C의 모자는?',
            options: ['빨간색', '파란색', '알 수 없다', '둘 다 가능'],
            correct: 0,
            explanation: 'C는 A,B가 추론하지 못한 것을 보고 자신이 빨간 모자임을 알 수 있었습니다.'
        },
        // 문항 4-4: 삼단논법 (난이도: 하, IRT b = -0.8)
        {
            id: 'lg4',
            category: 'logical',
            categoryName: '논리 추론',
            difficulty: 1,
            irtB: -0.8,
            question: '모든 새는 날개가 있다. 참새는 새다. 반드시 참인 것은?',
            options: ['모든 날개 있는 것은 새다', '참새는 날개가 있다', '날개 없으면 참새 아니다', '모든 새는 참새다'],
            correct: 1,
            explanation: '삼단논법에 의해 참새는 새이므로 날개가 있습니다.'
        },
        // 문항 4-5: 러셀의 역설 (난이도: 최상, IRT b = +2.5)
        {
            id: 'lg5',
            category: 'logical',
            categoryName: '논리 추론',
            difficulty: 5,
            irtB: 2.5,
            question: '"자기 자신을 포함하지 않는 모든 집합의 집합" R은 R을 포함하는가?',
            options: ['포함한다', '포함하지 않는다', '모순이다', '정의할 수 없다'],
            correct: 2,
            explanation: 'R이 자신을 포함하면 정의에 모순, 포함하지 않으면 자신을 포함해야 하므로 모순입니다.'
        }
    ],

    // ============================================
    // 영역 5: 언어 유추 (Verbal Analogies)
    // 가이드라인: 문화적 편향을 최소화한 논리적 관계성
    // ============================================
    verbal: [
        // 문항 5-1: 기본 유추 (난이도: 하, IRT b = -1.2)
        {
            id: 'vb1',
            category: 'verbal',
            categoryName: '언어 유추',
            difficulty: 1,
            irtB: -1.2,
            question: '책 : 독서 = 음악 : ?',
            options: ['악기', '청취', '가수', '콘서트'],
            correct: 1,
            explanation: '책을 하는 행위가 독서이듯, 음악을 하는 행위는 청취입니다.'
        },
        // 문항 5-2: 장소 관계 (난이도: 하, IRT b = -0.8)
        {
            id: 'vb2',
            category: 'verbal',
            categoryName: '언어 유추',
            difficulty: 1,
            irtB: -0.8,
            question: '의사 : 병원 = 교사 : ?',
            options: ['학생', '학교', '교실', '교육'],
            correct: 1,
            explanation: '의사가 일하는 곳이 병원이듯, 교사가 일하는 곳은 학교입니다.'
        },
        // 문항 5-3: 반대 관계 (난이도: 중, IRT b = 0.0)
        {
            id: 'vb3',
            category: 'verbal',
            categoryName: '언어 유추',
            difficulty: 2,
            irtB: 0.0,
            question: '빛 : 어둠 = 지식 : ?',
            options: ['학교', '무지', '책', '공부'],
            correct: 1,
            explanation: '빛의 반대가 어둠이듯, 지식의 반대는 무지입니다.'
        },
        // 문항 5-4: 발달 단계 (난이도: 중, IRT b = +0.5)
        {
            id: 'vb4',
            category: 'verbal',
            categoryName: '언어 유추',
            difficulty: 2,
            irtB: 0.5,
            question: '씨앗 : 나무 = 유충 : ?',
            options: ['알', '나비', '벌레', '꽃'],
            correct: 1,
            explanation: '씨앗이 자라면 나무가 되듯, 유충이 자라면 나비가 됩니다.'
        },
        // 문항 5-5: 추상적 관계 (난이도: 상, IRT b = +1.5)
        {
            id: 'vb5',
            category: 'verbal',
            categoryName: '언어 유추',
            difficulty: 3,
            irtB: 1.5,
            question: '엔트로피 : 무질서 = 특이점 : ?',
            options: ['질서', '무한대', '중력', '시간'],
            correct: 1,
            explanation: '엔트로피가 무질서를 나타내듯, 특이점은 무한대를 의미합니다.'
        }
    ]
};