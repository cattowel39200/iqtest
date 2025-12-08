// ============================================
// 새로운 테스트 유형별 문제 데이터베이스
// ============================================

const testTypes = {
    // ============================================
    // 1. 쉬움테스트 (10분 세트, 10문항)
    // ============================================
    easy: {
        name: "쉬움테스트",
        duration: "10분",
        timePerQuestion: 60, // 60초
        totalQuestions: 10,
        questions: [
            {
                id: "easy_1",
                question: "다음 중 다른 하나는?",
                type: "패턴인식",
                difficulty: 1,
                options: ["☀ (태양)", "🌙 (달)", "⭐ (별)", "🌧️ (비)"],
                correct: 3,
                explanation: "☀, 🌙, ⭐는 모두 천체이지만, 🌧️는 날씨 현상입니다.",
                timeLimit: 60
            },
            {
                id: "easy_2",
                question: "다음 수열의 빈칸은?",
                type: "수리논리",
                difficulty: 1,
                options: ["8", "9", "10", "11"],
                correct: 1,
                explanation: "1, 3, 5, 7, 9 - 홀수 수열입니다.",
                questionText: "1, 3, 5, 7, ___",
                timeLimit: 60
            },
            {
                id: "easy_3",
                question: "다음 도형 중 회전해도 모양이 유지되는 것은?",
                type: "공간추론",
                difficulty: 1,
                options: ["○ (원)", "△ (삼각형)", "✦ (별)", "◇ (마름모)"],
                correct: 0,
                explanation: "원은 어떻게 회전해도 모양이 동일합니다.",
                timeLimit: 60
            },
            {
                id: "easy_4",
                question: "다음 중 실제 존재하는 단어는?",
                type: "언어추론",
                difficulty: 1,
                options: ["달유석", "실낙원", "모류산", "사비록"],
                correct: 1,
                explanation: "실낙원은 존재하는 문학 작품입니다.",
                timeLimit: 60
            },
            {
                id: "easy_5",
                question: "규칙을 따르지 않는 숫자는?",
                type: "수리논리",
                difficulty: 1,
                options: ["4", "8", "12", "15", "16"],
                correct: 3,
                explanation: "4, 8, 12, 16은 모두 4의 배수이지만, 15는 아닙니다.",
                questionText: "4, 8, 12, 15, 16",
                timeLimit: 60
            },
            {
                id: "easy_6",
                question: "다음 계산의 결과는?",
                type: "수리논리",
                difficulty: 1,
                options: ["20", "22", "24", "26"],
                correct: 1,
                explanation: "규칙: a ⬤ b = a × 2 + b × 2 → 10 × 2 + 2 × 2 = 22",
                questionText: "7 ⬤ 2 = 16, 8 ⬤ 3 = 22, 6 ⬤ 1 = 7, 10 ⬤ 2 = ?",
                timeLimit: 60
            },
            {
                id: "easy_7",
                question: "다음 중 의미가 다른 하나는?",
                type: "언어추론",
                difficulty: 1,
                options: ["빠르다", "신속하다", "민첩하다", "느리다"],
                correct: 3,
                explanation: "빠르다, 신속하다, 민첩하다는 모두 속도가 빠름을 의미하지만, 느리다는 반대입니다.",
                timeLimit: 60
            },
            {
                id: "easy_8",
                question: "다음 문장 중 참인 것은?",
                type: "논리추론",
                difficulty: 1,
                options: [
                    "모든 사람은 고양이다",
                    "모든 동물은 포유류다",
                    "일부 고양이는 동물이다",
                    "식물은 동물보다 똑똑하다"
                ],
                correct: 2,
                explanation: "모든 고양이는 동물이므로 일부 고양이는 동물이다가 참입니다.",
                timeLimit: 60
            },
            {
                id: "easy_9",
                question: "다음 수열의 빈칸은?",
                type: "수리논리",
                difficulty: 1,
                options: ["32", "64", "128", "256"],
                correct: 0,
                explanation: "2, 4, 8, 16, 32 - 각각 2배씩 증가하는 수열입니다.",
                questionText: "2, 4, 8, 16, ___",
                timeLimit: 60
            },
            {
                id: "easy_10",
                question: "다음 두 단어의 공통점은?",
                type: "언어추론",
                difficulty: 1,
                options: ["둘 다 액체", "둘 다 물과 관련", "둘 다 짠맛", "둘 다 동물"],
                correct: 1,
                explanation: "강과 바다는 모두 물과 관련된 자연 현상입니다.",
                questionText: "강, 바다",
                timeLimit: 60
            }
        ]
    },

    // ============================================
    // 2. 중간테스트 (20분 세트, 16문항)
    // ============================================
    medium: {
        name: "중간테스트",
        duration: "20분",
        timePerQuestion: 75, // 75초
        totalQuestions: 16,
        questions: [
            {
                id: "medium_1",
                question: "다음 중 다른 하나는? (내부 선 개수 기준)",
                type: "패턴인식",
                difficulty: 2,
                options: ["△ (3선)", "◇ (4선)", "★ (10선)", "⬠ (6선)"],
                correct: 2,
                explanation: "△(3), ◇(4), ⬠(6)은 연속적이지만 ★(10)은 급격한 증가입니다.",
                timeLimit: 75
            },
            {
                id: "medium_2",
                question: "빈칸에 들어갈 도형은?",
                type: "패턴인식",
                difficulty: 2,
                options: ["■■", "●■", "▲■", "★▲"],
                correct: 0,
                explanation: "● → ●● → ▲● → ▲▲ → ■▲ → ■■ (패턴이 두 개씩 같아지는 규칙)",
                questionText: "● → ●● → ▲● → ▲▲ → ■▲ → ___",
                timeLimit: 75
            },
            {
                id: "medium_3",
                question: "다음 도형의 규칙은? 다음 줄은?",
                type: "패턴인식",
                difficulty: 2,
                options: ["⬜⬛⬜⬛", "⬛⬜⬛⬜", "⬜⬜⬛⬛", "⬛⬛⬜⬜"],
                correct: 0,
                explanation: "체스판 패턴이 반복됩니다.",
                questionText: "⬜⬛⬜⬛\n⬛⬜⬛⬜\n⬜⬛⬜⬛\n⬛⬜⬛⬜",
                timeLimit: 75
            },
            {
                id: "medium_4",
                question: "회전 시 모양이 동일한 도형은?",
                type: "공간추론",
                difficulty: 2,
                options: ["정삼각형", "정사각형", "직사각형", "별(5각)"],
                correct: 1,
                explanation: "정사각형은 90도 회전해도 동일한 모양을 유지합니다.",
                timeLimit: 75
            },
            {
                id: "medium_5",
                question: "좌우 대칭이 아닌 것은?",
                type: "공간추론",
                difficulty: 2,
                options: ["⚓ (닻)", "⚛ (원자)", "❄ (눈꽃)", "⚡ (번개)"],
                correct: 3,
                explanation: "번개(⚡)는 좌우 대칭이 아닙니다.",
                timeLimit: 75
            },
            {
                id: "medium_6",
                question: "빈칸 숫자는?",
                type: "수리논리",
                difficulty: 2,
                options: ["48", "96", "192", "384"],
                correct: 0,
                explanation: "3, 6, 12, 24, 48 - 각각 2배씩 증가합니다.",
                questionText: "3, 6, 12, 24, ___",
                timeLimit: 75
            },
            {
                id: "medium_7",
                question: "다음 수열의 규칙은?",
                type: "수리논리",
                difficulty: 2,
                options: ["22", "28", "35", "42"],
                correct: 0,
                explanation: "1, 2, 4, 7, 11, 16, 22 - 차이가 +1, +2, +3, +4, +5, +6 순으로 증가합니다.",
                questionText: "1, 2, 4, 7, 11, 16, ___",
                timeLimit: 75
            },
            {
                id: "medium_8",
                question: "다음 연산 결과는?",
                type: "수리논리",
                difficulty: 2,
                options: ["30", "33", "36", "39"],
                correct: 1,
                explanation: "규칙: a ◆ b = a × 3 + b × 3 → 9 × 3 + 3 × 3 = 27 + 6 = 33",
                questionText: "5 ◆ 3 = 22, 7 ◆ 2 = 18, 9 ◆ 3 = ?",
                timeLimit: 75
            },
            {
                id: "medium_9",
                question: "다음 중 다른 하나는? (배수 규칙)",
                type: "수리논리",
                difficulty: 2,
                options: ["12", "18", "24", "35", "48"],
                correct: 3,
                explanation: "12, 18, 24, 48은 모두 6의 배수이지만, 35는 아닙니다.",
                questionText: "12, 18, 24, 35, 48",
                timeLimit: 75
            },
            {
                id: "medium_10",
                question: "빈칸에 들어갈 숫자는?",
                type: "수리논리",
                difficulty: 2,
                options: ["11", "12", "13", "14"],
                correct: 0,
                explanation: "규칙: x + 5 → 6 + 5 = 11",
                questionText: "10 → 19, 7 → 13, 4 → 7, 6 → ___",
                timeLimit: 75
            },
            {
                id: "medium_11",
                question: "어떤 숫자가 다음에 올까?",
                type: "수리논리",
                difficulty: 2,
                options: ["35", "37", "39", "41"],
                correct: 1,
                explanation: "규칙: n² + 1 → 6² + 1 = 37",
                questionText: "2 → 5, 3 → 10, 4 → 17, 5 → 26, 6 → ___",
                timeLimit: 75
            },
            {
                id: "medium_12",
                question: "다음 문장 중 논리적으로 맞는 것은?",
                type: "논리추론",
                difficulty: 2,
                options: [
                    "일부 고양이는 동물이다",
                    "모든 동물은 고양이다",
                    "식물은 동물보다 강하다",
                    "새는 모두 날지 못한다"
                ],
                correct: 0,
                explanation: "모든 고양이는 동물이므로 일부 고양이는 동물이다가 논리적으로 참입니다.",
                timeLimit: 75
            },
            {
                id: "medium_13",
                question: "의미가 다른 하나는?",
                type: "언어추론",
                difficulty: 2,
                options: ["지식", "학문", "정보", "오해"],
                correct: 3,
                explanation: "지식, 학문, 정보는 모두 긍정적 개념이지만, 오해는 부정적 개념입니다.",
                timeLimit: 75
            },
            {
                id: "medium_14",
                question: "다음 알파벳 시퀀스의 다음 글자는?",
                type: "패턴인식",
                difficulty: 2,
                options: ["P", "Q", "R", "S"],
                correct: 0,
                explanation: "A, D, G, J, M, P - 3칸씩 증가합니다.",
                questionText: "A, D, G, J, M, ___",
                timeLimit: 75
            },
            {
                id: "medium_15",
                question: "다음 네 단어의 공통점은?",
                type: "언어추론",
                difficulty: 2,
                options: ["모두 에너지", "모두 자연", "모두 소리", "모두 운동"],
                correct: 0,
                explanation: "불, 빛, 해, 전기는 모두 에너지의 형태입니다.",
                questionText: "불, 빛, 해, 전기",
                timeLimit: 75
            },
            {
                id: "medium_16",
                question: "암호 규칙을 찾아 빈칸을 채우세요",
                type: "논리추론",
                difficulty: 2,
                options: ["H6", "I7", "J8", "K9"],
                correct: 0,
                explanation: "알파벳 2칸 증가, 숫자 2 증가: F4 → H6",
                questionText: "A1 → C3, B2 → D4, D3 → F5, F4 → ___",
                timeLimit: 75
            }
        ]
    },

    // ============================================
    // 3. 고난도테스트 (40분 세트, 24문항)
    // ============================================
    hard: {
        name: "고난도테스트",
        duration: "40분",
        timePerQuestion: 100, // 100초
        totalQuestions: 24,
        questions: [
            {
                id: "hard_1",
                question: "다음 중 선 개수 규칙에 맞지 않는 도형은?",
                type: "패턴인식",
                difficulty: 3,
                options: ["● (1선)", "▲ (3선)", "■ (4선)", "◆ (4선)", "★ (10선)"],
                correct: 4,
                explanation: "● (1), ▲ (3), ■ (4), ◆ (4)는 연속적이지만 ★ (10)은 급격한 증가입니다.",
                timeLimit: 100
            },
            {
                id: "hard_2",
                question: "다음 도형 패턴의 다음 단계는?",
                type: "패턴인식",
                difficulty: 3,
                options: ["⬛⬛⬛⬜", "⬜⬜⬜⬛", "⬛⬜⬛⬜", "⬜⬛⬜⬛"],
                correct: 1,
                explanation: "시계 방향으로 회전하는 패턴입니다.",
                questionText: "⬜⬜⬛⬛ → ⬜⬛⬜⬛ → ⬛⬜⬜⬛ → ⬛⬛⬜⬜ → ?",
                timeLimit: 100
            },
            {
                id: "hard_3",
                question: "다음 도형 중 회전해도 동일한 도형은? (회전대칭)",
                type: "공간추론",
                difficulty: 3,
                options: ["정삼각형", "정사각형", "직각삼각형", "오각별"],
                correct: 1,
                explanation: "정사각형은 90도, 180도, 270도 회전해도 동일한 모양입니다.",
                timeLimit: 100
            },
            {
                id: "hard_4",
                question: "다음 도형 합성 규칙에 따른 빈칸은?",
                type: "수리논리",
                difficulty: 3,
                options: ["14선 도형", "15선 도형", "16선 도형", "17선 도형"],
                correct: 0,
                explanation: "●(1선) + ▲(3선) = 4선, ▲(3선) + ■(4선) = 7선, ■(4선) + ★(10선) = 14선",
                questionText: "●(1선) + ▲(3선) = 4선 도형, ▲(3선) + ■(4선) = 7선 도형, ■(4선) + ★(10선) = ?",
                timeLimit: 100
            },
            {
                id: "hard_5",
                question: "다음 중 다른 하나는? (사각형 종류 규칙)",
                type: "공간추론",
                difficulty: 3,
                options: ["평행사변형", "정사각형", "직사각형", "원"],
                correct: 3,
                explanation: "평행사변형, 정사각형, 직사각형은 모두 사각형이지만, 원은 원형입니다.",
                timeLimit: 100
            },
            {
                id: "hard_6",
                question: "좌우 대칭이 아닌 것은?",
                type: "공간추론",
                difficulty: 3,
                options: ["⚓ (닻)", "❄ (눈꽃)", "⚛ (원자)", "❤️ (하트)"],
                correct: 0,
                explanation: "닻(⚓)은 좌우 대칭이 아닙니다.",
                timeLimit: 100
            },
            {
                id: "hard_7",
                question: "다음 도형에서 규칙을 찾아 빈칸 채우기",
                type: "패턴인식",
                difficulty: 3,
                options: ["●▲●▲", "▲●▲●", "●●▲▲", "▲▲●●"],
                correct: 0,
                explanation: "●▲●▲ 패턴이 반복됩니다.",
                questionText: "●▲●▲ → 다음은?",
                timeLimit: 100
            },
            {
                id: "hard_8",
                question: "대칭 축 개수가 가장 많은 도형은?",
                type: "공간추론",
                difficulty: 3,
                options: ["원", "정삼각형", "정사각형", "오각별"],
                correct: 0,
                explanation: "원은 무한개의 대칭축을 가집니다.",
                timeLimit: 100
            },
            {
                id: "hard_9",
                question: "다음 수열의 빈칸은?",
                type: "수리논리",
                difficulty: 3,
                options: ["65", "67", "69", "71"],
                correct: 0,
                explanation: "2, 3, 5, 9, 17, 33, 65 - 각 항은 이전 항의 2배에서 1을 뺀 값입니다.",
                questionText: "2, 3, 5, 9, 17, 33, ___",
                timeLimit: 100
            },
            {
                id: "hard_10",
                question: "다음 연산의 규칙을 찾아라",
                type: "수리논리",
                difficulty: 3,
                options: ["40", "44", "48", "52"],
                correct: 1,
                explanation: "규칙: a × (b + 1) → 10 × (4 + 1) = 50이 아니라 a × b + 4 → 10 × 4 + 4 = 44",
                questionText: "7 ⬤ 3 = 28, 8 ⬤ 2 = 20, 10 ⬤ 4 = ?",
                timeLimit: 100
            },
            {
                id: "hard_11",
                question: "다음 수열의 규칙은?",
                type: "수리논리",
                difficulty: 3,
                options: ["36", "49", "64", "81"],
                correct: 0,
                explanation: "1², 2², 3², 4², 5², 6² = 1, 4, 9, 16, 25, 36",
                questionText: "1, 4, 9, 16, 25, ___",
                timeLimit: 100
            },
            {
                id: "hard_12",
                question: "다음 중 다른 숫자는? (약수 종류 기준)",
                type: "수리논리",
                difficulty: 3,
                options: ["21", "28", "36", "45", "49"],
                correct: 4,
                explanation: "49는 완전제곱수(7²)이지만 나머지는 아닙니다.",
                questionText: "21, 28, 36, 45, 49",
                timeLimit: 100
            },
            {
                id: "hard_13",
                question: "암호 규칙을 찾아라",
                type: "논리추론",
                difficulty: 3,
                options: ["21", "24", "27", "30"],
                correct: 0,
                explanation: "규칙: (a + b) × 3 + 1 → (6 + 3) × 3 - 6 = 21",
                questionText: "(3,5) → 16, (4,2) → 12, (6,3) → ?",
                timeLimit: 100
            },
            {
                id: "hard_14",
                question: "수열의 다음 값은?",
                type: "수리논리",
                difficulty: 3,
                options: ["95", "97", "99", "101"],
                correct: 0,
                explanation: "5, 11, 23, 47, 95 - 각 항은 이전 항의 2배에서 1을 뺀 값입니다.",
                questionText: "5, 11, 23, 47, ___",
                timeLimit: 100
            },
            {
                id: "hard_15",
                question: "규칙을 찾고 빈칸 채우기",
                type: "수리논리",
                difficulty: 3,
                options: ["24", "25", "26", "27"],
                correct: 0,
                explanation: "×3 규칙: 8 × 3 = 24",
                questionText: "10 → 30, 7 → 21, 4 → 12, 8 → ___",
                timeLimit: 100
            },
            {
                id: "hard_16",
                question: "다음 수열의 규칙은?",
                type: "수리논리",
                difficulty: 3,
                options: ["720", "840", "960", "1080"],
                correct: 0,
                explanation: "1!, 2!, 3!, 4!, 5!, 6! = 1, 2, 6, 24, 120, 720 (팩토리얼)",
                questionText: "1, 2, 6, 24, 120, ___",
                timeLimit: 100
            },
            {
                id: "hard_17",
                question: "다음 문장 중 논리 오류가 있는 것은?",
                type: "논리추론",
                difficulty: 3,
                options: [
                    "모든 포유류는 동물이다",
                    "고양이는 포유류다",
                    "그러므로 고양이는 동물이 아니다",
                    "위의 추론에는 오류가 없다"
                ],
                correct: 2,
                explanation: "앞의 두 전제가 참이면 고양이는 동물이어야 하므로 결론이 논리적으로 틀렸습니다.",
                timeLimit: 100
            },
            {
                id: "hard_18",
                question: "다음 알파벳 시퀀스의 다음 글자는?",
                type: "패턴인식",
                difficulty: 3,
                options: ["U", "V", "W", "X"],
                correct: 0,
                explanation: "A, C, F, J, O, U - 증가폭이 +2, +3, +4, +5, +6 순으로 커집니다.",
                questionText: "A, C, F, J, O, ___",
                timeLimit: 100
            },
            {
                id: "hard_19",
                question: "의미적으로 다른 하나는?",
                type: "언어추론",
                difficulty: 3,
                options: ["강도", "견고함", "단단함", "철"],
                correct: 3,
                explanation: "강도, 견고함, 단단함은 추상적 성질이지만, 철은 구체적 물질입니다.",
                timeLimit: 100
            },
            {
                id: "hard_20",
                question: "언어 패턴 문제: 다음 조합 중 패턴이 다른 것은?",
                type: "언어추론",
                difficulty: 3,
                options: ["물-바다", "불-열", "빛-전기", "사람-하늘"],
                correct: 3,
                explanation: "물-바다, 불-열, 빛-전기는 모두 관련된 조합이지만, 사람-하늘은 관련성이 없습니다.",
                timeLimit: 100
            },
            {
                id: "hard_21",
                question: "다음 문장 중 참인 것은?",
                type: "논리추론",
                difficulty: 3,
                options: [
                    "모든 새는 날 수 있다",
                    "펭귄은 새다",
                    "일부 새는 날지 못한다",
                    "그러므로 새는 모두 난다"
                ],
                correct: 2,
                explanation: "펭귄은 새이지만 날지 못하므로, 일부 새는 날지 못한다가 참입니다.",
                timeLimit: 100
            },
            {
                id: "hard_22",
                question: "다음 암호 규칙을 해독하라",
                type: "논리추론",
                difficulty: 3,
                options: ["L6", "M7", "N8", "O9"],
                correct: 0,
                explanation: "알파벳 2칸 증가, 숫자 2 증가: J4 → L6",
                questionText: "A1 → C3, D2 → F4, G3 → I5, J4 → ___",
                timeLimit: 100
            },
            {
                id: "hard_23",
                question: "다음 단어들의 공통점은?",
                type: "언어추론",
                difficulty: 3,
                options: ["물의 상태", "날씨 현상", "증발 과정", "인간이 만든 것"],
                correct: 1,
                explanation: "구름, 비, 안개, 눈은 모두 날씨 현상입니다.",
                questionText: "구름, 비, 안개, 눈",
                timeLimit: 100
            },
            {
                id: "hard_24",
                question: "고난도 논리 문제: 누가 진실을 말하고 있을까?",
                type: "논리추론",
                difficulty: 3,
                options: ["A", "B", "C", "아무도 없다"],
                correct: 2,
                explanation: "C가 진실을 말합니다. C가 참이면 A와 B가 거짓말하고 있고, 이는 A와 B의 발언과 일치합니다.",
                questionText: "A: 'B가 거짓말을 하고 있다', B: 'C가 거짓말을 하고 있다', C: 'A와 B 둘 다 거짓말 중이다'",
                timeLimit: 100
            }
        ]
    }
};