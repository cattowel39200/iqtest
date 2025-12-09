// ============================================
// Firebase Configuration & Initialization
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCh8Mz5MhNVq6GFg21N42tQZ5KamMJ94eE",
    authDomain: "iqzone-rankings.firebaseapp.com",
    projectId: "iqzone-rankings",
    storageBucket: "iqzone-rankings.firebasestorage.app",
    messagingSenderId: "820111197512",
    appId: "1:820111197512:web:b17f4f19c5f25724ff1f7d",
    measurementId: "G-L95JEJC6JC"
};

let db = null;
let isFirebaseEnabled = false;

function validateFirebaseAccess() {
    const allowedDomains = [
        'cattowel39200.github.io',
        'localhost',
        '127.0.0.1',
        'zrr.kr'
    ];
    const currentDomain = window.location.hostname;
    if (!allowedDomains.includes(currentDomain)) {
        console.warn(`Security Block: Domain ${currentDomain} not allowed.`);
        return false;
    }
    return true;
}

// Firebase Helper Functions
async function loadRankingsFromCloud() {
    if (!isFirebaseEnabled || !db) return null;
    try {
        const snapshot = await db.collection('rankings').doc('global').get();
        if (snapshot.exists) {
            const data = snapshot.data();
            return {
                allTime: data.allTime || [],
                weekly: data.weekly || {}
            };
        }
        return null;
    } catch (error) {
        console.warn("Failed to load rankings from cloud:", error);
        return null;
    }
}

async function saveRankingsToCloud(allTimeRankings, weeklyRankings) {
    if (!isFirebaseEnabled || !db) return;
    try {
        await db.collection('rankings').doc('global').set({
            allTime: allTimeRankings,
            weekly: weeklyRankings,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Rankings saved to cloud.");
    } catch (error) {
        console.warn("Failed to save rankings to cloud:", error);
    }
}

async function syncRankingsData() {
    if (!isFirebaseEnabled) return;
    try {
        const cloudData = await loadRankingsFromCloud();
        if (cloudData) {
            localStorage.setItem('iqTestRankings', JSON.stringify(cloudData.allTime));
            localStorage.setItem('iqTestWeeklyRankings', JSON.stringify(cloudData.weekly));
            console.log("Rankings synced from cloud.");
            refreshRanking();
            refreshWeeklyRanking();
        } else {
            const localAllTime = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
            const localWeekly = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');
            if (localAllTime.length > 0) {
                await saveRankingsToCloud(localAllTime, localWeekly);
                console.log("Local rankings uploaded to cloud.");
            }
        }
        if (UserManager) await UserManager.syncUserData();
    } catch (error) {
        console.warn("Error during ranking sync:", error);
    }
}

function initializeFirebase() {
    try {
        if (!validateFirebaseAccess()) {
            isFirebaseEnabled = false;
            return;
        }
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            isFirebaseEnabled = true;
            syncRankingsData();
        } else {
            console.warn("Firebase SDK not loaded.");
        }
    } catch (error) {
        console.error("Firebase initialization error:", error);
        isFirebaseEnabled = false;
    }
}

// ============================================
// User Management
// ============================================

const UserManager = {
    currentUser: null,
    init() {
        const saved = localStorage.getItem('iqTestUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.updateUI();
        }
    },
    getCurrentUser() {
        return this.currentUser;
    },
    login(nickname, age) {
        this.currentUser = { nickname, age, loginDate: new Date().toISOString() };
        localStorage.setItem('iqTestUser', JSON.stringify(this.currentUser));
        this.updateUI();
        return true;
    },
    logout() {
        this.currentUser = null;
        localStorage.removeItem('iqTestUser');
        this.updateUI();
        location.reload();
    },
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userInfo = document.getElementById('userInfo');
        const userDisplay = document.getElementById('userDisplay');
        const notLoggedInSection = document.getElementById('notLoggedInSection');
        const loggedInSection = document.getElementById('loggedInSection');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userInfo) userInfo.style.display = 'block';
            if (userDisplay) userDisplay.textContent = `${this.currentUser.nickname}님 (${this.currentUser.age}세)`;
            if (notLoggedInSection) notLoggedInSection.style.display = 'none';
            if (loggedInSection) loggedInSection.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
            if (notLoggedInSection) notLoggedInSection.style.display = 'block';
            if (loggedInSection) loggedInSection.style.display = 'none';
        }
    },
    async addTestRecord(data) {
        if (!this.currentUser) return;
        let records = JSON.parse(localStorage.getItem('iqTestRecords') || '[]');
        records.push({ ...data, nickname: this.currentUser.nickname, timestamp: new Date().toISOString() });
        localStorage.setItem('iqTestRecords', JSON.stringify(records));
    },
    generateUserId(nickname) {
        return nickname + '_' + Date.now().toString(36);
    },
    async syncUserData() {
        // Placeholder for user data sync
    }
};

function toggleRegisterForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
    }
}

function attemptLogin() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    const age = parseInt(document.getElementById('ageInput').value);

    if (!nickname || !age) {
        alert('닉네임과 나이를 입력해주세요.');
        return;
    }

    if (UserManager.login(nickname, age)) {
        alert('로그인되었습니다.');
        toggleRegisterForm();
    }
}

function attemptRegister() {
    attemptLogin();
}

function logout() {
    UserManager.logout();
}

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
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
        alert('테스트를 시작하려면 로그인이 필요합니다.');
        toggleRegisterForm();
        return;
    }

    userNickname = currentUser.nickname;
    userAge = currentUser.age;
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
    document.getElementById('mainDashboard').style.display = 'none';
    document.getElementById('evaluationSection').style.display = 'none';
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

function showResults() {
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

    if (UserManager.currentUser) {
        const testData = {
            date: new Date().toISOString(),
            score: results.score,
            iq: results.iq,
            type: selectedTestType,
            details: results
        };
        UserManager.addTestRecord(testData);
        if (selectedTestType === 'comprehensive') {
            saveToRankingWithSync(UserManager.currentUser.nickname, results.iq, classification.label, UserManager.currentUser.age);
        } else {
            saveToTypeRanking(UserManager.currentUser.nickname, results.iq, classification.label, UserManager.currentUser.age, selectedTestType, results);
        }
    }

    refreshRanking();
    refreshAllTypeRankings();
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

function saveToRankingWithSync(nickname, iq, classification, age) {
    let rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const newEntry = { nickname, iq, classification, age, date: new Date().toISOString() };

    const existingIndex = rankings.findIndex(r => r.nickname === nickname);
    if (existingIndex !== -1) {
        if (iq > rankings[existingIndex].iq) rankings[existingIndex] = newEntry;
    } else {
        rankings.push(newEntry);
    }
    rankings.sort((a, b) => b.iq - a.iq);
    localStorage.setItem('iqTestRankings', JSON.stringify(rankings));

    const weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');
    saveRankingsToCloud(rankings, weeklyRankings);
}

function saveToTypeRanking(nickname, iq, classification, age, type, results) {
    const key = `iqTest_${type}_Rankings`;
    let rankings = JSON.parse(localStorage.getItem(key) || '[]');
    const newEntry = { nickname, iq, classification, age, date: new Date().toISOString(), type, score: results.score };

    const existingIndex = rankings.findIndex(r => r.nickname === nickname);
    if (existingIndex !== -1) {
        if (iq > rankings[existingIndex].iq) rankings[existingIndex] = newEntry;
    } else {
        rankings.push(newEntry);
    }
    rankings.sort((a, b) => b.iq - a.iq);
    localStorage.setItem(key, JSON.stringify(rankings));
}

function refreshRanking() {
    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const list = document.getElementById('rankingList');
    if (!list) return;

    if (rankings.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">아직 등록된 랭킹이 없습니다.</div>';
        return;
    }

    const top5 = rankings.slice(0, 5);
    const remaining = rankings.slice(5);

    let html = top5.map((rank, index) => `
        <div style="display: flex; align-items: center; padding: 12px 15px; margin-bottom: 8px; background: ${getRankingBg(index)}; border-radius: 12px; border: 1px solid ${getRankingBorder(index)};">
            <div style="width: 30px; text-align: center; font-size: 1.2rem; font-weight: bold;">${getMedalIcon(index)}</div>
            <div style="flex: 1; margin-left: 10px;">
                <div style="font-weight: 700; color: #333;">${rank.nickname}</div>
                <div style="color: #666; font-size: 0.85rem;">${rank.classification}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: #007bff; font-size: 1.1rem;">IQ ${rank.iq}</div>
                <div style="color: #999; font-size: 0.8rem;">${new Date(rank.date).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('');

    if (remaining.length > 0) {
        html += `<div id="moreRankings" style="display: none;">
            ${remaining.map((rank, index) => `
                <div style="display: flex; align-items: center; padding: 10px 15px; margin-bottom: 8px; background: rgba(0,0,0,0.02); border-radius: 12px;">
                    <div style="width: 30px; text-align: center; font-weight: bold; color: #666;">${index + 6}</div>
                    <div style="flex: 1; margin-left: 10px;"><div style="font-weight: 600; color: #555;">${rank.nickname}</div></div>
                    <div style="text-align: right;"><div style="font-weight: 600; color: #555;">IQ ${rank.iq}</div></div>
                </div>
            `).join('')}
        </div>
        <button onclick="toggleMoreRankings()" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.05); border: none; border-radius: 10px; color: #666; cursor: pointer; margin-top: 10px;">더 많은 랭킹 보기 (${remaining.length}명)</button>`;
    }
    list.innerHTML = html;
}

function toggleMoreRankings() {
    const el = document.getElementById('moreRankings');
    const btn = event.target;
    if (el.style.display === 'none') {
        el.style.display = 'block';
        btn.textContent = '접기';
    } else {
        el.style.display = 'none';
        btn.textContent = `더 많은 랭킹 보기 (${document.querySelectorAll('#moreRankings > div').length}명)`;
    }
}

function getMedalIcon(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
}

function getRankingBg(index) {
    if (index === 0) return 'linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))';
    if (index === 1) return 'linear-gradient(90deg, rgba(192, 192, 192, 0.1), rgba(192, 192, 192, 0.05))';
    if (index === 2) return 'linear-gradient(90deg, rgba(205, 127, 50, 0.1), rgba(205, 127, 50, 0.05))';
    return 'white';
}

function getRankingBorder(index) {
    if (index === 0) return 'rgba(255, 215, 0, 0.3)';
    if (index === 1) return 'rgba(192, 192, 192, 0.3)';
    if (index === 2) return 'rgba(205, 127, 50, 0.3)';
    return 'rgba(0, 0, 0, 0.1)';
}

function refreshWeeklyRanking() {
    // Placeholder for weekly ranking logic
}

function refreshAllTypeRankings() {
    ['comprehensive', 'logic', 'spatial', 'memory'].forEach(type => {
        if (typeof refreshTestRankingPage === 'function') refreshTestRankingPage(type);
    });
}

function refreshTestRankingPage(type) {
    const key = type === 'comprehensive' ? 'iqTestRankings' : `iqTest_${type}_Rankings`;
    const rankings = JSON.parse(localStorage.getItem(key) || '[]');
    const list = document.getElementById(`${type}RankingList`);
    if (!list) return;

    if (rankings.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">랭킹 없음</div>';
        return;
    }

    list.innerHTML = rankings.slice(0, 10).map((rank, index) => `
        <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
            <div style="width: 30px;">${index + 1}</div>
            <div style="flex: 1;">${rank.nickname}</div>
            <div>IQ ${rank.iq}</div>
        </div>
    `).join('');
}

function showTestRanking(type) {
    document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${type}Tab`).classList.add('active');
    document.querySelectorAll('.ranking-section').forEach(s => s.style.display = 'none');
    document.getElementById(`${type}Ranking`).style.display = 'block';
    refreshTestRankingPage(type);
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
    initializeFirebase();
    UserManager.init();
    if (canvas) {
        window.addEventListener('resize', () => { resize(); initParticles(); });
        resize();
        initParticles();
        animate();
    }
    refreshRanking();
};
