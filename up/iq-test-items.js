/**
 * IRT 기반 IQ 테스트 문제 데이터베이스
 * 
 * 문항 모수 설명:
 * - a (변별도): 0.8 ~ 2.5 (높을수록 능력 구분력 높음)
 * - b (난이도): -2.5 ~ +2.5 (높을수록 어려움)
 * - c (추측): 0.25 (4지선다 기준)
 * 
 * 난이도 등급:
 * - 매우 쉬움: b = -2.0 ~ -1.5
 * - 쉬움: b = -1.0 ~ -0.5
 * - 보통: b = -0.5 ~ +0.5
 * - 어려움: b = +0.5 ~ +1.5
 * - 매우 어려움: b = +1.5 ~ +2.0
 * - 최고난도: b = +2.0 ~ +2.5
 */

const IQ_TEST_ITEMS = {
    
    // ═══════════════════════════════════════════════════════════════
    // 영역 1: 패턴 인식 (Pattern Recognition)
    // 시각적 패턴과 규칙을 인식하고 예측하는 능력
    // ═══════════════════════════════════════════════════════════════
    
    pattern: [
        // === 매우 쉬움 (b: -2.0 ~ -1.5) ===
        {
            id: "PAT001",
            domain: "pattern",
            pirti: { a: 1.0, b: -2.0, c: 0.25 },
            difficulty: "very_easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["●", "●", "●", "●", "●", "●", "●", "●", "?"],
            options: ["●", "○", "■", "▲"],
            answer: 0,
            explanation: {
                ko: "모든 칸이 동일한 패턴입니다.",
                en: "All cells have the same pattern."
            }
        },
        {
            id: "PAT002",
            irt: { a: 1.0, b: -1.8, c: 0.25 },
            domain: "pattern",
            difficulty: "very_easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "2", "3", "1", "2", "3", "1", "2", "?"],
            options: ["1", "2", "3", "4"],
            answer: 2,
            explanation: {
                ko: "1, 2, 3이 반복되는 패턴입니다.",
                en: "Pattern repeats 1, 2, 3."
            }
        },
        {
            id: "PAT003",
            irt: { a: 1.1, b: -1.5, c: 0.25 },
            domain: "pattern",
            difficulty: "very_easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["A", "A", "A", "B", "B", "B", "C", "C", "?"],
            options: ["A", "B", "C", "D"],
            answer: 2,
            explanation: {
                ko: "각 행이 같은 알파벳으로 구성됩니다.",
                en: "Each row has the same letter."
            }
        },
        
        // === 쉬움 (b: -1.0 ~ -0.5) ===
        {
            id: "PAT004",
            irt: { a: 1.2, b: -1.0, c: 0.25 },
            domain: "pattern",
            difficulty: "easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "2", "3", "4", "5", "6", "7", "8", "?"],
            options: ["9", "10", "0", "7"],
            answer: 0,
            explanation: {
                ko: "1부터 9까지 순차적으로 증가합니다.",
                en: "Numbers increase sequentially from 1 to 9."
            }
        },
        {
            id: "PAT005",
            irt: { a: 1.2, b: -0.8, c: 0.25 },
            domain: "pattern",
            difficulty: "easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["●", "●●", "●●●", "■", "■■", "■■■", "▲", "▲▲", "?"],
            options: ["▲", "▲▲▲", "■■■", "●●●"],
            answer: 1,
            explanation: {
                ko: "각 행에서 도형이 1개, 2개, 3개로 증가합니다.",
                en: "Each row increases from 1 to 3 shapes."
            }
        },
        {
            id: "PAT006",
            irt: { a: 1.3, b: -0.5, c: 0.25 },
            domain: "pattern",
            difficulty: "easy",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["A", "B", "C", "D", "E", "F", "G", "H", "?"],
            options: ["I", "J", "G", "A"],
            answer: 0,
            explanation: {
                ko: "알파벳 순서대로 진행됩니다.",
                en: "Letters follow alphabetical order."
            }
        },
        
        // === 보통 (b: -0.5 ~ +0.5) ===
        {
            id: "PAT007",
            irt: { a: 1.5, b: 0.0, c: 0.25 },
            domain: "pattern",
            difficulty: "medium",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["2", "4", "6", "3", "6", "9", "4", "8", "?"],
            options: ["10", "12", "14", "16"],
            answer: 1,
            explanation: {
                ko: "각 행은 첫 번째 숫자의 1배, 2배, 3배입니다. 4×3=12",
                en: "Each row is 1x, 2x, 3x of first number. 4×3=12"
            }
        },
        {
            id: "PAT008",
            irt: { a: 1.5, b: 0.2, c: 0.25 },
            domain: "pattern",
            difficulty: "medium",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["○", "◐", "●", "□", "◧", "■", "△", "◮", "?"],
            options: ["△", "▲", "◮", "○"],
            answer: 1,
            explanation: {
                ko: "각 행에서 도형이 점점 채워집니다. 빈→반→가득",
                en: "Each row fills progressively: empty→half→full"
            }
        },
        {
            id: "PAT009",
            irt: { a: 1.5, b: 0.3, c: 0.25 },
            domain: "pattern",
            difficulty: "medium",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["🔴", "🔵", "🟢", "🔵", "🟢", "🔴", "🟢", "🔴", "?"],
            options: ["🔴", "🔵", "🟢", "🟡"],
            answer: 1,
            explanation: {
                ko: "각 행에서 빨강, 파랑, 초록이 순환합니다.",
                en: "Red, blue, green rotate in each row."
            }
        },
        {
            id: "PAT010",
            irt: { a: 1.6, b: 0.5, c: 0.25 },
            domain: "pattern",
            difficulty: "medium",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["A", "C", "E", "B", "D", "F", "C", "E", "?"],
            options: ["F", "G", "H", "I"],
            answer: 1,
            explanation: {
                ko: "각 행은 하나씩 건너뛰는 알파벳이며, 다음 행은 한 칸 뒤에서 시작합니다.",
                en: "Each row skips one letter, next row starts one position later."
            }
        },
        
        // === 어려움 (b: +0.5 ~ +1.5) ===
        {
            id: "PAT011",
            irt: { a: 1.8, b: 1.0, c: 0.25 },
            domain: "pattern",
            difficulty: "hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "1", "1", "2", "4", "8", "3", "9", "?"],
            options: ["12", "18", "27", "36"],
            answer: 2,
            explanation: {
                ko: "각 행은 n^0, n^1, n^2 형태입니다. 3^2=27",
                en: "Each row follows n^0, n^1, n^2. 3^2=27"
            }
        },
        {
            id: "PAT012",
            irt: { a: 1.8, b: 1.2, c: 0.25 },
            domain: "pattern",
            difficulty: "hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["2", "3", "6", "4", "5", "20", "6", "7", "?"],
            options: ["13", "36", "42", "48"],
            answer: 2,
            explanation: {
                ko: "각 행에서 첫 번째 × 두 번째 = 세 번째. 6×7=42",
                en: "First × Second = Third in each row. 6×7=42"
            }
        },
        {
            id: "PAT013",
            irt: { a: 1.9, b: 1.3, c: 0.25 },
            domain: "pattern",
            difficulty: "hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "2", "3", "4", "5", "9", "5", "7", "?"],
            options: ["10", "11", "12", "14"],
            answer: 2,
            explanation: {
                ko: "각 행에서 첫 번째 + 두 번째 = 세 번째. 5+7=12",
                en: "First + Second = Third in each row. 5+7=12"
            }
        },
        {
            id: "PAT014",
            irt: { a: 1.9, b: 1.5, c: 0.25 },
            domain: "pattern",
            difficulty: "hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["A1", "B2", "C3", "D4", "E5", "F6", "G7", "H8", "?"],
            options: ["I9", "J9", "I10", "J10"],
            answer: 0,
            explanation: {
                ko: "알파벳과 숫자가 함께 1씩 증가합니다.",
                en: "Letters and numbers both increase by 1."
            }
        },
        
        // === 매우 어려움 (b: +1.5 ~ +2.0) ===
        {
            id: "PAT015",
            irt: { a: 2.0, b: 1.8, c: 0.25 },
            domain: "pattern",
            difficulty: "very_hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["2", "4", "8", "3", "9", "27", "4", "16", "?"],
            options: ["32", "48", "64", "256"],
            answer: 2,
            explanation: {
                ko: "각 행은 n^1, n^2, n^3 형태입니다. 4^3=64",
                en: "Each row follows n^1, n^2, n^3. 4^3=64"
            }
        },
        {
            id: "PAT016",
            irt: { a: 2.0, b: 1.9, c: 0.25 },
            domain: "pattern",
            difficulty: "very_hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "8", "27", "64", "125", "216", "343", "512", "?"],
            options: ["625", "729", "1000", "1024"],
            answer: 1,
            explanation: {
                ko: "1³, 2³, 3³... 9³=729",
                en: "1³, 2³, 3³... 9³=729"
            }
        },
        {
            id: "PAT017",
            irt: { a: 2.1, b: 2.0, c: 0.25 },
            domain: "pattern",
            difficulty: "very_hard",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "3", "6", "2", "5", "9", "4", "8", "?"],
            options: ["10", "12", "13", "15"],
            answer: 2,
            explanation: {
                ko: "대각선 방향으로 2씩 증가. 왼쪽 위에서 오른쪽 아래로: 1,5,13",
                en: "Diagonal pattern increases by specific amounts."
            }
        },
        
        // === 최고난도 (b: +2.0 ~ +2.5) ===
        {
            id: "PAT018",
            irt: { a: 2.2, b: 2.3, c: 0.25 },
            domain: "pattern",
            difficulty: "extreme",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["2", "6", "18", "4", "12", "36", "8", "24", "?"],
            options: ["48", "64", "72", "96"],
            answer: 2,
            explanation: {
                ko: "각 행은 n, n×3, n×9. 8×9=72. 또는 첫 열이 2배씩, 열 간 3배씩.",
                en: "Each row: n, n×3, n×9. 8×9=72"
            }
        },
        {
            id: "PAT019",
            irt: { a: 2.2, b: 2.4, c: 0.25 },
            domain: "pattern",
            difficulty: "extreme",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "4", "9", "16", "25", "36", "49", "64", "?"],
            options: ["72", "81", "100", "121"],
            answer: 1,
            explanation: {
                ko: "1², 2², 3²... 9²=81 (제곱수)",
                en: "1², 2², 3²... 9²=81 (perfect squares)"
            }
        },
        {
            id: "PAT020",
            irt: { a: 2.3, b: 2.5, c: 0.25 },
            domain: "pattern",
            difficulty: "extreme",
            type: "matrix",
            question: {
                ko: "규칙을 찾아 ? 에 들어갈 것을 고르세요.",
                en: "Find the pattern and select what goes in ?"
            },
            matrix: ["1", "1", "2", "3", "5", "8", "13", "21", "?"],
            options: ["29", "32", "34", "36"],
            answer: 2,
            explanation: {
                ko: "피보나치 수열: 앞 두 수의 합이 다음 수. 13+21=34",
                en: "Fibonacci: sum of previous two. 13+21=34"
            }
        }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // 영역 2: 수리 추론 (Numerical Reasoning)
    // 수학적 관계와 수열 패턴을 파악하는 능력
    // ═══════════════════════════════════════════════════════════════
    
    numerical: [
        // === 매우 쉬움 ===
        {
            id: "NUM001",
            irt: { a: 1.0, b: -2.0, c: 0.25 },
            domain: "numerical",
            difficulty: "very_easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 2, 3, 4, ?",
                en: "Find the next term: 1, 2, 3, 4, ?"
            },
            sequence: [1, 2, 3, 4, "?"],
            options: ["5", "6", "4", "3"],
            answer: 0,
            explanation: {
                ko: "1씩 증가하는 등차수열입니다.",
                en: "Arithmetic sequence increasing by 1."
            }
        },
        {
            id: "NUM002",
            irt: { a: 1.0, b: -1.8, c: 0.25 },
            domain: "numerical",
            difficulty: "very_easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 4, 6, 8, ?",
                en: "Find the next term: 2, 4, 6, 8, ?"
            },
            sequence: [2, 4, 6, 8, "?"],
            options: ["9", "10", "11", "12"],
            answer: 1,
            explanation: {
                ko: "2씩 증가하는 등차수열입니다.",
                en: "Arithmetic sequence increasing by 2."
            }
        },
        {
            id: "NUM003",
            irt: { a: 1.1, b: -1.5, c: 0.25 },
            domain: "numerical",
            difficulty: "very_easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 10, 20, 30, 40, ?",
                en: "Find the next term: 10, 20, 30, 40, ?"
            },
            sequence: [10, 20, 30, 40, "?"],
            options: ["45", "50", "55", "60"],
            answer: 1,
            explanation: {
                ko: "10씩 증가하는 등차수열입니다.",
                en: "Arithmetic sequence increasing by 10."
            }
        },
        
        // === 쉬움 ===
        {
            id: "NUM004",
            irt: { a: 1.2, b: -1.0, c: 0.25 },
            domain: "numerical",
            difficulty: "easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 5, 10, 15, 20, ?",
                en: "Find the next term: 5, 10, 15, 20, ?"
            },
            sequence: [5, 10, 15, 20, "?"],
            options: ["22", "25", "30", "35"],
            answer: 1,
            explanation: {
                ko: "5씩 증가하는 등차수열입니다.",
                en: "Arithmetic sequence increasing by 5."
            }
        },
        {
            id: "NUM005",
            irt: { a: 1.3, b: -0.7, c: 0.25 },
            domain: "numerical",
            difficulty: "easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 4, 8, 16, ?",
                en: "Find the next term: 2, 4, 8, 16, ?"
            },
            sequence: [2, 4, 8, 16, "?"],
            options: ["24", "32", "30", "20"],
            answer: 1,
            explanation: {
                ko: "2배씩 증가하는 등비수열입니다.",
                en: "Geometric sequence multiplying by 2."
            }
        },
        {
            id: "NUM006",
            irt: { a: 1.3, b: -0.5, c: 0.25 },
            domain: "numerical",
            difficulty: "easy",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 100, 90, 80, 70, ?",
                en: "Find the next term: 100, 90, 80, 70, ?"
            },
            sequence: [100, 90, 80, 70, "?"],
            options: ["50", "55", "60", "65"],
            answer: 2,
            explanation: {
                ko: "10씩 감소하는 등차수열입니다.",
                en: "Arithmetic sequence decreasing by 10."
            }
        },
        
        // === 보통 ===
        {
            id: "NUM007",
            irt: { a: 1.5, b: 0.0, c: 0.25 },
            domain: "numerical",
            difficulty: "medium",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 1, 2, 3, 5, 8, ?",
                en: "Find the next term: 1, 1, 2, 3, 5, 8, ?"
            },
            sequence: [1, 1, 2, 3, 5, 8, "?"],
            options: ["11", "12", "13", "15"],
            answer: 2,
            explanation: {
                ko: "피보나치 수열입니다. 5+8=13",
                en: "Fibonacci sequence. 5+8=13"
            }
        },
        {
            id: "NUM008",
            irt: { a: 1.5, b: 0.2, c: 0.25 },
            domain: "numerical",
            difficulty: "medium",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 3, 6, 12, 24, ?",
                en: "Find the next term: 3, 6, 12, 24, ?"
            },
            sequence: [3, 6, 12, 24, "?"],
            options: ["36", "48", "30", "42"],
            answer: 1,
            explanation: {
                ko: "2배씩 증가하는 등비수열입니다. 24×2=48",
                en: "Geometric sequence ×2. 24×2=48"
            }
        },
        {
            id: "NUM009",
            irt: { a: 1.6, b: 0.4, c: 0.25 },
            domain: "numerical",
            difficulty: "medium",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 4, 9, 16, 25, ?",
                en: "Find the next term: 1, 4, 9, 16, 25, ?"
            },
            sequence: [1, 4, 9, 16, 25, "?"],
            options: ["30", "35", "36", "49"],
            answer: 2,
            explanation: {
                ko: "제곱수 수열입니다. 6²=36",
                en: "Perfect squares. 6²=36"
            }
        },
        {
            id: "NUM010",
            irt: { a: 1.6, b: 0.5, c: 0.25 },
            domain: "numerical",
            difficulty: "medium",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 6, 12, 20, 30, ?",
                en: "Find the next term: 2, 6, 12, 20, 30, ?"
            },
            sequence: [2, 6, 12, 20, 30, "?"],
            options: ["40", "42", "44", "56"],
            answer: 1,
            explanation: {
                ko: "차이가 4, 6, 8, 10, 12로 증가합니다. 30+12=42",
                en: "Differences: 4, 6, 8, 10, 12. 30+12=42"
            }
        },
        
        // === 어려움 ===
        {
            id: "NUM011",
            irt: { a: 1.8, b: 1.0, c: 0.25 },
            domain: "numerical",
            difficulty: "hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 3, 6, 10, 15, ?",
                en: "Find the next term: 1, 3, 6, 10, 15, ?"
            },
            sequence: [1, 3, 6, 10, 15, "?"],
            options: ["18", "20", "21", "25"],
            answer: 2,
            explanation: {
                ko: "삼각수 수열입니다. n(n+1)/2. 6×7/2=21",
                en: "Triangular numbers. n(n+1)/2. 6×7/2=21"
            }
        },
        {
            id: "NUM012",
            irt: { a: 1.8, b: 1.2, c: 0.25 },
            domain: "numerical",
            difficulty: "hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 3, 5, 7, 11, 13, ?",
                en: "Find the next term: 2, 3, 5, 7, 11, 13, ?"
            },
            sequence: [2, 3, 5, 7, 11, 13, "?"],
            options: ["15", "17", "19", "21"],
            answer: 1,
            explanation: {
                ko: "소수(Prime) 수열입니다. 다음 소수는 17",
                en: "Prime numbers. Next prime is 17"
            }
        },
        {
            id: "NUM013",
            irt: { a: 1.9, b: 1.4, c: 0.25 },
            domain: "numerical",
            difficulty: "hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 3, 5, 8, 12, 17, ?",
                en: "Find the next term: 2, 3, 5, 8, 12, 17, ?"
            },
            sequence: [2, 3, 5, 8, 12, 17, "?"],
            options: ["22", "23", "24", "25"],
            answer: 1,
            explanation: {
                ko: "차이가 1, 2, 3, 4, 5, 6으로 증가. 17+6=23",
                en: "Differences: 1, 2, 3, 4, 5, 6. 17+6=23"
            }
        },
        {
            id: "NUM014",
            irt: { a: 1.9, b: 1.5, c: 0.25 },
            domain: "numerical",
            difficulty: "hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 2, 6, 24, 120, ?",
                en: "Find the next term: 1, 2, 6, 24, 120, ?"
            },
            sequence: [1, 2, 6, 24, 120, "?"],
            options: ["240", "480", "720", "840"],
            answer: 2,
            explanation: {
                ko: "팩토리얼 수열 (n!). 6!=720",
                en: "Factorial sequence. 6!=720"
            }
        },
        
        // === 매우 어려움 ===
        {
            id: "NUM015",
            irt: { a: 2.0, b: 1.8, c: 0.25 },
            domain: "numerical",
            difficulty: "very_hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 4, 27, 256, ?",
                en: "Find the next term: 1, 4, 27, 256, ?"
            },
            sequence: [1, 4, 27, 256, "?"],
            options: ["625", "1024", "3125", "4096"],
            answer: 2,
            explanation: {
                ko: "n^n 수열입니다. 5^5=3125",
                en: "n^n sequence. 5^5=3125"
            }
        },
        {
            id: "NUM016",
            irt: { a: 2.0, b: 1.9, c: 0.25 },
            domain: "numerical",
            difficulty: "very_hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 0, 1, 1, 2, 4, 7, 13, ?",
                en: "Find the next term: 0, 1, 1, 2, 4, 7, 13, ?"
            },
            sequence: [0, 1, 1, 2, 4, 7, 13, "?"],
            options: ["20", "22", "24", "26"],
            answer: 2,
            explanation: {
                ko: "트리보나치: 앞 세 수의 합. 2+7+13=22? 아니, 4+7+13=24",
                en: "Tribonacci: sum of previous three. 4+7+13=24"
            }
        },
        {
            id: "NUM017",
            irt: { a: 2.1, b: 2.0, c: 0.25 },
            domain: "numerical",
            difficulty: "very_hard",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 1, 2, 3, 5, 8, 13, 21, ?",
                en: "Find the next term: 1, 1, 2, 3, 5, 8, 13, 21, ?"
            },
            sequence: [1, 1, 2, 3, 5, 8, 13, 21, "?"],
            options: ["29", "34", "36", "42"],
            answer: 1,
            explanation: {
                ko: "피보나치 수열. 13+21=34",
                en: "Fibonacci. 13+21=34"
            }
        },
        
        // === 최고난도 ===
        {
            id: "NUM018",
            irt: { a: 2.2, b: 2.2, c: 0.25 },
            domain: "numerical",
            difficulty: "extreme",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 5, 11, 23, 47, ?",
                en: "Find the next term: 2, 5, 11, 23, 47, ?"
            },
            sequence: [2, 5, 11, 23, 47, "?"],
            options: ["71", "89", "95", "99"],
            answer: 2,
            explanation: {
                ko: "각 항은 2배 + 1. 47×2+1=95",
                en: "Each term is 2x + 1. 47×2+1=95"
            }
        },
        {
            id: "NUM019",
            irt: { a: 2.2, b: 2.4, c: 0.25 },
            domain: "numerical",
            difficulty: "extreme",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 1, 2, 5, 14, 41, ?",
                en: "Find the next term: 1, 2, 5, 14, 41, ?"
            },
            sequence: [1, 2, 5, 14, 41, "?"],
            options: ["100", "114", "122", "130"],
            answer: 2,
            explanation: {
                ko: "각 항은 3배 - 1. 41×3-1=122",
                en: "Each term is 3x - 1. 41×3-1=122"
            }
        },
        {
            id: "NUM020",
            irt: { a: 2.3, b: 2.5, c: 0.25 },
            domain: "numerical",
            difficulty: "extreme",
            type: "sequence",
            question: {
                ko: "수열의 다음 항을 구하세요: 2, 3, 5, 9, 17, 33, ?",
                en: "Find the next term: 2, 3, 5, 9, 17, 33, ?"
            },
            sequence: [2, 3, 5, 9, 17, 33, "?"],
            options: ["49", "57", "65", "73"],
            answer: 2,
            explanation: {
                ko: "차이가 1, 2, 4, 8, 16, 32 (2의 거듭제곱). 33+32=65",
                en: "Differences are powers of 2. 33+32=65"
            }
        }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // 영역 3: 공간 지각 (Spatial Perception)
    // 공간에서 물체의 관계와 변환을 이해하는 능력
    // ═══════════════════════════════════════════════════════════════
    
    spatial: [
        // === 매우 쉬움 ===
        {
            id: "SPA001",
            irt: { a: 1.0, b: -2.0, c: 0.25 },
            domain: "spatial",
            difficulty: "very_easy",
            type: "rotation",
            question: {
                ko: "화살표 → 를 180° 회전하면?",
                en: "Rotate → by 180°?"
            },
            visual: "→",
            options: ["→", "←", "↑", "↓"],
            answer: 1,
            explanation: {
                ko: "180° 회전하면 반대 방향을 가리킵니다.",
                en: "180° rotation points to opposite direction."
            }
        },
        {
            id: "SPA002",
            irt: { a: 1.0, b: -1.8, c: 0.25 },
            domain: "spatial",
            difficulty: "very_easy",
            type: "rotation",
            question: {
                ko: "화살표 ↑ 를 시계방향 90° 회전하면?",
                en: "Rotate ↑ clockwise 90°?"
            },
            visual: "↑",
            options: ["←", "→", "↑", "↓"],
            answer: 1,
            explanation: {
                ko: "시계방향 90°는 오른쪽을 가리킵니다.",
                en: "Clockwise 90° points right."
            }
        },
        {
            id: "SPA003",
            irt: { a: 1.1, b: -1.5, c: 0.25 },
            domain: "spatial",
            difficulty: "very_easy",
            type: "mirror",
            question: {
                ko: "정사각형 ■ 을 거울에 비추면?",
                en: "Mirror image of ■?"
            },
            visual: "■",
            options: ["■", "▣", "□", "◆"],
            answer: 0,
            explanation: {
                ko: "정사각형은 대칭이므로 거울상도 동일합니다.",
                en: "Square is symmetric, mirror image is same."
            }
        },
        
        // === 쉬움 ===
        {
            id: "SPA004",
            irt: { a: 1.2, b: -1.0, c: 0.25 },
            domain: "spatial",
            difficulty: "easy",
            type: "rotation",
            question: {
                ko: "┘ 를 시계방향 90° 회전하면?",
                en: "Rotate ┘ clockwise 90°?"
            },
            visual: "┘",
            options: ["└", "┐", "┌", "─"],
            answer: 0,
            explanation: {
                ko: "┘가 시계방향 90° 회전하면 └가 됩니다.",
                en: "┘ rotated 90° clockwise becomes └"
            }
        },
        {
            id: "SPA005",
            irt: { a: 1.2, b: -0.7, c: 0.25 },
            domain: "spatial",
            difficulty: "easy",
            type: "mirror",
            question: {
                ko: "숫자 '3'을 거울에 비추면?",
                en: "Mirror image of '3'?"
            },
            visual: "3",
            options: ["3", "Ɛ", "E", "ε"],
            answer: 1,
            explanation: {
                ko: "3의 거울상은 좌우가 반전된 Ɛ입니다.",
                en: "Mirror of 3 is horizontally flipped Ɛ."
            }
        },
        {
            id: "SPA006",
            irt: { a: 1.3, b: -0.5, c: 0.25 },
            domain: "spatial",
            difficulty: "easy",
            type: "rotation",
            question: {
                ko: "L자를 시계방향 90° 회전하면?",
                en: "Rotate L clockwise 90°?"
            },
            visual: "L",
            options: ["⌐", "⌙", "Γ", "⌐"],
            answer: 2,
            explanation: {
                ko: "L을 시계방향 90° 회전하면 Γ 형태가 됩니다.",
                en: "L rotated 90° clockwise becomes Γ shape."
            }
        },
        
        // === 보통 ===
        {
            id: "SPA007",
            irt: { a: 1.5, b: 0.0, c: 0.25 },
            domain: "spatial",
            difficulty: "medium",
            type: "cube",
            question: {
                ko: "주사위에서 1의 맞은편 면의 숫자는? (1-6, 2-5, 3-4가 마주봄)",
                en: "What number is opposite to 1 on a die? (1-6, 2-5, 3-4 are opposite)"
            },
            options: ["2", "4", "5", "6"],
            answer: 3,
            explanation: {
                ko: "표준 주사위에서 1과 6이 마주봅니다.",
                en: "On standard die, 1 and 6 are opposite."
            }
        },
        {
            id: "SPA008",
            irt: { a: 1.5, b: 0.2, c: 0.25 },
            domain: "spatial",
            difficulty: "medium",
            type: "rotation",
            question: {
                ko: "왼쪽 위에 점이 있는 정사각형을 180° 회전하면 점은 어디에?",
                en: "Square with dot at top-left, rotated 180°. Where is dot?"
            },
            visual: "◰",
            options: {
                ko: ["왼쪽 위", "오른쪽 위", "왼쪽 아래", "오른쪽 아래"],
                en: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]
            },
            answer: 3,
            explanation: {
                ko: "180° 회전하면 대각선 반대 위치로 이동합니다.",
                en: "180° rotation moves to diagonal opposite."
            }
        },
        {
            id: "SPA009",
            irt: { a: 1.6, b: 0.4, c: 0.25 },
            domain: "spatial",
            difficulty: "medium",
            type: "folding",
            question: {
                ko: "정사각형 종이를 반으로 접으면 어떤 모양?",
                en: "Fold square paper in half. What shape?"
            },
            options: {
                ko: ["정사각형", "직사각형", "삼각형", "마름모"],
                en: ["Square", "Rectangle", "Triangle", "Rhombus"]
            },
            answer: 1,
            explanation: {
                ko: "정사각형을 반으로 접으면 직사각형이 됩니다.",
                en: "Square folded in half becomes rectangle."
            }
        },
        {
            id: "SPA010",
            irt: { a: 1.6, b: 0.5, c: 0.25 },
            domain: "spatial",
            difficulty: "medium",
            type: "mirror",
            question: {
                ko: "'b'를 거울에 비추면?",
                en: "Mirror image of 'b'?"
            },
            visual: "b",
            options: ["b", "d", "p", "q"],
            answer: 1,
            explanation: {
                ko: "b의 좌우 반전은 d입니다.",
                en: "Horizontal flip of b is d."
            }
        },
        
        // === 어려움 ===
        {
            id: "SPA011",
            irt: { a: 1.8, b: 1.0, c: 0.25 },
            domain: "spatial",
            difficulty: "hard",
            type: "construction",
            question: {
                ko: "직각삼각형 2개로 만들 수 있는 도형은?",
                en: "What shape can 2 right triangles make?"
            },
            options: {
                ko: ["정삼각형만", "직사각형만", "정삼각형 또는 직사각형", "평행사변형만"],
                en: ["Only equilateral", "Only rectangle", "Equilateral or rectangle", "Only parallelogram"]
            },
            answer: 2,
            explanation: {
                ko: "배치에 따라 정삼각형 또는 직사각형을 만들 수 있습니다.",
                en: "Depending on arrangement, can make both."
            }
        },
        {
            id: "SPA012",
            irt: { a: 1.8, b: 1.2, c: 0.25 },
            domain: "spatial",
            difficulty: "hard",
            type: "cube",
            question: {
                ko: "정육면체 전개도에서 특정 면을 접었을 때 맞닿는 면을 찾으세요. 십자형 전개도에서 가운데 면의 맞은편은?",
                en: "In cube net, which face is opposite to center face of cross-shaped net?"
            },
            visual: "십자형 전개도",
            options: {
                ko: ["위쪽 면", "아래쪽 면", "없음(자기자신)", "왼쪽 면"],
                en: ["Top face", "Bottom face", "None(itself)", "Left face"]
            },
            answer: 1,
            explanation: {
                ko: "십자형 전개도에서 가운데의 맞은편은 아래쪽입니다.",
                en: "In cross net, center's opposite is bottom."
            }
        },
        {
            id: "SPA013",
            irt: { a: 1.9, b: 1.4, c: 0.25 },
            domain: "spatial",
            difficulty: "hard",
            type: "rotation",
            question: {
                ko: "F를 시계방향 90° 회전 후 좌우 반전하면?",
                en: "Rotate F 90° clockwise then flip horizontally?"
            },
            visual: "F",
            options: ["Ⅎ", "ꟻ", "⌐", "Γ"],
            answer: 0,
            explanation: {
                ko: "F → 90° 회전 → 좌우반전 순서로 변환됩니다.",
                en: "F → 90° rotation → horizontal flip."
            }
        },
        {
            id: "SPA014",
            irt: { a: 1.9, b: 1.5, c: 0.25 },
            domain: "spatial",
            difficulty: "hard",
            type: "cross_section",
            question: {
                ko: "정육면체를 대각선으로 자르면 단면은?",
                en: "Cross-section when cube is cut diagonally?"
            },
            options: {
                ko: ["정삼각형", "정사각형", "직사각형", "정육각형"],
                en: ["Equilateral triangle", "Square", "Rectangle", "Regular hexagon"]
            },
            answer: 3,
            explanation: {
                ko: "정육면체의 공간 대각선 절단면은 정육각형입니다.",
                en: "Space diagonal cut of cube gives regular hexagon."
            }
        },
        
        // === 매우 어려움 ===
        {
            id: "SPA015",
            irt: { a: 2.0, b: 1.8, c: 0.25 },
            domain: "spatial",
            difficulty: "very_hard",
            type: "mental_rotation",
            question: {
                ko: "3D 물체를 X축으로 90°, Y축으로 90° 회전했을 때 원래 위치로 돌아오려면 어떻게 해야 하나요?",
                en: "After rotating 90° on X-axis then 90° on Y-axis, how to return to original?"
            },
            options: {
                ko: ["같은 순서로 역방향 회전", "역순으로 역방향 회전", "Z축 180° 회전", "불가능"],
                en: ["Reverse same order", "Reverse opposite order", "Z-axis 180°", "Impossible"]
            },
            answer: 1,
            explanation: {
                ko: "회전 역순: Y축 -90° → X축 -90°",
                en: "Reverse order: Y-axis -90° → X-axis -90°"
            }
        },
        {
            id: "SPA016",
            irt: { a: 2.0, b: 1.9, c: 0.25 },
            domain: "spatial",
            difficulty: "very_hard",
            type: "volume",
            question: {
                ko: "한 변이 3cm인 정육면체에서 한 변이 1cm인 정육면체를 8개 잘라냈다면 남은 부피는?",
                en: "From 3cm cube, cut out 8 cubes of 1cm each. Remaining volume?"
            },
            options: ["19cm³", "21cm³", "23cm³", "25cm³"],
            answer: 0,
            explanation: {
                ko: "27 - 8 = 19cm³",
                en: "27 - 8 = 19cm³"
            }
        },
        {
            id: "SPA017",
            irt: { a: 2.1, b: 2.0, c: 0.25 },
            domain: "spatial",
            difficulty: "very_hard",
            type: "folding",
            question: {
                ko: "정사각형 종이를 대각선으로 접고, 다시 반으로 접으면 펼쳤을 때 접힌 선은 몇 개?",
                en: "Fold square diagonally, fold in half again. How many fold lines when unfolded?"
            },
            options: ["2개", "3개", "4개", "5개"],
            answer: 1,
            explanation: {
                ko: "대각선 1개 + 반으로 접은 선 2개 = 3개",
                en: "1 diagonal + 2 half-fold lines = 3"
            }
        },
        
        // === 최고난도 ===
        {
            id: "SPA018",
            irt: { a: 2.2, b: 2.2, c: 0.25 },
            domain: "spatial",
            difficulty: "extreme",
            type: "polyhedron",
            question: {
                ko: "정이십면체(icosahedron)의 면의 개수는?",
                en: "How many faces does an icosahedron have?"
            },
            options: ["12", "16", "20", "24"],
            answer: 2,
            explanation: {
                ko: "정이십면체는 이름대로 20개의 정삼각형 면을 가집니다.",
                en: "Icosahedron has 20 triangular faces as its name suggests."
            }
        },
        {
            id: "SPA019",
            irt: { a: 2.2, b: 2.4, c: 0.25 },
            domain: "spatial",
            difficulty: "extreme",
            type: "projection",
            question: {
                ko: "원기둥을 위에서, 앞에서, 옆에서 본 모양은 각각?",
                en: "Top, front, and side views of a cylinder are?"
            },
            options: {
                ko: ["원, 직사각형, 직사각형", "원, 원, 직사각형", "원, 타원, 직사각형", "원, 직사각형, 원"],
                en: ["Circle, rectangle, rectangle", "Circle, circle, rectangle", "Circle, ellipse, rectangle", "Circle, rectangle, circle"]
            },
            answer: 0,
            explanation: {
                ko: "위: 원, 앞/옆: 직사각형",
                en: "Top: circle, Front/Side: rectangle"
            }
        },
        {
            id: "SPA020",
            irt: { a: 2.3, b: 2.5, c: 0.25 },
            domain: "spatial",
            difficulty: "extreme",
            type: "topology",
            question: {
                ko: "도넛(토러스)과 위상동형인 물체는?",
                en: "Which object is topologically equivalent to a torus (donut)?"
            },
            options: {
                ko: ["공", "컵(손잡이 있는)", "접시", "숟가락"],
                en: ["Ball", "Cup (with handle)", "Plate", "Spoon"]
            },
            answer: 1,
            explanation: {
                ko: "손잡이 있는 컵은 구멍이 1개로 토러스와 위상동형입니다.",
                en: "Cup with handle has 1 hole, same as torus."
            }
        }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // 영역 4: 논리 추론 (Logical Reasoning)
    // 논리적 규칙과 관계를 분석하고 결론을 도출하는 능력
    // ═══════════════════════════════════════════════════════════════
    
    logical: [
        // === 매우 쉬움 ===
        {
            id: "LOG001",
            irt: { a: 1.0, b: -2.0, c: 0.25 },
            domain: "logical",
            difficulty: "very_easy",
            type: "comparison",
            question: {
                ko: "A > B 이고 B > C 이면, 가장 큰 것은?",
                en: "If A > B and B > C, which is largest?"
            },
            options: ["A", "B", "C", {ko: "알 수 없음", en: "Unknown"}],
            answer: 0,
            explanation: {
                ko: "A > B > C 이므로 A가 가장 큽니다.",
                en: "A > B > C, so A is largest."
            }
        },
        {
            id: "LOG002",
            irt: { a: 1.0, b: -1.8, c: 0.25 },
            domain: "logical",
            difficulty: "very_easy",
            type: "comparison",
            question: {
                ko: "A < B 이고 B < C 이면, 가장 작은 것은?",
                en: "If A < B and B < C, which is smallest?"
            },
            options: ["A", "B", "C", {ko: "알 수 없음", en: "Unknown"}],
            answer: 0,
            explanation: {
                ko: "A < B < C 이므로 A가 가장 작습니다.",
                en: "A < B < C, so A is smallest."
            }
        },
        {
            id: "LOG003",
            irt: { a: 1.1, b: -1.5, c: 0.25 },
            domain: "logical",
            difficulty: "very_easy",
            type: "syllogism",
            question: {
                ko: "모든 강아지는 동물이다. 바둑이는 강아지다. 참인 것은?",
                en: "All dogs are animals. Baduk is a dog. What is true?"
            },
            options: {
                ko: ["바둑이는 동물이다", "모든 동물은 강아지다", "바둑이는 고양이다", "알 수 없다"],
                en: ["Baduk is an animal", "All animals are dogs", "Baduk is a cat", "Unknown"]
            },
            answer: 0,
            explanation: {
                ko: "강아지 ⊂ 동물, 바둑이 ∈ 강아지 → 바둑이 ∈ 동물",
                en: "Dogs ⊂ Animals, Baduk ∈ Dogs → Baduk ∈ Animals"
            }
        },
        
        // === 쉬움 ===
        {
            id: "LOG004",
            irt: { a: 1.2, b: -1.0, c: 0.25 },
            domain: "logical",
            difficulty: "easy",
            type: "negation",
            question: {
                ko: "'모든 새는 날 수 있다'의 부정은?",
                en: "Negation of 'All birds can fly'?"
            },
            options: {
                ko: ["모든 새는 날 수 없다", "어떤 새는 날 수 없다", "어떤 새는 날 수 있다", "새는 존재하지 않는다"],
                en: ["No birds can fly", "Some birds cannot fly", "Some birds can fly", "Birds don't exist"]
            },
            answer: 1,
            explanation: {
                ko: "'모든 A는 B'의 부정은 '어떤 A는 B가 아님'",
                en: "Negation of 'All A are B' is 'Some A are not B'"
            }
        },
        {
            id: "LOG005",
            irt: { a: 1.2, b: -0.8, c: 0.25 },
            domain: "logical",
            difficulty: "easy",
            type: "conditional",
            question: {
                ko: "'비가 오면 땅이 젖는다'가 참일 때, 반드시 참인 것은?",
                en: "If 'Rain makes ground wet' is true, what must be true?"
            },
            options: {
                ko: ["땅이 젖으면 비가 온다", "비가 안 오면 안 젖는다", "땅이 안 젖으면 비가 안 온다", "항상 비가 온다"],
                en: ["If wet, it rained", "No rain means dry", "If dry, no rain", "It always rains"]
            },
            answer: 2,
            explanation: {
                ko: "대우: P→Q의 대우는 ¬Q→¬P",
                en: "Contrapositive: P→Q equals ¬Q→¬P"
            }
        },
        {
            id: "LOG006",
            irt: { a: 1.3, b: -0.5, c: 0.25 },
            domain: "logical",
            difficulty: "easy",
            type: "comparison",
            question: {
                ko: "A > B, C > A, D < B 일 때, 가장 큰 것은?",
                en: "If A > B, C > A, D < B, which is largest?"
            },
            options: ["A", "B", "C", "D"],
            answer: 2,
            explanation: {
                ko: "C > A > B > D 이므로 C가 가장 큽니다.",
                en: "C > A > B > D, so C is largest."
            }
        },
        
        // === 보통 ===
        {
            id: "LOG007",
            irt: { a: 1.5, b: 0.0, c: 0.25 },
            domain: "logical",
            difficulty: "medium",
            type: "equation",
            question: {
                ko: "x + 5 = 12 일 때, x의 값은?",
                en: "If x + 5 = 12, what is x?"
            },
            options: ["5", "6", "7", "17"],
            answer: 2,
            explanation: {
                ko: "x = 12 - 5 = 7",
                en: "x = 12 - 5 = 7"
            }
        },
        {
            id: "LOG008",
            irt: { a: 1.5, b: 0.2, c: 0.25 },
            domain: "logical",
            difficulty: "medium",
            type: "equation",
            question: {
                ko: "2x + 3 = 11 일 때, x의 값은?",
                en: "If 2x + 3 = 11, what is x?"
            },
            options: ["3", "4", "5", "6"],
            answer: 1,
            explanation: {
                ko: "2x = 8, x = 4",
                en: "2x = 8, x = 4"
            }
        },
        {
            id: "LOG009",
            irt: { a: 1.6, b: 0.4, c: 0.25 },
            domain: "logical",
            difficulty: "medium",
            type: "deduction",
            question: {
                ko: "참이면 거짓이 되고, 거짓이면 참이 되는 문장. 이것은?",
                en: "A statement that's false if true, true if false. This is?"
            },
            options: {
                ko: ["항진명제", "모순명제", "역설", "가정"],
                en: ["Tautology", "Contradiction", "Paradox", "Hypothesis"]
            },
            answer: 2,
            explanation: {
                ko: "자기 참조적 모순은 역설(paradox)입니다.",
                en: "Self-referential contradiction is a paradox."
            }
        },
        {
            id: "LOG010",
            irt: { a: 1.6, b: 0.5, c: 0.25 },
            domain: "logical",
            difficulty: "medium",
            type: "conditional",
            question: {
                ko: "'P이면 Q'가 참이고 'P'가 참일 때, Q는?",
                en: "If 'P implies Q' is true and 'P' is true, what about Q?"
            },
            options: {
                ko: ["반드시 참", "반드시 거짓", "알 수 없음", "때에 따라 다름"],
                en: ["Must be true", "Must be false", "Unknown", "Depends"]
            },
            answer: 0,
            explanation: {
                ko: "전건 긍정(Modus Ponens): P→Q, P ⊢ Q",
                en: "Modus Ponens: P→Q, P ⊢ Q"
            }
        },
        
        // === 어려움 ===
        {
            id: "LOG011",
            irt: { a: 1.8, b: 1.0, c: 0.25 },
            domain: "logical",
            difficulty: "hard",
            type: "equation",
            question: {
                ko: "(x + 5) ÷ 3 = 4 일 때, x의 값은?",
                en: "If (x + 5) ÷ 3 = 4, what is x?"
            },
            options: ["5", "6", "7", "8"],
            answer: 2,
            explanation: {
                ko: "x + 5 = 12, x = 7",
                en: "x + 5 = 12, x = 7"
            }
        },
        {
            id: "LOG012",
            irt: { a: 1.8, b: 1.2, c: 0.25 },
            domain: "logical",
            difficulty: "hard",
            type: "ordering",
            question: {
                ko: "5명이 줄을 섬: A는 맨 앞이 아님, B는 C 바로 뒤, D는 맨 뒤, E는 A 앞. 맨 앞은?",
                en: "5 people in line: A not first, B right behind C, D last, E before A. Who's first?"
            },
            options: ["A", "B", "C", "E"],
            answer: 2,
            explanation: {
                ko: "C-B-E-A-D 또는 C-B-A-E-D 불가(E가 A앞) → E-A 또는 C가 맨앞, C-B구조상 C가 맨앞",
                en: "Given constraints, C must be first."
            }
        },
        {
            id: "LOG013",
            irt: { a: 1.9, b: 1.4, c: 0.25 },
            domain: "logical",
            difficulty: "hard",
            type: "set",
            question: {
                ko: "A, B, C 세 명제 중 정확히 하나만 참. A가 거짓이면?",
                en: "Exactly one of A, B, C is true. If A is false?"
            },
            options: {
                ko: ["B나 C 중 하나가 참", "B와 C 모두 참", "B와 C 모두 거짓", "알 수 없음"],
                en: ["Either B or C is true", "Both B and C true", "Both B and C false", "Unknown"]
            },
            answer: 0,
            explanation: {
                ko: "정확히 하나만 참이므로, A가 거짓이면 B, C 중 하나만 참",
                en: "Exactly one true, A false means exactly one of B,C is true"
            }
        },
        {
            id: "LOG014",
            irt: { a: 1.9, b: 1.5, c: 0.25 },
            domain: "logical",
            difficulty: "hard",
            type: "syllogism",
            question: {
                ko: "모든 P는 Q. 모든 Q는 R. 참인 것은?",
                en: "All P are Q. All Q are R. What is true?"
            },
            options: {
                ko: ["모든 R은 P", "모든 P는 R", "일부 R만 Q", "P와 R은 같음"],
                en: ["All R are P", "All P are R", "Some R are Q", "P equals R"]
            },
            answer: 1,
            explanation: {
                ko: "P ⊂ Q ⊂ R 이므로 P ⊂ R",
                en: "P ⊂ Q ⊂ R means P ⊂ R"
            }
        },
        
        // === 매우 어려움 ===
        {
            id: "LOG015",
            irt: { a: 2.0, b: 1.8, c: 0.25 },
            domain: "logical",
            difficulty: "very_hard",
            type: "knights_knaves",
            question: {
                ko: "진실만 말하는 기사와 거짓만 말하는 악당이 있다. A: 'B는 악당이다.' B: '우리 둘 다 기사다.' A와 B는?",
                en: "Knights tell truth, knaves lie. A: 'B is knave.' B: 'We're both knights.' What are A and B?"
            },
            options: {
                ko: ["둘 다 기사", "둘 다 악당", "A기사 B악당", "A악당 B기사"],
                en: ["Both knights", "Both knaves", "A knight B knave", "A knave B knight"]
            },
            answer: 2,
            explanation: {
                ko: "B가 기사면 둘 다 기사인데 A의 말이 거짓 → 모순. B는 악당. 그럼 A의 말이 참 → A는 기사",
                en: "If B knight, both are knights but A lies → contradiction. B is knave. Then A tells truth → A is knight"
            }
        },
        {
            id: "LOG016",
            irt: { a: 2.0, b: 1.9, c: 0.25 },
            domain: "logical",
            difficulty: "very_hard",
            type: "probability",
            question: {
                ko: "3개의 문 뒤에 1개의 상품. 문 하나 선택 후 진행자가 빈 문 하나를 열었다. 바꾸는 것이 유리한가?",
                en: "3 doors, 1 prize. After choosing, host opens empty door. Should you switch?"
            },
            options: {
                ko: ["바꾸면 유리 (2/3)", "안 바꾸면 유리", "같다 (1/2)", "알 수 없음"],
                en: ["Switch better (2/3)", "Stay better", "Same (1/2)", "Unknown"]
            },
            answer: 0,
            explanation: {
                ko: "몬티 홀 문제: 바꾸면 2/3 확률로 당첨",
                en: "Monty Hall: Switching gives 2/3 probability"
            }
        },
        {
            id: "LOG017",
            irt: { a: 2.1, b: 2.0, c: 0.25 },
            domain: "logical",
            difficulty: "very_hard",
            type: "modal",
            question: {
                ko: "◇P는 'P가 가능하다'. □P는 'P가 필연적이다'. □P이면?",
                en: "◇P means 'P is possible'. □P means 'P is necessary'. If □P then?"
            },
            options: {
                ko: ["◇P도 참", "◇P는 거짓", "¬◇P", "알 수 없음"],
                en: ["◇P is also true", "◇P is false", "¬◇P", "Unknown"]
            },
            answer: 0,
            explanation: {
                ko: "필연적이면 가능하다: □P → ◇P",
                en: "Necessary implies possible: □P → ◇P"
            }
        },
        
        // === 최고난도 ===
        {
            id: "LOG018",
            irt: { a: 2.2, b: 2.2, c: 0.25 },
            domain: "logical",
            difficulty: "extreme",
            type: "self_reference",
            question: {
                ko: "'이 문장은 거짓이다'라는 문장의 진리값은?",
                en: "Truth value of 'This sentence is false'?"
            },
            options: {
                ko: ["참", "거짓", "참도 거짓도 아님", "참이면서 거짓"],
                en: ["True", "False", "Neither", "Both"]
            },
            answer: 2,
            explanation: {
                ko: "거짓말쟁이 역설: 고전 논리에서 진리값을 부여할 수 없음",
                en: "Liar's paradox: Cannot assign truth value in classical logic"
            }
        },
        {
            id: "LOG019",
            irt: { a: 2.2, b: 2.4, c: 0.25 },
            domain: "logical",
            difficulty: "extreme",
            type: "godel",
            question: {
                ko: "괴델의 불완전성 정리가 의미하는 것은?",
                en: "What does Gödel's incompleteness theorem mean?"
            },
            options: {
                ko: ["수학은 불완전하다", "일관된 형식체계에는 증명불가능한 참인 명제가 있다", "모든 명제는 증명가능하다", "논리학은 불필요하다"],
                en: ["Math is incomplete", "Consistent formal systems have unprovable true statements", "All statements are provable", "Logic is unnecessary"]
            },
            answer: 1,
            explanation: {
                ko: "충분히 강력한 일관된 형식체계에는 증명도 반증도 불가능한 참인 명제가 존재",
                en: "Sufficiently powerful consistent systems contain true but unprovable statements"
            }
        },
        {
            id: "LOG020",
            irt: { a: 2.3, b: 2.5, c: 0.25 },
            domain: "logical",
            difficulty: "extreme",
            type: "game_theory",
            question: {
                ko: "죄수의 딜레마에서 두 죄수가 모두 합리적일 때 결과는?",
                en: "In Prisoner's Dilemma, if both prisoners are rational, the outcome is?"
            },
            options: {
                ko: ["둘 다 협력", "둘 다 배신", "한 명만 배신", "무작위"],
                en: ["Both cooperate", "Both defect", "One defects", "Random"]
            },
            answer: 1,
            explanation: {
                ko: "내시 균형: 개별 합리성은 상호 배신으로 이어짐",
                en: "Nash equilibrium: Individual rationality leads to mutual defection"
            }
        }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // 영역 5: 언어 유추 (Verbal Analogies)
    // 언어적 개념 간의 관계를 파악하고 유추하는 능력
    // ═══════════════════════════════════════════════════════════════
    
    verbal: [
        // === 매우 쉬움 ===
        {
            id: "VER001",
            irt: { a: 1.0, b: -2.0, c: 0.25 },
            domain: "verbal",
            difficulty: "very_easy",
            type: "analogy",
            question: {
                ko: "아버지 : 아들 = 어머니 : ?",
                en: "Father : Son = Mother : ?"
            },
            analogy: {
                ko: ["아버지", "아들", "어머니", "?"],
                en: ["Father", "Son", "Mother", "?"]
            },
            options: {
                ko: ["남편", "아버지", "딸", "할머니"],
                en: ["Husband", "Father", "Daughter", "Grandmother"]
            },
            answer: 2,
            explanation: {
                ko: "부모-자녀 관계에서 성별 대응",
                en: "Parent-child relationship with gender correspondence"
            }
        },
        {
            id: "VER002",
            irt: { a: 1.0, b: -1.8, c: 0.25 },
            domain: "verbal",
            difficulty: "very_easy",
            type: "analogy",
            question: {
                ko: "큰 : 작은 = 높은 : ?",
                en: "Big : Small = High : ?"
            },
            analogy: {
                ko: ["큰", "작은", "높은", "?"],
                en: ["Big", "Small", "High", "?"]
            },
            options: {
                ko: ["깊은", "낮은", "멀리", "가까운"],
                en: ["Deep", "Low", "Far", "Near"]
            },
            answer: 1,
            explanation: {
                ko: "반의어 관계",
                en: "Antonym relationship"
            }
        },
        {
            id: "VER003",
            irt: { a: 1.1, b: -1.5, c: 0.25 },
            domain: "verbal",
            difficulty: "very_easy",
            type: "analogy",
            question: {
                ko: "손 : 장갑 = 발 : ?",
                en: "Hand : Glove = Foot : ?"
            },
            analogy: {
                ko: ["손", "장갑", "발", "?"],
                en: ["Hand", "Glove", "Foot", "?"]
            },
            options: {
                ko: ["양말", "신발", "바지", "모자"],
                en: ["Sock", "Shoe", "Pants", "Hat"]
            },
            answer: 1,
            explanation: {
                ko: "신체부위와 해당 부위를 감싸는 의류",
                en: "Body part and covering garment"
            }
        },
        
        // === 쉬움 ===
        {
            id: "VER004",
            irt: { a: 1.2, b: -1.0, c: 0.25 },
            domain: "verbal",
            difficulty: "easy",
            type: "analogy",
            question: {
                ko: "책 : 읽다 = 음악 : ?",
                en: "Book : Read = Music : ?"
            },
            analogy: {
                ko: ["책", "읽다", "음악", "?"],
                en: ["Book", "Read", "Music", "?"]
            },
            options: {
                ko: ["악기", "듣다", "가수", "콘서트"],
                en: ["Instrument", "Listen", "Singer", "Concert"]
            },
            answer: 1,
            explanation: {
                ko: "대상과 그것을 소비하는 행위",
                en: "Object and action of consuming it"
            }
        },
        {
            id: "VER005",
            irt: { a: 1.2, b: -0.7, c: 0.25 },
            domain: "verbal",
            difficulty: "easy",
            type: "analogy",
            question: {
                ko: "여름 : 덥다 = 겨울 : ?",
                en: "Summer : Hot = Winter : ?"
            },
            analogy: {
                ko: ["여름", "덥다", "겨울", "?"],
                en: ["Summer", "Hot", "Winter", "?"]
            },
            options: {
                ko: ["눈", "춥다", "코트", "난방"],
                en: ["Snow", "Cold", "Coat", "Heating"]
            },
            answer: 1,
            explanation: {
                ko: "계절과 그 특성",
                en: "Season and its characteristic"
            }
        },
        {
            id: "VER006",
            irt: { a: 1.3, b: -0.5, c: 0.25 },
            domain: "verbal",
            difficulty: "easy",
            type: "analogy",
            question: {
                ko: "의사 : 병원 = 교사 : ?",
                en: "Doctor : Hospital = Teacher : ?"
            },
            analogy: {
                ko: ["의사", "병원", "교사", "?"],
                en: ["Doctor", "Hospital", "Teacher", "?"]
            },
            options: {
                ko: ["학생", "학교", "교실", "교육"],
                en: ["Student", "School", "Classroom", "Education"]
            },
            answer: 1,
            explanation: {
                ko: "직업과 근무 장소",
                en: "Profession and workplace"
            }
        },
        
        // === 보통 ===
        {
            id: "VER007",
            irt: { a: 1.5, b: 0.0, c: 0.25 },
            domain: "verbal",
            difficulty: "medium",
            type: "analogy",
            question: {
                ko: "손 : 장갑 = 머리 : ?",
                en: "Hand : Glove = Head : ?"
            },
            analogy: {
                ko: ["손", "장갑", "머리", "?"],
                en: ["Hand", "Glove", "Head", "?"]
            },
            options: {
                ko: ["모자", "얼굴", "두뇌", "머리카락"],
                en: ["Hat", "Face", "Brain", "Hair"]
            },
            answer: 0,
            explanation: {
                ko: "신체부위와 덮는 의류/액세서리",
                en: "Body part and covering accessory"
            }
        },
        {
            id: "VER008",
            irt: { a: 1.5, b: 0.2, c: 0.25 },
            domain: "verbal",
            difficulty: "medium",
            type: "analogy",
            question: {
                ko: "새 : 둥지 = 사람 : ?",
                en: "Bird : Nest = Human : ?"
            },
            analogy: {
                ko: ["새", "둥지", "사람", "?"],
                en: ["Bird", "Nest", "Human", "?"]
            },
            options: {
                ko: ["음식", "옷", "집", "차"],
                en: ["Food", "Clothes", "House", "Car"]
            },
            answer: 2,
            explanation: {
                ko: "생물과 그들의 거주지",
                en: "Living being and their dwelling"
            }
        },
        {
            id: "VER009",
            irt: { a: 1.6, b: 0.4, c: 0.25 },
            domain: "verbal",
            difficulty: "medium",
            type: "analogy",
            question: {
                ko: "화가 : 그림 = 작곡가 : ?",
                en: "Painter : Painting = Composer : ?"
            },
            analogy: {
                ko: ["화가", "그림", "작곡가", "?"],
                en: ["Painter", "Painting", "Composer", "?"]
            },
            options: {
                ko: ["악기", "음악", "가수", "무대"],
                en: ["Instrument", "Music", "Singer", "Stage"]
            },
            answer: 1,
            explanation: {
                ko: "창작자와 그들의 창작물",
                en: "Creator and their creation"
            }
        },
        {
            id: "VER010",
            irt: { a: 1.6, b: 0.5, c: 0.25 },
            domain: "verbal",
            difficulty: "medium",
            type: "analogy",
            question: {
                ko: "원인 : 결과 = 질문 : ?",
                en: "Cause : Effect = Question : ?"
            },
            analogy: {
                ko: ["원인", "결과", "질문", "?"],
                en: ["Cause", "Effect", "Question", "?"]
            },
            options: {
                ko: ["대화", "의문", "답변", "호기심"],
                en: ["Conversation", "Doubt", "Answer", "Curiosity"]
            },
            answer: 2,
            explanation: {
                ko: "선행 요소와 그에 대한 반응/결과",
                en: "Antecedent and its response/consequence"
            }
        },
        
        // === 어려움 ===
        {
            id: "VER011",
            irt: { a: 1.8, b: 1.0, c: 0.25 },
            domain: "verbal",
            difficulty: "hard",
            type: "analogy",
            question: {
                ko: "빛 : 어둠 = 지식 : ?",
                en: "Light : Darkness = Knowledge : ?"
            },
            analogy: {
                ko: ["빛", "어둠", "지식", "?"],
                en: ["Light", "Darkness", "Knowledge", "?"]
            },
            options: {
                ko: ["학교", "무지", "책", "공부"],
                en: ["School", "Ignorance", "Book", "Study"]
            },
            answer: 1,
            explanation: {
                ko: "반의어/대립 개념 (계몽 은유)",
                en: "Antonym/opposing concept (enlightenment metaphor)"
            }
        },
        {
            id: "VER012",
            irt: { a: 1.8, b: 1.2, c: 0.25 },
            domain: "verbal",
            difficulty: "hard",
            type: "analogy",
            question: {
                ko: "나무 : 숲 = 별 : ?",
                en: "Tree : Forest = Star : ?"
            },
            analogy: {
                ko: ["나무", "숲", "별", "?"],
                en: ["Tree", "Forest", "Star", "?"]
            },
            options: {
                ko: ["하늘", "은하", "달", "우주"],
                en: ["Sky", "Galaxy", "Moon", "Universe"]
            },
            answer: 1,
            explanation: {
                ko: "개체와 그 집합체",
                en: "Individual and its collection"
            }
        },
        {
            id: "VER013",
            irt: { a: 1.9, b: 1.4, c: 0.25 },
            domain: "verbal",
            difficulty: "hard",
            type: "analogy",
            question: {
                ko: "씨앗 : 나무 = 아이디어 : ?",
                en: "Seed : Tree = Idea : ?"
            },
            analogy: {
                ko: ["씨앗", "나무", "아이디어", "?"],
                en: ["Seed", "Tree", "Idea", "?"]
            },
            options: {
                ko: ["생각", "혁신", "두뇌", "꿈"],
                en: ["Thought", "Innovation", "Brain", "Dream"]
            },
            answer: 1,
            explanation: {
                ko: "시작점과 그것이 발전한 결과물",
                en: "Starting point and its developed outcome"
            }
        },
        {
            id: "VER014",
            irt: { a: 1.9, b: 1.5, c: 0.25 },
            domain: "verbal",
            difficulty: "hard",
            type: "analogy",
            question: {
                ko: "물 : 갈증 = 음식 : ?",
                en: "Water : Thirst = Food : ?"
            },
            analogy: {
                ko: ["물", "갈증", "음식", "?"],
                en: ["Water", "Thirst", "Food", "?"]
            },
            options: {
                ko: ["맛", "배고픔", "요리", "영양"],
                en: ["Taste", "Hunger", "Cooking", "Nutrition"]
            },
            answer: 1,
            explanation: {
                ko: "해결책과 그것이 해결하는 문제",
                en: "Solution and problem it solves"
            }
        },
        
        // === 매우 어려움 ===
        {
            id: "VER015",
            irt: { a: 2.0, b: 1.8, c: 0.25 },
            domain: "verbal",
            difficulty: "very_hard",
            type: "analogy",
            question: {
                ko: "증상 : 진단 = 단서 : ?",
                en: "Symptom : Diagnosis = Clue : ?"
            },
            analogy: {
                ko: ["증상", "진단", "단서", "?"],
                en: ["Symptom", "Diagnosis", "Clue", "?"]
            },
            options: {
                ko: ["범인", "추론", "증거", "해결"],
                en: ["Culprit", "Deduction", "Evidence", "Solution"]
            },
            answer: 1,
            explanation: {
                ko: "관찰 가능한 징후와 그것을 통한 판단 과정",
                en: "Observable sign and judgment process through it"
            }
        },
        {
            id: "VER016",
            irt: { a: 2.0, b: 1.9, c: 0.25 },
            domain: "verbal",
            difficulty: "very_hard",
            type: "analogy",
            question: {
                ko: "겸손 : 오만 = 절제 : ?",
                en: "Humility : Arrogance = Temperance : ?"
            },
            analogy: {
                ko: ["겸손", "오만", "절제", "?"],
                en: ["Humility", "Arrogance", "Temperance", "?"]
            },
            options: {
                ko: ["인내", "탐욕", "평화", "분노"],
                en: ["Patience", "Greed", "Peace", "Anger"]
            },
            answer: 1,
            explanation: {
                ko: "미덕과 그 반대되는 악덕",
                en: "Virtue and its opposing vice"
            }
        },
        {
            id: "VER017",
            irt: { a: 2.1, b: 2.0, c: 0.25 },
            domain: "verbal",
            difficulty: "very_hard",
            type: "analogy",
            question: {
                ko: "유전자 : 유전학 = 원자 : ?",
                en: "Gene : Genetics = Atom : ?"
            },
            analogy: {
                ko: ["유전자", "유전학", "원자", "?"],
                en: ["Gene", "Genetics", "Atom", "?"]
            },
            options: {
                ko: ["분자", "물리학", "화학", "원자학"],
                en: ["Molecule", "Physics", "Chemistry", "Atomics"]
            },
            answer: 1,
            explanation: {
                ko: "연구 대상과 그것을 연구하는 학문 (원자물리학)",
                en: "Study subject and science that studies it (atomic physics)"
            }
        },
        
        // === 최고난도 ===
        {
            id: "VER018",
            irt: { a: 2.2, b: 2.2, c: 0.25 },
            domain: "verbal",
            difficulty: "extreme",
            type: "analogy",
            question: {
                ko: "플라톤 : 이데아 = 칸트 : ?",
                en: "Plato : Idea = Kant : ?"
            },
            analogy: {
                ko: ["플라톤", "이데아", "칸트", "?"],
                en: ["Plato", "Idea", "Kant", "?"]
            },
            options: {
                ko: ["비판", "범주", "이성", "물자체"],
                en: ["Critique", "Category", "Reason", "Thing-in-itself"]
            },
            answer: 3,
            explanation: {
                ko: "철학자와 그의 핵심 개념",
                en: "Philosopher and their key concept"
            }
        },
        {
            id: "VER019",
            irt: { a: 2.2, b: 2.4, c: 0.25 },
            domain: "verbal",
            difficulty: "extreme",
            type: "analogy",
            question: {
                ko: "인플레이션 : 디플레이션 = 확장 : ?",
                en: "Inflation : Deflation = Expansion : ?"
            },
            analogy: {
                ko: ["인플레이션", "디플레이션", "확장", "?"],
                en: ["Inflation", "Deflation", "Expansion", "?"]
            },
            options: {
                ko: ["성장", "수축", "균형", "변동"],
                en: ["Growth", "Contraction", "Balance", "Fluctuation"]
            },
            answer: 1,
            explanation: {
                ko: "경제적 반대 개념의 일반화",
                en: "Generalization of economic opposite concepts"
            }
        },
        {
            id: "VER020",
            irt: { a: 2.3, b: 2.5, c: 0.25 },
            domain: "verbal",
            difficulty: "extreme",
            type: "analogy",
            question: {
                ko: "엔트로피 : 열역학 = 불확정성 : ?",
                en: "Entropy : Thermodynamics = Uncertainty : ?"
            },
            analogy: {
                ko: ["엔트로피", "열역학", "불확정성", "?"],
                en: ["Entropy", "Thermodynamics", "Uncertainty", "?"]
            },
            options: {
                ko: ["확률", "통계학", "양자역학", "상대성"],
                en: ["Probability", "Statistics", "Quantum Mechanics", "Relativity"]
            },
            answer: 2,
            explanation: {
                ko: "핵심 개념과 그것이 속한 물리학 분야 (하이젠베르크 불확정성 원리)",
                en: "Key concept and physics field it belongs to (Heisenberg Uncertainty Principle)"
            }
        }
    ]
};

// ═══════════════════════════════════════════════════════════════════
// 멘사 도전 테스트 문제 (고난도 위주)
// ═══════════════════════════════════════════════════════════════════

const MENSA_CHALLENGE_ITEMS = [
    // 패턴에서 고난도 선별
    ...IQ_TEST_ITEMS.pattern.filter(q => q.irt.b >= 1.5),
    // 수리에서 고난도 선별
    ...IQ_TEST_ITEMS.numerical.filter(q => q.irt.b >= 1.5),
    // 공간에서 고난도 선별
    ...IQ_TEST_ITEMS.spatial.filter(q => q.irt.b >= 1.5),
    // 논리에서 고난도 선별
    ...IQ_TEST_ITEMS.logical.filter(q => q.irt.b >= 1.5),
    // 언어에서 고난도 선별
    ...IQ_TEST_ITEMS.verbal.filter(q => q.irt.b >= 1.5)
];

// ═══════════════════════════════════════════════════════════════════
// 문항 통계 요약
// ═══════════════════════════════════════════════════════════════════

const ITEM_STATISTICS = {
    pattern: {
        total: IQ_TEST_ITEMS.pattern.length,
        byDifficulty: {
            very_easy: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'very_easy').length,
            easy: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'easy').length,
            medium: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'medium').length,
            hard: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'hard').length,
            very_hard: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'very_hard').length,
            extreme: IQ_TEST_ITEMS.pattern.filter(q => q.difficulty === 'extreme').length
        },
        avgDifficulty: IQ_TEST_ITEMS.pattern.reduce((sum, q) => sum + q.irt.b, 0) / IQ_TEST_ITEMS.pattern.length
    },
    numerical: {
        total: IQ_TEST_ITEMS.numerical.length,
        byDifficulty: {
            very_easy: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'very_easy').length,
            easy: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'easy').length,
            medium: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'medium').length,
            hard: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'hard').length,
            very_hard: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'very_hard').length,
            extreme: IQ_TEST_ITEMS.numerical.filter(q => q.difficulty === 'extreme').length
        },
        avgDifficulty: IQ_TEST_ITEMS.numerical.reduce((sum, q) => sum + q.irt.b, 0) / IQ_TEST_ITEMS.numerical.length
    },
    spatial: {
        total: IQ_TEST_ITEMS.spatial.length,
        byDifficulty: {
            very_easy: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'very_easy').length,
            easy: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'easy').length,
            medium: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'medium').length,
            hard: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'hard').length,
            very_hard: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'very_hard').length,
            extreme: IQ_TEST_ITEMS.spatial.filter(q => q.difficulty === 'extreme').length
        },
        avgDifficulty: IQ_TEST_ITEMS.spatial.reduce((sum, q) => sum + q.irt.b, 0) / IQ_TEST_ITEMS.spatial.length
    },
    logical: {
        total: IQ_TEST_ITEMS.logical.length,
        byDifficulty: {
            very_easy: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'very_easy').length,
            easy: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'easy').length,
            medium: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'medium').length,
            hard: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'hard').length,
            very_hard: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'very_hard').length,
            extreme: IQ_TEST_ITEMS.logical.filter(q => q.difficulty === 'extreme').length
        },
        avgDifficulty: IQ_TEST_ITEMS.logical.reduce((sum, q) => sum + q.irt.b, 0) / IQ_TEST_ITEMS.logical.length
    },
    verbal: {
        total: IQ_TEST_ITEMS.verbal.length,
        byDifficulty: {
            very_easy: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'very_easy').length,
            easy: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'easy').length,
            medium: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'medium').length,
            hard: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'hard').length,
            very_hard: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'very_hard').length,
            extreme: IQ_TEST_ITEMS.verbal.filter(q => q.difficulty === 'extreme').length
        },
        avgDifficulty: IQ_TEST_ITEMS.verbal.reduce((sum, q) => sum + q.irt.b, 0) / IQ_TEST_ITEMS.verbal.length
    }
};

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IQ_TEST_ITEMS, MENSA_CHALLENGE_ITEMS, ITEM_STATISTICS };
}
