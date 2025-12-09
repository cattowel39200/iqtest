// ============================================
// YouTube Stream Controller - Auto Problem Generation
// ============================================

class StreamController {
    constructor() {
        this.currentProblemNumber = 1;
        this.timer = 60; // 60 seconds
        this.timerInterval = null;
        this.currentProblem = null;
        this.viewerCount = 127;
        this.isActive = true;

        // Hook messages for engagement
        this.hookMessages = [
            "🔴 LIVE 💡 BrainFun Studio에서 여러분의 IQ를 테스트하세요!",
            "🧠 지금 참여하여 IQ 천재가 되어보세요!",
            "🎯 1분마다 새로운 도전! 채팅으로 정답을 맞춰보세요!",
            "🏆 실시간 랭킹 1위에 도전하세요!",
            "💡 BrainFun Studio - AI가 생성하는 무한 퍼즐!",
            "🔥 연속 정답으로 스트릭 보너스를 받으세요!",
            "⭐ 주간 랭킹에서 1위를 차지해보세요!"
        ];

        this.subHookMessages = [
            "⏰ 1분마다 새로운 문제 | 💬 채팅으로 정답 입력 | 🏆 실시간 순위",
            "🎮 다양한 문제 유형 | 🧩 무한 생성 | 📊 실시간 통계",
            "🔥 스트릭 보너스 | ⭐ 주간 랭킹 | 💎 포인트 시스템",
            "📱 모바일 최적화 | 🌟 AI 자동 생성 | 🏅 레벨 시스템",
            "🎯 수열/비례/그리드 문제 | 🧠 멘사급 난이도 | 📈 IQ 측정"
        ];
    }

    // ============================================
    // Stream Initialization
    // ============================================

    init() {
        console.log('🔴 YouTube Stream Starting...');
        this.startTimer();
        this.generateNewProblem();
        this.startHookRotation();
        this.simulateViewerCount();
        this.setupEventListeners();

        console.log('✅ Stream Active - Problem updates every 60 seconds');
    }

    setupEventListeners() {
        // Handle page visibility (pause when tab not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseStream();
            } else {
                this.resumeStream();
            }
        });

        // Keyboard shortcuts for stream control
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.generateNewProblem();
                this.resetTimer();
            }
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
    }

    // ============================================
    // Timer Management
    // ============================================

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (!this.isActive) return;

            this.timer--;
            this.updateTimerDisplay();

            // Add visual effects as timer gets low
            if (this.timer <= 10) {
                document.getElementById('timer').classList.add('glow');
                if (this.timer <= 5) {
                    document.getElementById('nextProblemText').style.animation = 'blink 0.3s infinite';
                }
            }

            // Generate new problem when timer hits 0
            if (this.timer <= 0) {
                this.generateNewProblem();
                this.resetTimer();
            }
        }, 1000);
    }

    resetTimer() {
        this.timer = 60;
        document.getElementById('timer').classList.remove('glow');
        document.getElementById('nextProblemText').style.animation = 'blink 1s infinite';
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update next problem text based on timer
        const nextText = document.getElementById('nextProblemText');
        if (this.timer > 10) {
            nextText.textContent = '곧 새로운 문제가 나타납니다!';
        } else if (this.timer > 5) {
            nextText.textContent = '🔥 새로운 문제 준비중...';
        } else {
            nextText.textContent = '⚡ 잠시 후 문제 교체!';
        }
    }

    pauseStream() {
        this.isActive = false;
        console.log('⏸️ Stream paused');
    }

    resumeStream() {
        this.isActive = true;
        console.log('▶️ Stream resumed');
    }

    togglePause() {
        this.isActive = !this.isActive;
        console.log(this.isActive ? '▶️ Stream resumed' : '⏸️ Stream paused');
    }

    // ============================================
    // Problem Generation
    // ============================================

    generateNewProblem() {
        try {
            // Try to use advanced generators first
            if (typeof generateExtendedPuzzle !== 'undefined') {
                this.generateAdvancedProblem();
            } else if (typeof generatePuzzle !== 'undefined') {
                this.generateBasicProblem();
            } else {
                this.generateDemoProblem();
            }
        } catch (error) {
            console.error('Problem generation failed:', error);
            this.generateDemoProblem();
        }

        // Update problem counter
        this.currentProblemNumber++;
        this.updateProblemCounter();

        // Add visual effects
        this.addProblemTransition();

        console.log(`Generated Problem #${this.currentProblemNumber}`);
    }

    generateAdvancedProblem() {
        const types = ['sequence', 'odd-one-out', 'analogy'];
        const difficulties = ['easy', 'medium', 'hard'];

        // Weight selection based on viewer engagement patterns
        const typeWeights = { 'sequence': 40, 'odd-one-out': 35, 'analogy': 25 };
        const difficultyWeights = { 'easy': 30, 'medium': 50, 'hard': 20 };

        const selectedType = this.weightedChoice(typeWeights);
        const selectedDifficulty = this.weightedChoice(difficultyWeights);

        this.currentProblem = generateExtendedPuzzle(selectedType, selectedDifficulty);
        this.displayProblem(this.currentProblem);
    }

    generateBasicProblem() {
        const difficulties = ['easy', 'medium', 'hard'];
        const weights = { 'easy': 35, 'medium': 45, 'hard': 20 };
        const selectedDifficulty = this.weightedChoice(weights);

        this.currentProblem = generatePuzzle(selectedDifficulty);
        this.displayProblem(this.currentProblem);
    }

    generateDemoProblem() {
        // Fallback demo problems for when generators aren't available
        const demoProblems = [
            {
                type: 'sequence',
                title: '다음 패턴을 보고 빈칸에 들어갈 도형을 선택하세요',
                sequence: ['●', '●●', '●●●'],
                options: ['●●●●', '●●', '○○○○', '■■■■'],
                correctIndex: 0,
                difficulty: 'easy',
                ruleDescription: '점의 개수가 1씩 증가하는 패턴'
            },
            {
                type: 'pattern',
                title: '다음 중 다른 하나를 찾으세요',
                sequence: ['■', '■', '■', '●'],
                options: ['■', '●', '△', '○'],
                correctIndex: 1,
                difficulty: 'easy',
                ruleDescription: '3개는 사각형, 1개만 원'
            },
            {
                type: 'progression',
                title: '수열의 규칙을 찾아 다음을 선택하세요',
                sequence: ['△', '■', '⬟'],
                options: ['⬢', '●', '◆', '⭐'],
                correctIndex: 0,
                difficulty: 'medium',
                ruleDescription: '다각형의 변이 1개씩 증가: 3→4→5→6'
            }
        ];

        this.currentProblem = demoProblems[Math.floor(Math.random() * demoProblems.length)];
        this.displayDemoProblem(this.currentProblem);
    }

    weightedChoice(weights) {
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

    // ============================================
    // Problem Display
    // ============================================

    displayProblem(problem) {
        const sequenceDisplay = document.getElementById('sequenceDisplay');
        const optionsDisplay = document.getElementById('optionsDisplay');

        // Clear previous content
        sequenceDisplay.innerHTML = '';
        optionsDisplay.innerHTML = '';

        // Update problem title
        const problemTitle = document.getElementById('problemTitle');
        if (problem.kind === 'analogy') {
            problemTitle.textContent = 'A → B 관계를 C → ? 에 적용하세요';
        } else if (problem.kind === 'odd-one-out') {
            problemTitle.textContent = '다음 중 나머지 셋과 다른 하나는?';
        } else {
            problemTitle.textContent = '다음 패턴을 보고 빈칸에 들어갈 도형을 선택하세요';
        }

        // Display sequence or analogy pairs
        if (problem.analogyPairs) {
            this.displayAnalogy(problem.analogyPairs, sequenceDisplay);
        } else if (problem.sequence) {
            this.displaySequence(problem.sequence, sequenceDisplay);
        }

        // Display options
        this.displayOptions(problem.options, optionsDisplay);

        // Update difficulty display
        this.updateDifficultyDisplay(problem.difficulty);
    }

    displayDemoProblem(problem) {
        const sequenceDisplay = document.getElementById('sequenceDisplay');
        const optionsDisplay = document.getElementById('optionsDisplay');

        sequenceDisplay.innerHTML = '';
        optionsDisplay.innerHTML = '';

        document.getElementById('problemTitle').textContent = problem.title;

        // Display sequence
        problem.sequence.forEach(item => {
            const element = document.createElement('div');
            element.className = 'shape-item';
            element.innerHTML = `<div style="font-size: 2.5rem; font-weight: bold;">${item}</div>`;
            sequenceDisplay.appendChild(element);
        });

        // Add arrow and question mark for sequence type
        if (problem.type === 'sequence' || problem.type === 'progression') {
            const arrow = document.createElement('div');
            arrow.className = 'sequence-arrow';
            arrow.textContent = '→';
            sequenceDisplay.appendChild(arrow);

            const question = document.createElement('div');
            question.className = 'missing-indicator';
            question.textContent = '?';
            sequenceDisplay.appendChild(question);
        }

        // Display options
        problem.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';

            const label = document.createElement('div');
            label.className = 'option-label';
            label.textContent = String.fromCharCode(65 + index);
            optionElement.appendChild(label);

            const content = document.createElement('div');
            content.innerHTML = `<div style="font-size: 2rem; font-weight: bold;">${option}</div>`;
            optionElement.appendChild(content);

            optionsDisplay.appendChild(optionElement);
        });

        this.updateDifficultyDisplay(problem.difficulty);
    }

    displayAnalogy(analogyPairs, container) {
        const { A, B, C } = analogyPairs;

        // A → B
        container.appendChild(this.createShapeElement(A));

        const arrow1 = document.createElement('div');
        arrow1.className = 'sequence-arrow';
        arrow1.textContent = '→';
        container.appendChild(arrow1);

        container.appendChild(this.createShapeElement(B));

        // ::
        const separator = document.createElement('div');
        separator.className = 'sequence-arrow';
        separator.textContent = '::';
        separator.style.fontSize = '2rem';
        container.appendChild(separator);

        // C → ?
        container.appendChild(this.createShapeElement(C));

        const arrow2 = document.createElement('div');
        arrow2.className = 'sequence-arrow';
        arrow2.textContent = '→';
        container.appendChild(arrow2);

        const question = document.createElement('div');
        question.className = 'missing-indicator';
        question.textContent = '?';
        container.appendChild(question);
    }

    displaySequence(sequence, container) {
        sequence.forEach(item => {
            container.appendChild(this.createShapeElement(item));
        });

        const arrow = document.createElement('div');
        arrow.className = 'sequence-arrow';
        arrow.textContent = '→';
        container.appendChild(arrow);

        const question = document.createElement('div');
        question.className = 'missing-indicator';
        question.textContent = '?';
        container.appendChild(question);
    }

    displayOptions(options, container) {
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';

            const label = document.createElement('div');
            label.className = 'option-label';
            label.textContent = String.fromCharCode(65 + index);
            optionElement.appendChild(label);

            const shapeElement = this.createShapeElement(option);
            optionElement.appendChild(shapeElement);

            container.appendChild(optionElement);
        });
    }

    createShapeElement(shapeData) {
        const container = document.createElement('div');
        container.className = 'shape-item';

        if (shapeData.type) {
            const shape = document.createElement('div');
            shape.className = `shape ${shapeData.type}`;

            // Add dots if present
            if (shapeData.dots && shapeData.dots > 0) {
                shape.textContent = '●'.repeat(Math.min(shapeData.dots, 10));
                shape.style.fontSize = shapeData.dots > 5 ? '1rem' : '1.5rem';
                shape.style.lineHeight = '1.2';
            }

            // Add color styling
            if (shapeData.color === 'gray') {
                shape.style.opacity = '0.6';
            } else if (shapeData.color === 'white') {
                shape.style.backgroundColor = 'white';
                shape.style.border = '2px solid #333';
            }

            container.appendChild(shape);
        } else if (shapeData.display) {
            // Simple text display for demo problems
            container.innerHTML = `<div style="font-size: 2rem; font-weight: bold;">${shapeData.display}</div>`;
        } else {
            // Fallback display
            container.innerHTML = '<div style="font-size: 2rem;">●</div>';
        }

        return container;
    }

    // ============================================
    // UI Updates
    // ============================================

    updateProblemCounter() {
        document.getElementById('problemNumber').textContent = this.currentProblemNumber;
        document.getElementById('displayProblemNumber').textContent = this.currentProblemNumber;
    }

    updateDifficultyDisplay(difficulty) {
        const difficultyNames = { easy: '초급', medium: '중급', hard: '고급' };
        const difficultyElement = document.getElementById('currentDifficulty');
        difficultyElement.textContent = difficultyNames[difficulty] || '중급';

        // Add difficulty-specific styling
        const problemDisplay = document.getElementById('problemDisplay');
        problemDisplay.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard');
        problemDisplay.classList.add(`difficulty-${difficulty}`);
    }

    addProblemTransition() {
        const problemDisplay = document.getElementById('problemDisplay');
        problemDisplay.classList.add('bounce-in');

        setTimeout(() => {
            problemDisplay.classList.remove('bounce-in');
        }, 500);

        // Add shake effect to timer
        document.getElementById('timer-section')?.classList.add('shake');
        setTimeout(() => {
            document.getElementById('timer-section')?.classList.remove('shake');
        }, 500);
    }

    // ============================================
    // Engagement Features
    // ============================================

    startHookRotation() {
        let hookIndex = 0;
        let subHookIndex = 0;

        // Rotate main hook message every 8 seconds
        setInterval(() => {
            if (!this.isActive) return;

            hookIndex = (hookIndex + 1) % this.hookMessages.length;
            document.getElementById('hookText').textContent = this.hookMessages[hookIndex];
        }, 8000);

        // Rotate sub hook message every 12 seconds
        setInterval(() => {
            if (!this.isActive) return;

            subHookIndex = (subHookIndex + 1) % this.subHookMessages.length;
            document.getElementById('subHook').textContent = this.subHookMessages[subHookIndex];
        }, 12000);
    }

    simulateViewerCount() {
        setInterval(() => {
            if (!this.isActive) return;

            // Simulate realistic viewer count changes
            const change = Math.floor(Math.random() * 20) - 8; // ±8 viewers
            this.viewerCount += change;
            this.viewerCount = Math.max(50, Math.min(800, this.viewerCount)); // Keep between 50-800

            document.getElementById('viewerCount').textContent = this.viewerCount;
        }, 5000);
    }

    // ============================================
    // Utility Methods
    // ============================================

    // Manual control methods for streamer
    nextProblem() {
        this.generateNewProblem();
        this.resetTimer();
    }

    setDifficulty(difficulty) {
        console.log(`🎯 Difficulty set to: ${difficulty}`);
        // Could be used for manual difficulty control
    }

    getStreamStats() {
        return {
            problemNumber: this.currentProblemNumber,
            viewerCount: this.viewerCount,
            timeRemaining: this.timer,
            isActive: this.isActive,
            currentDifficulty: this.currentProblem?.difficulty
        };
    }
}

// ============================================
// Initialize Stream Controller
// ============================================

let streamController;

window.addEventListener('load', function() {
    streamController = new StreamController();
    streamController.init();

    // Make controller available globally for debugging
    window.streamController = streamController;

    console.log('🎥 Stream Controller Ready');
    console.log('Keyboard shortcuts: N = Next Problem, P = Pause/Resume');
});