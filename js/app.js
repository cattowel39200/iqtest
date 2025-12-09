

// ============================================
// Global State & Test Logic
// ============================================

let currentQuestionIndex = 0;
let allQuestions = [];
let answers = [];
let timer = null;
let timeLeft = 60;
let startTime = null;
let responseTimes = [];
let userAge = null;
let userNickname = null;
let testResults = null;
let selectedTestType = 'comprehensive';
let currentTestConfig = null;

function selectTestType(type) {
    selectedTestType = type;
    document.querySelectorAll('.test-type-card').forEach(card => card.classList.remove('selected'));
    const selectedCard = event.target.closest('.test-type-card');
    if (selectedCard) selectedCard.classList.add('selected');

    const typeNames = {
        comprehensive: '종합테스트',
        easy: '쉬운테스트',
        medium: '중간테스트',
        hard: '고난도테스트'
    };
    const typeLabel = document.getElementById('selectedTestType');
    if (typeLabel) typeLabel.textContent = typeNames[type];

    startTest();
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startTest() {
    userNickname = 'Guest';
    userAge = 25;
    console.log('Starting test for:', userNickname);

    if (selectedTestType === 'comprehensive') {
        allQuestions = [
            ...shuffleArray(questions.perceptual),
            ...shuffleArray(questions.spatial),
            ...shuffleArray(questions.quantitative),
            ...shuffleArray(questions.logical),
            ...shuffleArray(questions.verbal)
        ].slice(0, 25);
        currentTestConfig = { name: '종합테스트', timeLimit: 60, totalQuestions: 25 };
    } else {
        const testConfig = testTypes[selectedTestType];
        allQuestions = shuffleArray([...testConfig.questions]);
        currentTestConfig = {
            name: testConfig.name,
            timeLimit: testConfig.timePerQuestion,
            totalQuestions: testConfig.totalQuestions
        };
    }

    answers = new Array(allQuestions.length).fill(null);
    responseTimes = new Array(allQuestions.length).fill(null);

    document.getElementById('intro').style.display = 'none';
    const evaluationSection = document.getElementById('evaluationSection');
    if (evaluationSection) evaluationSection.style.display = 'none';
    const rankingSection = document.querySelector('.ranking-grid-container');
    if (rankingSection) rankingSection.style.display = 'none';

    // 메인 베너 숨기기
    const headerBanner = document.querySelector('header');
    if (headerBanner) headerBanner.style.display = 'none';

    document.getElementById('test').style.display = 'block';

    loadQuestion(0);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = allQuestions[index];

    document.getElementById('progress').style.width = `${((index + 1) / allQuestions.length) * 100}%`;
    document.getElementById('questionNum').textContent = `문제 ${index + 1}/${allQuestions.length}`;

    const catBadge = document.getElementById('categoryBadge');
    if (catBadge) catBadge.textContent = selectedTestType === 'comprehensive' ? q.categoryName : (q.type || '일반');

    const difficultyBadge = document.getElementById('difficultyBadge');
    const difficultyMap = {
        1: { text: '쉬움', class: 'difficulty-easy' },
        2: { text: '보통', class: 'difficulty-medium' },
        3: { text: '어려움', class: 'difficulty-hard' },
        4: { text: '전문가', class: 'difficulty-expert' },
        5: { text: '천재', class: 'difficulty-genius' }
    };
    const difficulty = difficultyMap[q.difficulty] || difficultyMap[3];
    if (difficultyBadge) {
        difficultyBadge.textContent = difficulty.text;
        difficultyBadge.className = `difficulty-badge ${difficulty.class}`;
    }

    const contentDiv = document.getElementById('questionContent');
    contentDiv.innerHTML = renderQuestionContent(q);

    const optionsDiv = document.getElementById('optionsGrid');
    optionsDiv.innerHTML = q.options.map((opt, i) => `
        <div class="option" onclick="selectOption(${i})" data-index="${i}">
            <span class="option-label">${opt}</span>
        </div>
    `).join('');

    if (answers[index] !== null) {
        const selectedOption = optionsDiv.querySelector(`[data-index="${answers[index]}"]`);
        if (selectedOption) selectedOption.classList.add('selected');
        document.getElementById('nextBtn').disabled = false;
    } else {
        document.getElementById('nextBtn').disabled = true;
    }

    startTimer();
    startTime = Date.now();
}

function renderQuestionContent(q) {
    let html = `<p class="question-text">${q.question}</p>`;
    if (q.questionText) {
        html += `<div class="question-detail" style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px; font-family: monospace;">${q.questionText}</div>`;
    }
    if (q.matrix) {
        html += '<div class="matrix-grid">';
        q.matrix.forEach((cell) => {
            const isEmpty = cell === '?';
            html += `<div class="matrix-cell ${isEmpty ? 'empty' : ''}">${isEmpty ? '?' : cell}</div>`;
        });
        html += '</div>';
    }
    if (q.sequence) {
        html += '<div class="sequence-display">';
        q.sequence.forEach(item => {
            const isUnknown = item === '?';
            html += `<div class="sequence-item ${isUnknown ? 'unknown' : ''}">${item}</div>`;
        });
        html += '</div>';
    }
    if (q.analogy) {
        html += '<div class="analogy-display">';
        html += `<span class="analogy-item">${q.analogy[0]}</span><span class="analogy-separator">:</span>`;
        html += `<span class="analogy-item">${q.analogy[1]}</span><span class="analogy-separator">=</span>`;
        html += `<span class="analogy-item">${q.analogy[2]}</span><span class="analogy-separator">:</span>`;
        html += `<span class="analogy-item unknown">?</span></div>`;
    }
    if (q.shapeType === 'cube' && q.cubeNet) {
        html += `<div style="text-align: center; margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;"><p style="color: #8892b0;">${q.cubeNet}</p></div>`;
    }
    if (q.shapeType === 'rotation' && q.shape) {
        html += `<div style="text-align: center; margin: 20px 0; font-size: 3rem;">${q.shape}</div>`;
    }
    return html;
}

function startTimer() {
    clearInterval(timer);
    timeLeft = currentTestConfig ? currentTestConfig.timeLimit : 60;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNext();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    if (timerEl) {
        timerEl.textContent = `${timeLeft}초`;
        timerEl.style.color = timeLeft <= 10 ? '#ff6b6b' : '#333333';
    }
}

function selectOption(index) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    const selected = document.querySelector(`[data-index="${index}"]`);
    if (selected) selected.classList.add('selected');
    answers[currentQuestionIndex] = index;
    responseTimes[currentQuestionIndex] = Date.now() - startTime;
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    clearInterval(timer);
    if (currentQuestionIndex < allQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

function skipQuestion() {
    clearInterval(timer);
    responseTimes[currentQuestionIndex] = 60000;
    if (currentQuestionIndex < allQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

function autoNext() {
    responseTimes[currentQuestionIndex] = 60000;
    if (currentQuestionIndex < allQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        showResults();
    }
}

// ============================================
// Results Calculation (IRT & Scoring)
// ============================================

function calculateScore(correctAnswers, totalQuestions, averageTime, maxTime) {
    const accuracyScore = (correctAnswers / totalQuestions) * 100;
    const timeEfficiency = Math.max(0, (maxTime - averageTime) / maxTime);
    const timeBonus = timeEfficiency * 20;
    const finalScore = Math.round(accuracyScore + timeBonus);
    return {
        finalScore: Math.max(0, Math.min(120, finalScore)),
        accuracyScore: Math.round(accuracyScore),
        timeBonus: Math.round(timeBonus),
        timeEfficiency: Math.round(timeEfficiency * 100)
    };
}

function calculateNewTestResults() {
    let totalCorrect = 0;
    let totalTime = 0;
    let validResponses = 0;

    for (let i = 0; i < allQuestions.length; i++) {
        if (answers[i] !== null) {
            if (answers[i] === allQuestions[i].correct) {
                totalCorrect++;
            }
            if (responseTimes[i] && responseTimes[i] < (currentTestConfig.timeLimit * 1000)) {
                totalTime += responseTimes[i];
                validResponses++;
            }
        }
    }

    const averageTime = validResponses > 0 ? (totalTime / validResponses / 1000) : currentTestConfig.timeLimit;
    const maxTime = currentTestConfig.timeLimit;
    const scoreResult = calculateScore(totalCorrect, allQuestions.length, averageTime, maxTime);
    const rawScore = scoreResult.finalScore || 0;
    const iqScore = Math.round(70 + (Math.max(0, Math.min(120, rawScore)) / 120) * 70);

    return {
        score: scoreResult.finalScore,
        iq: iqScore,
        accuracyScore: scoreResult.accuracyScore,
        timeBonus: scoreResult.timeBonus,
        timeEfficiency: scoreResult.timeEfficiency,
        totalCorrect,
        totalQuestions: allQuestions.length,
        averageTime: Math.round(averageTime),
        testType: selectedTestType,
        testName: currentTestConfig.name
    };
}

function calculateResults() {
    const categoryScores = {
        perceptual: { correct: 0, total: 0, ability: 0 },
        quantitative: { correct: 0, total: 0, ability: 0 },
        spatial: { correct: 0, total: 0, ability: 0 },
        logical: { correct: 0, total: 0, ability: 0 },
        verbal: { correct: 0, total: 0, ability: 0 }
    };
    let totalCorrect = 0;
    let itemParameters = [];

    allQuestions.forEach((q, i) => {
        const isCorrect = answers[i] === q.correct;
        const category = q.category || 'general';
        if (categoryScores[category]) {
            categoryScores[category].total++;
        }

        const itemParam = {
            difficulty: mapDifficultyToTheta(q.difficulty),
            discrimination: getDifficultyDiscrimination(q.difficulty),
            guessing: 0.2,
            response: isCorrect ? 1 : 0,
            category: category
        };
        itemParameters.push(itemParam);

        if (isCorrect) {
            if (categoryScores[category]) categoryScores[category].correct++;
            totalCorrect++;
        }
    });

    const overallAbility = estimateAbilityMLE(itemParameters);
    ['perceptual', 'quantitative', 'spatial', 'logical', 'verbal'].forEach(category => {
        const categoryItems = itemParameters.filter(item => item.category === category);
        if (categoryItems.length > 0) {
            categoryScores[category].ability = estimateAbilityMLE(categoryItems);
        }
    });

    let iqScore = Math.round(100 + (overallAbility * 15));
    const currentYear = new Date().getFullYear();
    const flynnCorrection = (currentYear - 2020) * -0.3;
    iqScore = Math.round(iqScore + flynnCorrection);
    iqScore += calculatePsychometricAgeAdjustment(userAge || 20);

    const reliability = calculateInternalConsistency(itemParameters);
    const confidenceInterval = calculateConfidenceInterval(iqScore, reliability);
    const finalIQ = Math.max(40, Math.min(160, iqScore));

    return {
        iq: finalIQ,
        ability: overallAbility,
        categoryScores,
        totalCorrect,
        totalQuestions: allQuestions.length,
        reliability: reliability,
        confidenceInterval: confidenceInterval,
        measurementError: calculateStandardError(overallAbility, itemParameters)
    };
}

function getDifficultyDiscrimination(difficulty) {
    const map = { 1: 0.8, 2: 1.2, 3: 1.5, 4: 1.8, 5: 2.0 };
    return map[difficulty] || 1.0;
}

function mapDifficultyToTheta(difficulty) {
    const map = { 1: -1.5, 2: -0.5, 3: 0.0, 4: 1.0, 5: 2.0 };
    return map[difficulty] || 0.0;
}

function estimateAbilityMLE(itemParams) {
    if (itemParams.length === 0) return 0;
    let theta = 0;
    for (let iter = 0; iter < 50; iter++) {
        let logLikelihood = 0, firstDerivative = 0, secondDerivative = 0;
        itemParams.forEach(item => {
            const prob = irtProbability(theta, item.discrimination, item.difficulty, item.guessing);
            const q = 1 - prob;
            if (item.response === 1) {
                logLikelihood += Math.log(Math.max(prob, 0.001));
                firstDerivative += item.discrimination * q;
                secondDerivative -= item.discrimination * item.discrimination * prob * q;
            } else {
                logLikelihood += Math.log(Math.max(q, 0.001));
                firstDerivative -= item.discrimination * prob;
                secondDerivative -= item.discrimination * item.discrimination * prob * q;
            }
        });
        const deltaTheta = firstDerivative / Math.abs(secondDerivative);
        theta += deltaTheta;
        if (Math.abs(deltaTheta) < 0.001) break;
    }
    return Math.max(-4, Math.min(4, theta));
}

function irtProbability(theta, a, b, c) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

function calculatePsychometricAgeAdjustment(age) {
    if (age < 16) return Math.max(-20, (16 - age) * -2.5);
    if (age <= 24) return 2 + (24 - age) * 0.2;
    if (age <= 34) return 2;
    if (age <= 44) return 3;
    if (age <= 54) return 2;
    if (age <= 64) return 1 - (age - 54) * 0.3;
    if (age <= 74) return -2 - (age - 64) * 0.5;
    return Math.max(-15, -7 - (age - 74) * 0.8);
}

function calculateInternalConsistency(itemParams) {
    if (itemParams.length < 2) return 0.7;
    const k = itemParams.length;
    let sumVariances = 0;
    let responses = itemParams.map(item => item.response);
    let totalVariance = variance(responses);
    itemParams.forEach(item => { sumVariances += item.response * (1 - item.response); });
    const alpha = (k / (k - 1)) * (1 - (sumVariances / totalVariance));
    return Math.max(0, Math.min(1, alpha));
}

function variance(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2)) / arr.length;
}

function calculateConfidenceInterval(iqScore, reliability) {
    const standardError = 15 * Math.sqrt(1 - reliability);
    return {
        lower: Math.round(iqScore - 1.96 * standardError),
        upper: Math.round(iqScore + 1.96 * standardError),
        margin: Math.round(1.96 * standardError)
    };
}

function calculateStandardError(ability, itemParams) {
    let information = 0;
    itemParams.forEach(item => {
        const prob = irtProbability(ability, item.discrimination, item.difficulty, item.guessing);
        const q = 1 - prob;
        information += Math.pow(item.discrimination, 2) * Math.pow(prob - item.guessing, 2) * q / Math.pow(1 - item.guessing, 2) / prob;
    });
    return information > 0 ? 1 / Math.sqrt(information) : 1.0;
}

function getIQClassification(iq) {
    if (iq >= 130) return { label: '매우 우수 (Very Superior)', desc: '상위 2.1% 이내의 뛰어난 인지능력입니다.', percentile: 97.9 };
    if (iq >= 120) return { label: '우수 (Superior)', desc: '상위 6.7% 이내의 우수한 인지능력입니다.', percentile: 93.3 };
    if (iq >= 110) return { label: '평균 상 (High Average)', desc: '상위 25% 이내의 양호한 인지능력입니다.', percentile: 75 };
    if (iq >= 90) return { label: '평균 (Average)', desc: '일반 인구의 50%가 속하는 정상 범위입니다.', percentile: 50 };
    if (iq >= 80) return { label: '평균 하 (Low Average)', desc: '하위 25% 범위이나 정상적인 일상 기능 수행이 가능합니다.', percentile: 25 };
    if (iq >= 70) return { label: '경계선 (Borderline)', desc: '하위 2-9% 범위로 일부 영역에서 지원이 필요할 수 있습니다.', percentile: 6.7 };
    return { label: '인지기능 저하 의심', desc: '하위 2.1% 범위로 전문가 평가를 권장합니다.', percentile: 2.1 };
}

async function showResults() {
    document.getElementById('test').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const results = selectedTestType === 'comprehensive' ? calculateResults() : calculateNewTestResults();
    const classification = getIQClassification(results.iq || results.score);
    testResults = results;

    let displayScore = 70;
    if (results && results.iq && !isNaN(results.iq) && results.iq > 0) {
        displayScore = results.iq;
    } else if (results && results.score && !isNaN(results.score)) {
        const safeScore = Math.max(0, Math.min(120, results.score));
        displayScore = Math.round(70 + (safeScore / 120) * 70);
    } else {
        displayScore = 85;
    }

    const iqElement = document.getElementById('iqScore');
    if (iqElement) {
        iqElement.textContent = displayScore;
        iqElement.style.color = '#007bff';
    }

    const classLabel = document.getElementById('classLabel');
    const classDesc = document.getElementById('classDesc');
    if (classLabel) classLabel.textContent = classification.label;
    if (classDesc) classDesc.textContent = classification.desc;

    const percentileEl = document.getElementById('percentile');
    if (percentileEl) {
        if (selectedTestType === 'comprehensive') {
            percentileEl.textContent = `상위 ${(100 - classification.percentile).toFixed(1)}% (백분위 ${classification.percentile})`;
        } else {
            percentileEl.textContent = `정확도 ${results.accuracyScore}점 + 시간보너스 ${results.timeBonus}점 = IQ ${displayScore}`;
        }
    }

    if (results.measurementError) {
        const errorElement = document.getElementById('measurementInfo');
        if (errorElement) {
            const margin = Math.round(results.measurementError);
            errorElement.textContent = `95% 신뢰구간: ${Math.round(results.iq - 1.96 * margin)} - ${Math.round(results.iq + 1.96 * margin)} (오차: ±${margin})`;
        }
    }

    const categoryAnalysisElement = document.getElementById('categoryAnalysis');
    if (selectedTestType === 'comprehensive' && results.categoryScores && categoryAnalysisElement) {
        // Simple visualization for categories
        let html = '<h3 style="margin-bottom: 30px; color: #333;">영역별 분석</h3>';
        const catNames = {
            perceptual: '지각 추론', quantitative: '수리 논리', spatial: '시공간 처리', logical: '논리 추론', verbal: '언어 이해'
        };
        for (const [key, val] of Object.entries(results.categoryScores)) {
            const score = val.correct; // Simplified
            const width = (score / 5) * 100;
            html += `
                <div class="result-category">
                    <h4>${catNames[key] || key}</h4>
                    <div class="result-bar"><div class="result-bar-fill" style="width: ${width}%"></div></div>
                    <div class="result-score">${score}/5</div>
                </div>`;
        }
        categoryAnalysisElement.innerHTML = html;
    }

    // 테스트 결과 저장 및 랭킹 시스템 제거됨
}

// ============================================
// Ranking Logic
// ============================================

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
}

// ============================================
// Animation & Security
// ============================================

const canvas = document.getElementById('brainCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

class Particle {
    constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    if (!canvas) return;
    particles = [];
    const count = Math.min(100, (canvas.width * canvas.height) / 15000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(123, 44, 191, ${0.2 * (1 - dist / 150)})`;
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animate);
}

// Security Placeholder
const securityLog = {
    events: [],
    log(type, msg) { this.events.push({ type, msg, time: new Date() }); },
    getStats() { return { total: this.events.length }; }
};
function performSecurityChecks() { /* ... */ }

// Initialization
window.onload = function () {
    if (canvas) {
        window.addEventListener('resize', () => { resize(); initParticles(); });
        resize();
        initParticles();
        animate();
    }
};
