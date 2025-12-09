// ============================================
// Game Modes System - Multiple Play Styles
// ============================================

// Game state
let gameState = {
    currentMode: null,
    subMode: null,
    startTime: null,
    timeLimit: null,
    problems: [],
    currentProblem: null,
    score: 0,
    totalAttempted: 0,
    correctAnswers: 0,

    // Levelup mode specific
    currentStage: 1,
    stageProgress: 0,
    stageTarget: 5,

    // Time attack specific
    timeRemaining: 0,

    isActive: false,
    isPaused: false
};

let gameTimer = null;

// ============================================
// Mode Selection Functions
// ============================================

function showDifficultyModes() {
    hideAllScreens();
    document.getElementById('difficultyModeSelection').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
}

function showTypeModes() {
    hideAllScreens();
    document.getElementById('typeModeSelection').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
}

function showTimeAttackModes() {
    hideAllScreens();
    document.getElementById('timeAttackModeSelection').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';
}

function showLevelupMode() {
    hideAllScreens();
    initializeLevelupMode();
}

function showMainModes() {
    hideAllScreens();
    document.getElementById('mainModeSelection').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('timerDisplay').style.display = 'none';
    stopGame();
}

function hideAllScreens() {
    const screens = [
        'mainModeSelection', 'difficultyModeSelection', 'typeModeSelection',
        'timeAttackModeSelection', 'levelupMode', 'gamePlayArea', 'gameResults'
    ];
    screens.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

function goBack() {
    if (gameState.isActive) {
        if (confirm('게임을 종료하시겠습니까?')) {
            stopGame();
            showMainModes();
        }
    } else {
        showMainModes();
    }
}

// ============================================
// 1. Difficulty-based Modes
// ============================================

function startDifficultyMode(difficulty) {
    gameState.currentMode = 'difficulty';
    gameState.subMode = difficulty;
    gameState.isActive = true;

    resetGameStats();

    // Configure problem types for each difficulty
    const difficultyConfigs = {
        easy: {
            types: ['sequence', 'odd-one-out'],
            weights: { sequence: 60, 'odd-one-out': 40 },
            description: '🟢 초급: 수열 + 다른하나 찾기'
        },
        medium: {
            types: ['sequence', 'analogy', 'grid'],
            weights: { sequence: 30, analogy: 40, grid: 30 },
            description: '🟡 중급: 수열 + 비례 + 체스판'
        },
        hard: {
            types: ['grid', 'equation', 'analogy'],
            weights: { grid: 40, equation: 30, analogy: 30 },
            description: '🔴 고급: 그리드 + 수식 + 복합 비례'
        }
    };

    gameState.config = difficultyConfigs[difficulty];

    hideAllScreens();
    document.getElementById('gamePlayArea').style.display = 'block';

    generateAndShowProblem();
}

// ============================================
// 2. Type-based Modes
// ============================================

function startTypeMode(type) {
    gameState.currentMode = 'type';
    gameState.subMode = type;
    gameState.isActive = true;

    resetGameStats();

    // Configure for specific problem types
    const typeConfigs = {
        sequence: {
            types: ['sequence'],
            description: '🔢 수열 모드: 패턴 인식 전문'
        },
        grid: {
            types: ['grid'],
            description: '⬜ 그리드 모드: 공간 논리 전문'
        },
        analogy: {
            types: ['analogy'],
            description: '↔️ 비례 모드: 관계 추론 전문'
        },
        'odd-one-out': {
            types: ['odd-one-out'],
            description: '🔍 다른하나 찾기: 차이점 식별 전문'
        },
        equation: {
            types: ['equation'],
            description: '➕ 수식 모드: 도형 수학 전문'
        },
        mensa: {
            types: ['grid', 'analogy', 'equation'],
            weights: { grid: 35, analogy: 35, equation: 30 },
            difficulty: 'hard',
            description: '🧠 멘사 스타일: 고난도 종합 문제'
        }
    };

    gameState.config = typeConfigs[type];

    hideAllScreens();
    document.getElementById('gamePlayArea').style.display = 'block';

    generateAndShowProblem();
}

// ============================================
// 3. Time Attack Mode
// ============================================

function startTimeAttack(timeLimit) {
    gameState.currentMode = 'timeAttack';
    gameState.timeLimit = timeLimit;
    gameState.timeRemaining = timeLimit;
    gameState.isActive = true;

    resetGameStats();

    // Time attack uses mixed problems
    gameState.config = {
        types: ['sequence', 'odd-one-out', 'analogy', 'grid'],
        description: `⚡ ${timeLimit}초 타임어택`
    };

    hideAllScreens();
    document.getElementById('gamePlayArea').style.display = 'block';
    document.getElementById('timeAttackStats').style.display = 'grid';
    document.getElementById('timerDisplay').style.display = 'block';

    startGameTimer();
    generateAndShowProblem();
}

function startGameTimer() {
    updateTimerDisplay();

    gameTimer = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.timeRemaining--;
            updateTimerDisplay();

            if (gameState.timeRemaining <= 0) {
                endTimeAttack();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    document.getElementById('timerDisplay').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Warning colors
    if (gameState.timeRemaining <= 10) {
        document.getElementById('timerDisplay').style.background = '#dc2626';
    } else if (gameState.timeRemaining <= 30) {
        document.getElementById('timerDisplay').style.background = '#f59e0b';
    } else {
        document.getElementById('timerDisplay').style.background = '#ef4444';
    }
}

function endTimeAttack() {
    stopGame();
    showTimeAttackResults();
}

// ============================================
// 4. Levelup Mode
// ============================================

function initializeLevelupMode() {
    gameState.currentMode = 'levelup';
    gameState.currentStage = 1;
    gameState.stageProgress = 0;
    gameState.stageTarget = 5;
    gameState.isActive = true;

    resetGameStats();

    document.getElementById('levelupMode').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block';

    updateLevelupDisplay();
    startLevelupStage();
}

function startLevelupStage() {
    // Configure problems based on stage
    const stageConfigs = {
        1: { types: ['sequence'], difficulty: 'easy', description: '기초 수열 패턴 마스터' },
        2: { types: ['sequence', 'odd-one-out'], difficulty: 'easy', description: '패턴 인식 확장' },
        3: { types: ['sequence', 'analogy'], difficulty: 'medium', description: '관계 추론 입문' },
        4: { types: ['analogy', 'grid'], difficulty: 'medium', description: '공간 논리 개발' },
        5: { types: ['grid', 'equation'], difficulty: 'hard', description: '고급 수리 추론' },
        6: { types: ['grid', 'analogy', 'equation'], difficulty: 'hard', description: '종합 사고 마스터' }
    };

    gameState.config = stageConfigs[gameState.currentStage] || stageConfigs[6];

    // Move to game area but keep levelup display
    hideAllScreens();
    document.getElementById('gamePlayArea').style.display = 'block';

    // Add stage info to top
    const stageInfo = document.createElement('div');
    stageInfo.className = 'level-info';
    stageInfo.innerHTML = `
        <strong>Stage ${gameState.currentStage}</strong> - ${gameState.config.description}
        <div class="level-progress">
            <div class="level-progress-fill" style="width: ${(gameState.stageProgress/gameState.stageTarget)*100}%"></div>
        </div>
        <div>${gameState.stageProgress}/${gameState.stageTarget} 클리어</div>
    `;

    const gameArea = document.getElementById('gamePlayArea');
    const existingInfo = gameArea.querySelector('.level-info');
    if (existingInfo) existingInfo.remove();
    gameArea.insertBefore(stageInfo, gameArea.firstChild);

    generateAndShowProblem();
}

function updateLevelupDisplay() {
    document.getElementById('currentStage').textContent = gameState.currentStage;

    const stageDescriptions = {
        1: '기초 수열 패턴 마스터',
        2: '패턴 인식 확장',
        3: '관계 추론 입문',
        4: '공간 논리 개발',
        5: '고급 수리 추론',
        6: '종합 사고 마스터'
    };

    document.getElementById('stageDescription').textContent =
        stageDescriptions[gameState.currentStage] || '최고 레벨 달성!';

    const progressPercent = (gameState.stageProgress / gameState.stageTarget) * 100;
    document.getElementById('levelProgressFill').style.width = `${progressPercent}%`;
    document.getElementById('stageProgress').textContent = `${gameState.stageProgress}/${gameState.stageTarget} 클리어`;
}

function checkLevelupProgress() {
    gameState.stageProgress++;

    if (gameState.stageProgress >= gameState.stageTarget) {
        // Stage completed!
        gameState.currentStage++;
        gameState.stageProgress = 0;

        if (gameState.currentStage > 6) {
            // All stages completed!
            showLevelupCompletion();
            return;
        }

        // Show stage completion and move to next
        showStageCompletion();
    }

    updateLevelupDisplay();

    // Update the stage info in game area
    const levelInfo = document.querySelector('#gamePlayArea .level-info');
    if (levelInfo) {
        const progressFill = levelInfo.querySelector('.level-progress-fill');
        const progressText = levelInfo.querySelector('div:last-child');

        if (progressFill) {
            progressFill.style.width = `${(gameState.stageProgress/gameState.stageTarget)*100}%`;
        }
        if (progressText) {
            progressText.textContent = `${gameState.stageProgress}/${gameState.stageTarget} 클리어`;
        }
    }
}

// ============================================
// Problem Generation and Display
// ============================================

function generateAndShowProblem() {
    try {
        let problem;
        const config = gameState.config;

        // Choose problem type based on mode configuration
        let chosenType;
        if (config.types.length === 1) {
            chosenType = config.types[0];
        } else {
            // Weighted selection if weights are provided
            if (config.weights) {
                chosenType = weightedRandomChoice(config.weights);
            } else {
                chosenType = config.types[Math.floor(Math.random() * config.types.length)];
            }
        }

        // Generate problem based on type
        if (chosenType === 'sequence') {
            const difficulty = config.difficulty || 'easy';
            problem = generatePuzzle(difficulty);
        } else if (typeof generateExtendedPuzzle !== 'undefined') {
            // Use extended puzzle generator if available
            const difficulty = config.difficulty || 'medium';
            problem = generateExtendedPuzzle(chosenType, difficulty);
        } else {
            // Fallback to basic puzzle
            problem = generatePuzzle(config.difficulty || 'medium');
        }

        gameState.currentProblem = problem;
        renderProblem(problem, chosenType);

    } catch (error) {
        console.error('Problem generation failed:', error);
        // Fallback to basic puzzle
        const fallback = generatePuzzle('easy');
        gameState.currentProblem = fallback;
        renderProblem(fallback, 'sequence');
    }
}

function renderProblem(problem, type) {
    // Hide all containers
    document.querySelector('.sequence-container').style.display = 'none';
    document.getElementById('gridContainer').style.display = 'none';
    document.getElementById('extendedPuzzleContainer').style.display = 'none';

    // Show problem type indicator
    const typeNames = {
        'sequence': '🔢 수열 문제',
        'odd-one-out': '🔍 다른하나 찾기',
        'analogy': '↔️ 비례 문제',
        'grid': '⬜ 격자 문제',
        'equation': '➕ 수식 문제'
    };

    document.getElementById('problemTypeIndicator').textContent =
        typeNames[type] || gameState.config.description;

    // Render based on problem structure
    if (problem.kind) {
        // Extended puzzle
        renderExtendedProblem(problem);
    } else if (problem.grid) {
        // Grid puzzle
        document.getElementById('gridContainer').style.display = 'block';
        renderGrid(problem);
    } else {
        // Sequence puzzle
        document.querySelector('.sequence-container').style.display = 'block';
        renderSequence(problem);
    }

    // Always render options
    renderOptions(problem);

    // Hide feedback and next button
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';
}

function renderExtendedProblem(problem) {
    document.getElementById('extendedPuzzleContainer').style.display = 'block';
    const titleEl = document.getElementById('extendedPuzzleTitle');
    const contentEl = document.getElementById('extendedPuzzleContent');

    const kindTitles = {
        'odd-one-out': '다음 중 나머지 셋과 다른 하나는?',
        'analogy': 'A → B 관계를 C → ? 에 적용하세요',
        'equation': '도형 수식을 계산하세요'
    };

    titleEl.textContent = kindTitles[problem.kind] || '문제를 풀어보세요';

    if (problem.kind === 'analogy' && problem.analogyPairs) {
        const { A, B, C } = problem.analogyPairs;
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
    } else {
        contentEl.innerHTML = '<p>보기에서 정답을 선택하세요.</p>';
    }
}

function renderSequence(problem) {
    const container = document.getElementById('sequenceDisplay');
    container.innerHTML = '';

    problem.sequence.forEach(shape => {
        const shapeElement = createShapeElement(shape);
        container.appendChild(shapeElement);
    });

    const arrow = document.createElement('div');
    arrow.className = 'sequence-item arrow';
    arrow.innerHTML = '→';
    container.appendChild(arrow);
}

function renderGrid(problem) {
    const container = document.getElementById('gridDisplay');
    container.innerHTML = '';

    problem.grid.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';

        row.forEach((shape, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';

            if (problem.missingCell &&
                problem.missingCell.row === rowIndex &&
                problem.missingCell.col === colIndex) {
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

function renderOptions(problem) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    problem.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.onclick = () => selectAnswer(index);

        const shapeElement = createShapeElement(option);
        optionElement.appendChild(shapeElement);

        container.appendChild(optionElement);
    });
}

// ============================================
// Answer Handling
// ============================================

function selectAnswer(selectedIndex) {
    if (!gameState.isActive || gameState.isPaused) return;

    const problem = gameState.currentProblem;
    const isCorrect = selectedIndex === problem.correctIndex;

    gameState.totalAttempted++;
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.score++;
    }

    // Visual feedback
    const allOptions = document.querySelectorAll('.option-item');
    allOptions.forEach((option, index) => {
        option.onclick = null;
        if (index === selectedIndex) {
            option.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
        }
        if (index === problem.correctIndex && !isCorrect) {
            option.classList.add('show-correct');
        }
    });

    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `
        <div class="${isCorrect ? 'success' : 'error'}">
            <span class="feedback-icon">${isCorrect ? '🎉' : '❌'}</span>
            <span class="feedback-text">${isCorrect ? '정답!' : '틀렸습니다!'}</span>
        </div>
        <div class="rule-explanation">
            규칙: ${problem.ruleDescription || 'Pattern rule'}
        </div>
    `;
    feedback.className = `feedback ${isCorrect ? 'success' : 'error'}`;

    // Update stats displays
    updateGameStats();

    // Handle mode-specific logic
    if (gameState.currentMode === 'levelup' && isCorrect) {
        checkLevelupProgress();
    }

    // Show next button or auto-advance
    if (gameState.currentMode === 'timeAttack') {
        // Auto-advance quickly in time attack
        setTimeout(nextProblem, 800);
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
        setTimeout(nextProblem, 2000); // Auto-advance after 2 seconds
    }
}

function nextProblem() {
    if (gameState.currentMode === 'timeAttack' && gameState.timeRemaining > 0) {
        generateAndShowProblem();
    } else if (gameState.currentMode === 'levelup' && gameState.isActive) {
        generateAndShowProblem();
    } else if (gameState.isActive) {
        generateAndShowProblem();
    }
}

function skipProblem() {
    if (!gameState.isActive) return;

    gameState.totalAttempted++;
    updateGameStats();
    nextProblem();
}

function pauseGame() {
    if (!gameState.isActive) return;

    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pauseBtn').textContent = gameState.isPaused ? '계속하기' : '일시정지';

    if (gameState.isPaused) {
        // Disable all interactions
        const options = document.querySelectorAll('.option-item');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
            option.style.opacity = '0.5';
        });
    } else {
        // Re-enable interactions
        const options = document.querySelectorAll('.option-item');
        options.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
        });
    }
}

// ============================================
// Game Statistics and UI Updates
// ============================================

function resetGameStats() {
    gameState.score = 0;
    gameState.totalAttempted = 0;
    gameState.correctAnswers = 0;
    gameState.startTime = Date.now();
    updateGameStats();
}

function updateGameStats() {
    // Time attack stats
    if (gameState.currentMode === 'timeAttack') {
        document.getElementById('solvedCount').textContent = gameState.totalAttempted;
        document.getElementById('correctCount').textContent = gameState.correctAnswers;

        const accuracy = gameState.totalAttempted > 0 ?
            Math.round((gameState.correctAnswers / gameState.totalAttempted) * 100) : 0;
        document.getElementById('accuracyRate').textContent = accuracy + '%';
    }
}

function stopGame() {
    gameState.isActive = false;
    gameState.isPaused = false;

    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// ============================================
// Results Display
// ============================================

function showTimeAttackResults() {
    const accuracy = gameState.totalAttempted > 0 ?
        Math.round((gameState.correctAnswers / gameState.totalAttempted) * 100) : 0;

    const resultsHTML = `
        <div style="text-align: center;">
            <h2>⚡ 타임어택 결과</h2>
            <div style="font-size: 3rem; color: #4ade80; margin: 20px 0;">
                ${gameState.correctAnswers}/${gameState.totalAttempted}
            </div>
            <div style="font-size: 1.5rem; margin: 20px 0;">
                정답률: ${accuracy}%
            </div>
            <div style="margin: 20px 0;">
                제한시간: ${gameState.timeLimit}초<br>
                해결한 문제: ${gameState.totalAttempted}개<br>
                평균 문제당 시간: ${Math.round(gameState.timeLimit / gameState.totalAttempted)}초
            </div>
        </div>
    `;

    document.getElementById('resultsContent').innerHTML = resultsHTML;
    document.getElementById('gameResults').style.display = 'block';
}

function showStageCompletion() {
    alert(`🎉 Stage ${gameState.currentStage - 1} 완료!\nStage ${gameState.currentStage}로 진행합니다.`);
    startLevelupStage();
}

function showLevelupCompletion() {
    const resultsHTML = `
        <div style="text-align: center;">
            <h2>🏆 모든 스테이지 완료!</h2>
            <div style="font-size: 2rem; margin: 20px 0;">
                축하합니다! 레벨업 모드를 모두 클리어했습니다.
            </div>
            <div style="margin: 20px 0;">
                총 정답: ${gameState.correctAnswers}개<br>
                전체 정답률: ${Math.round((gameState.correctAnswers/gameState.totalAttempted)*100)}%<br>
                도전 정신: 최고!
            </div>
        </div>
    `;

    document.getElementById('resultsContent').innerHTML = resultsHTML;
    document.getElementById('gameResults').style.display = 'block';
    stopGame();
}

function restartCurrentMode() {
    hideAllScreens();

    if (gameState.currentMode === 'difficulty') {
        startDifficultyMode(gameState.subMode);
    } else if (gameState.currentMode === 'type') {
        startTypeMode(gameState.subMode);
    } else if (gameState.currentMode === 'timeAttack') {
        startTimeAttack(gameState.timeLimit);
    } else if (gameState.currentMode === 'levelup') {
        initializeLevelupMode();
    }
}

// ============================================
// Utility Functions
// ============================================

function weightedRandomChoice(weights) {
    const items = Object.keys(weights);
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= weights[item];
        if (random <= 0) {
            return item;
        }
    }

    return items[0]; // fallback
}

function createShapeElement(shape) {
    const element = document.createElement('div');
    element.className = 'shape-item';

    if (!shape || (!shape.type && !shape.dots)) {
        element.innerHTML = '<div class="empty-shape"></div>';
        return element;
    }

    const visual = document.createElement('div');
    visual.className = `shape ${shape.type || 'circle'} ${shape.fill || 'empty'} ${shape.color || 'black'} ${shape.size || 'medium'}`;

    if (shape.rotation) {
        visual.style.transform = `rotate(${shape.rotation}deg)`;
    }

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
// Extended Puzzle Generation Support
// ============================================

function generateExtendedPuzzle(type, difficulty = 'medium') {
    // Mock implementation - in real system this would connect to React components
    try {
        switch (type) {
            case 'odd-one-out':
                return generateOddOneOutPuzzle(difficulty);
            case 'analogy':
                return generateAnalogyPuzzle(difficulty);
            case 'grid':
                return generateGridPuzzle(difficulty);
            case 'equation':
                return generateEquationPuzzle(difficulty);
            default:
                return generatePuzzle(difficulty);
        }
    } catch (error) {
        console.warn('Extended puzzle generation failed, using fallback');
        return generatePuzzle(difficulty);
    }
}

function generateOddOneOutPuzzle(difficulty) {
    const shapes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
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

    const A = shapes[Math.floor(Math.random() * (shapes.length - 1))];
    const AIndex = shapes.indexOf(A);
    const B = shapes[AIndex + 1];

    const C = shapes[Math.floor(Math.random() * (shapes.length - 1))];
    const CIndex = shapes.indexOf(C);
    const D = CIndex < shapes.length - 1 ? shapes[CIndex + 1] : 'circle';

    const makeShape = (type) => ({
        type: type,
        fill: 'empty',
        color: 'black',
        size: 'medium'
    });

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

function generateGridPuzzle(difficulty) {
    // Fallback to basic grid puzzle
    return generatePuzzle(difficulty);
}

function generateEquationPuzzle(difficulty) {
    const shapes = ['triangle', 'square', 'pentagon'];
    const values = { triangle: 3, square: 4, pentagon: 5 };

    const shape1 = shapes[Math.floor(Math.random() * shapes.length)];
    const shape2 = shapes[Math.floor(Math.random() * shapes.length)];
    const result = values[shape1] + values[shape2];

    // Find shape with closest value to result
    const resultShape = Object.keys(values).find(s => values[s] === result) || 'hexagon';

    const wrongOptions = shapes.filter(s => s !== resultShape).slice(0, 3);
    const options = [resultShape, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(resultShape);

    return {
        kind: 'equation',
        difficulty: difficulty,
        equation: {
            problem: `${shape1}(${values[shape1]}) + ${shape2}(${values[shape2]}) = ?`
        },
        options: options.map(type => ({
            type: type,
            fill: 'empty',
            color: 'black',
            size: 'medium'
        })),
        correctIndex: correctIndex,
        ruleDescription: `도형의 변 개수를 더하기: ${values[shape1]} + ${values[shape2]} = ${result}`
    };
}

// ============================================
// CSS Additions
// ============================================

const additionalStyles = `
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

    .analogy-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin: 20px 0;
        flex-wrap: wrap;
    }

    .analogy-pair {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .analogy-arrow {
        font-size: 1.5em;
        font-weight: bold;
        color: #666;
    }

    .analogy-separator {
        font-size: 1.5em;
        font-weight: bold;
        color: #666;
    }

    .analogy-question {
        font-size: 2em;
        font-weight: bold;
        color: #666;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed #ccc;
        border-radius: 8px;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    @media (max-width: 768px) {
        .analogy-display {
            flex-direction: column;
            gap: 15px;
        }

        .mode-card .mode-icon {
            font-size: 2rem;
        }

        .mode-card .mode-title {
            font-size: 1.2rem;
        }
    }
`;

// Inject additional styles
const gameStyleSheet = document.createElement('style');
gameStyleSheet.textContent = additionalStyles;
document.head.appendChild(gameStyleSheet);

// ============================================
// Initialize
// ============================================

window.addEventListener('load', function() {
    console.log('Game Modes System Loaded');
    showMainModes();
});