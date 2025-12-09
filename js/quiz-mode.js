// ============================================
// Quiz Mode - 10 Questions with Final Scoring
// ============================================

// Quiz state
let quizState = {
    difficulty: null,
    questions: [],
    currentQuestion: 0,
    userAnswers: [],
    startTime: null,
    questionStartTime: null,
    isQuizActive: false
};

let timerInterval = null;

// ============================================
// Quiz Initialization
// ============================================

function startQuizMode(difficulty) {
    quizState.difficulty = difficulty;
    quizState.questions = [];
    quizState.currentQuestion = 0;
    quizState.userAnswers = [];
    quizState.startTime = Date.now();
    quizState.isQuizActive = true;

    // Generate 10 questions
    console.log(`Generating 10 questions for ${difficulty} difficulty`);
    for (let i = 0; i < 10; i++) {
        try {
            // Use existing generator, but try extended puzzles for variety
            let puzzle;
            if (typeof generateExtendedPuzzle !== 'undefined' && Math.random() > 0.5) {
                // Try extended puzzle types
                puzzle = generateExtendedPuzzle(difficulty);
            } else {
                // Fall back to original puzzles
                puzzle = generatePuzzle(difficulty);
            }
            puzzle.questionNumber = i + 1;
            quizState.questions.push(puzzle);
        } catch (error) {
            console.error(`Failed to generate question ${i+1}:`, error);
            // Fallback to basic puzzle
            const basicPuzzle = generatePuzzle(difficulty);
            basicPuzzle.questionNumber = i + 1;
            quizState.questions.push(basicPuzzle);
        }
    }

    // Update UI
    const difficultyNames = {
        'easy': '초급',
        'medium': '중급',
        'hard': '고급'
    };
    document.getElementById('currentDiffText').textContent = difficultyNames[difficulty];

    // Hide difficulty selection and show quiz
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('quizInterface').style.display = 'block';
    document.getElementById('resultsScreen').style.display = 'none';

    // Start timer
    startTimer();

    // Show first question
    showCurrentQuestion();
}

// ============================================
// Timer Management
// ============================================

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer() {
    if (!quizState.startTime) return;

    const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    document.getElementById('timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================
// Question Display
// ============================================

function showCurrentQuestion() {
    if (quizState.currentQuestion >= quizState.questions.length) {
        showResults();
        return;
    }

    const question = quizState.questions[quizState.currentQuestion];
    const questionNum = quizState.currentQuestion + 1;

    // Update progress
    document.getElementById('currentQuestionNum').textContent = questionNum;
    const progressPercent = (questionNum / 10) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    // Record question start time
    quizState.questionStartTime = Date.now();

    // Render the question based on type
    renderQuestion(question);
}

function renderQuestion(question) {
    // Hide all containers first
    document.querySelector('.sequence-container').style.display = 'none';
    document.getElementById('gridContainer').style.display = 'none';
    document.getElementById('extendedPuzzleContainer').style.display = 'none';

    if (question.kind) {
        // Extended puzzle type
        renderExtendedPuzzle(question);
    } else if (question.grid) {
        // Grid puzzle
        document.getElementById('gridContainer').style.display = 'block';
        renderGrid(question);
    } else {
        // Sequence puzzle
        document.querySelector('.sequence-container').style.display = 'block';
        renderSequence(question);
    }

    // Always render options
    renderOptions(question);
}

function renderExtendedPuzzle(question) {
    document.getElementById('extendedPuzzleContainer').style.display = 'block';
    const titleEl = document.getElementById('extendedPuzzleTitle');
    const contentEl = document.getElementById('extendedPuzzleContent');

    const kindTitles = {
        'odd-one-out': '🔍 다른 하나를 찾으세요',
        'analogy': '↔️ 비례 관계를 찾으세요',
        'grid': '⬜ 격자 패턴을 완성하세요',
        'symmetry': '🪞 대칭성을 판단하세요',
        'equation': '➕ 도형 수식을 계산하세요'
    };

    titleEl.textContent = kindTitles[question.kind] || '문제를 풀어보세요';

    if (question.kind === 'odd-one-out') {
        contentEl.innerHTML = '<p>다음 중 나머지 셋과 다른 하나는?</p>';
    } else if (question.kind === 'analogy') {
        if (question.analogyPairs) {
            const { A, B, C } = question.analogyPairs;
            contentEl.innerHTML = `
                <div class="analogy-display">
                    <div class="analogy-pair">
                        ${createShapeElement(A).outerHTML}
                        <span class="analogy-arrow">→</span>
                        ${createShapeElement(B).outerHTML}
                    </div>
                    <div class="analogy-separator">::</div>
                    <div class="analogy-pair">
                        ${createShapeElement(C).outerHTML}
                        <span class="analogy-arrow">→</span>
                        <span class="analogy-question">?</span>
                    </div>
                </div>
            `;
        }
    } else if (question.kind === 'grid') {
        renderGrid(question);
        return;
    } else if (question.kind === 'equation') {
        if (question.equation) {
            contentEl.innerHTML = `
                <div class="equation-display">
                    <div class="equation-problem">${question.equation.problem}</div>
                    <p>위 수식의 결과는?</p>
                </div>
            `;
        }
    }
}

function renderSequence(question) {
    const container = document.getElementById('sequenceDisplay');
    container.innerHTML = '';

    question.sequence.forEach(shape => {
        const shapeElement = createShapeElement(shape);
        container.appendChild(shapeElement);
    });

    // Add arrow
    const arrow = document.createElement('div');
    arrow.className = 'sequence-item arrow';
    arrow.innerHTML = '→';
    container.appendChild(arrow);
}

function renderGrid(question) {
    const container = document.getElementById('gridDisplay');
    container.innerHTML = '';

    question.grid.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';

        row.forEach((shape, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';

            if (question.missingCell &&
                question.missingCell.row === rowIndex &&
                question.missingCell.col === colIndex) {
                cellElement.innerHTML = '<div class="missing-shape">?</div>';
                cellElement.classList.add('missing');
            } else {
                const shapeElement = createShapeElement(shape);
                cellElement.appendChild(shapeElement);
            }

            rowElement.appendChild(cellElement);
        });

        container.appendChild(rowElement);
    });
}

function renderOptions(question) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.onclick = () => selectAnswer(index);

        const shapeElement = createShapeElement(option);
        optionElement.appendChild(shapeElement);

        container.appendChild(optionElement);
    });
}

// ============================================
// Answer Selection
// ============================================

function selectAnswer(selectedIndex) {
    if (!quizState.isQuizActive) return;

    const question = quizState.questions[quizState.currentQuestion];
    const isCorrect = selectedIndex === question.correctIndex;
    const timeSpent = Date.now() - quizState.questionStartTime;

    // Record answer
    quizState.userAnswers.push({
        questionNumber: quizState.currentQuestion + 1,
        selectedIndex: selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
        rule: question.ruleDescription || 'Pattern rule',
        questionType: question.kind || (question.grid ? 'grid' : 'sequence')
    });

    // Visual feedback
    const allOptions = document.querySelectorAll('.option-item');
    allOptions.forEach((option, index) => {
        option.onclick = null;
        if (index === selectedIndex) {
            option.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
        }
        if (index === question.correctIndex && !isCorrect) {
            option.classList.add('show-correct');
        }
    });

    // Auto-advance after delay
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function nextQuestion() {
    quizState.currentQuestion++;
    showCurrentQuestion();
}

function skipQuestion() {
    const question = quizState.questions[quizState.currentQuestion];

    // Record as skipped/wrong
    quizState.userAnswers.push({
        questionNumber: quizState.currentQuestion + 1,
        selectedIndex: -1,
        correctIndex: question.correctIndex,
        isCorrect: false,
        timeSpent: Date.now() - quizState.questionStartTime,
        rule: question.ruleDescription || 'Pattern rule',
        questionType: question.kind || (question.grid ? 'grid' : 'sequence'),
        skipped: true
    });

    nextQuestion();
}

function exitQuiz() {
    if (confirm('정말로 퀴즈를 종료하시겠습니까? 진행상황이 저장되지 않습니다.')) {
        stopTimer();
        quizState.isQuizActive = false;
        goHome();
    }
}

// ============================================
// Results Display
// ============================================

function showResults() {
    stopTimer();
    quizState.isQuizActive = false;

    // Calculate statistics
    const correctAnswers = quizState.userAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / 10) * 100);
    const totalTime = Math.floor((Date.now() - quizState.startTime) / 1000);
    const avgTime = Math.round(totalTime / 10);

    // Estimate IQ based on difficulty and performance
    const iqEstimate = calculateIQEstimate(quizState.difficulty, accuracy);

    // Update results display
    document.getElementById('finalScore').textContent = correctAnswers;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    document.getElementById('totalTime').textContent = formatTime(totalTime);
    document.getElementById('avgTime').textContent = `${avgTime}초`;
    document.getElementById('estimatedIQ').textContent = iqEstimate;

    // Show detailed breakdown
    renderAnswersBreakdown();

    // Show results screen
    document.getElementById('quizInterface').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
}

function calculateIQEstimate(difficulty, accuracy) {
    const baseIQ = {
        'easy': 90,
        'medium': 100,
        'hard': 110
    };

    const base = baseIQ[difficulty];
    const bonus = Math.floor((accuracy - 50) / 10) * 5;

    return Math.max(70, Math.min(160, base + bonus));
}

function renderAnswersBreakdown() {
    const container = document.getElementById('answersBreakdown');
    container.innerHTML = '';

    quizState.userAnswers.forEach(answer => {
        const item = document.createElement('div');
        item.className = 'answer-item';

        const statusClass = answer.skipped ? 'answer-wrong' :
                           answer.isCorrect ? 'answer-correct' : 'answer-wrong';
        const statusText = answer.skipped ? '건너뜀' :
                          answer.isCorrect ? '정답' : '오답';

        item.innerHTML = `
            <div>
                <strong>문제 ${answer.questionNumber}</strong>
                <span style="margin-left: 10px; color: #666; font-size: 0.9em;">
                    ${answer.questionType} • ${Math.round(answer.timeSpent/1000)}초
                </span>
            </div>
            <div class="answer-status ${statusClass}">
                ${statusText}
            </div>
        `;

        container.appendChild(item);
    });
}

// ============================================
// Navigation Functions
// ============================================

function restartQuiz() {
    startQuizMode(quizState.difficulty);
}

function goHome() {
    stopTimer();
    quizState.isQuizActive = false;

    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('quizInterface').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
}

// ============================================
// Utility Functions
// ============================================

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function createShapeElement(shape) {
    const element = document.createElement('div');
    element.className = 'shape-item';

    if (!shape || (!shape.type && !shape.dots)) {
        element.innerHTML = '<div class="empty-shape"></div>';
        return element;
    }

    // Create shape visual
    const visual = document.createElement('div');
    visual.className = `shape ${shape.type || 'circle'} ${shape.fill || 'empty'} ${shape.color || 'black'} ${shape.size || 'medium'}`;

    if (shape.rotation) {
        visual.style.transform = `rotate(${shape.rotation}deg)`;
    }

    // Add dots if present
    if (shape.dots && shape.dots > 0) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'dots-container';

        for (let i = 0; i < shape.dots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotsContainer.appendChild(dot);
        }

        visual.appendChild(dotsContainer);
    }

    element.appendChild(visual);
    return element;
}

// ============================================
// Extended Puzzle Support
// ============================================

function generateExtendedPuzzle(difficulty) {
    // Integrate with the React component system if available
    // For now, fallback to basic puzzles with extended structure

    const puzzleTypes = ['odd-one-out', 'analogy', 'sequence'];
    const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];

    if (randomType === 'odd-one-out') {
        return generateOddOneOutPuzzle(difficulty);
    } else if (randomType === 'analogy') {
        return generateAnalogyPuzzle(difficulty);
    } else {
        // Fall back to sequence
        return generatePuzzle(difficulty);
    }
}

function generateOddOneOutPuzzle(difficulty) {
    const shapes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
    const colors = ['black', 'gray', 'white'];

    // Create 3 similar + 1 different
    const majorityType = shapes[Math.floor(Math.random() * shapes.length)];
    const minorityType = shapes.filter(s => s !== majorityType)[Math.floor(Math.random() * (shapes.length - 1))];

    const options = [];
    const correctIndex = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {
        options.push({
            type: i === correctIndex ? minorityType : majorityType,
            fill: 'empty',
            color: 'black',
            size: 'medium'
        });
    }

    return {
        kind: 'odd-one-out',
        difficulty: difficulty,
        options: options,
        correctIndex: correctIndex,
        ruleDescription: `3개는 ${majorityType}, 1개만 ${minorityType}`
    };
}

function generateAnalogyPuzzle(difficulty) {
    const shapes = ['triangle', 'square', 'pentagon', 'hexagon'];

    // A -> B relationship (add 1 side)
    const A = shapes[Math.floor(Math.random() * (shapes.length - 1))];
    const AIndex = shapes.indexOf(A);
    const B = shapes[AIndex + 1];

    // C -> D (apply same relationship)
    const C = shapes[Math.floor(Math.random() * (shapes.length - 1))];
    const CIndex = shapes.indexOf(C);
    const D = CIndex < shapes.length - 1 ? shapes[CIndex + 1] : 'circle';

    const makeShape = (type) => ({
        type: type,
        fill: 'empty',
        color: 'black',
        size: 'medium'
    });

    // Create wrong options
    const wrongOptions = shapes.filter(s => s !== D).slice(0, 3);
    const options = [...wrongOptions, D].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(D);

    return {
        kind: 'analogy',
        difficulty: difficulty,
        analogyPairs: {
            A: makeShape(A),
            B: makeShape(B),
            C: makeShape(C)
        },
        options: options.map(makeShape),
        correctIndex: correctIndex,
        ruleDescription: `${A}→${B} 관계를 ${C}→? 에 적용`
    };
}

// ============================================
// CSS Additions for Quiz Mode
// ============================================

// Add styles for quiz-specific elements
const quizStyles = `
    .selected-correct {
        background-color: #dcfce7 !important;
        border: 3px solid #16a34a !important;
    }

    .selected-wrong {
        background-color: #fecaca !important;
        border: 3px solid #dc2626 !important;
    }

    .show-correct {
        background-color: #dcfce7 !important;
        border: 3px solid #16a34a !important;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .analogy-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin: 20px 0;
    }

    .analogy-pair {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .analogy-arrow {
        font-size: 1.5em;
        font-weight: bold;
    }

    .analogy-separator {
        font-size: 1.5em;
        font-weight: bold;
    }

    .analogy-question {
        font-size: 2em;
        font-weight: bold;
        color: #666;
    }

    .equation-display {
        text-align: center;
        margin: 20px 0;
    }

    .equation-problem {
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 10px;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = quizStyles;
document.head.appendChild(styleSheet);

// ============================================
// Initialize
// ============================================

window.addEventListener('load', function() {
    console.log('Quiz Mode System Loaded');

    // Initialize with difficulty selection
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('quizInterface').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
});