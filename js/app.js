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
        'zrr.kr',
        // GitHub Pages 도메인
        'github.io',  // 모든 GitHub Pages 서브도메인 허용
        // 추가 도메인들
        'file',  // 로컬 파일 시스템 (file://)
        '',      // 빈 hostname (로컬 파일)
        '0.0.0.0',
        '192.168.',  // 로컬 네트워크 (부분 일치)
        '10.',       // 로컬 네트워크 (부분 일치)
        '172.',      // 로컬 네트워크 (부분 일치)
    ];

    const currentDomain = window.location.hostname;
    const currentProtocol = window.location.protocol;

    // 로컬 파일 시스템 허용
    if (currentProtocol === 'file:' || !currentDomain || currentDomain === '') {
        console.log('Firebase: Local file system detected, allowing access');
        return true;
    }

    // 정확한 도메인 매칭
    if (allowedDomains.includes(currentDomain)) {
        console.log(`Firebase: Domain ${currentDomain} allowed`);
        return true;
    }

    // GitHub Pages 서브도메인 체크 (*.github.io)
    if (currentDomain.endsWith('.github.io')) {
        console.log(`Firebase: GitHub Pages domain ${currentDomain} allowed`);
        return true;
    }

    // 로컬 네트워크 IP 범위 체크
    const localNetworkPatterns = ['192.168.', '10.', '172.'];
    for (const pattern of localNetworkPatterns) {
        if (currentDomain.startsWith(pattern)) {
            console.log(`Firebase: Local network ${currentDomain} allowed`);
            return true;
        }
    }

    console.warn(`Security Block: Domain ${currentDomain} not allowed.`);
    console.warn(`Protocol: ${currentProtocol}, Full URL: ${window.location.href}`);
    return false;
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
    if (!isFirebaseEnabled) {
        console.log("Firebase not enabled, skipping cloud sync");
        return;
    }

    console.log("Starting rankings data synchronization...");

    try {
        const cloudData = await loadRankingsFromCloud();

        if (cloudData && cloudData.allTime && cloudData.allTime.length > 0) {
            console.log(`Found ${cloudData.allTime.length} rankings in cloud`);
            localStorage.setItem('iqTestRankings', JSON.stringify(cloudData.allTime));
            localStorage.setItem('iqTestWeeklyRankings', JSON.stringify(cloudData.weekly || {}));
            console.log("Rankings synced from cloud to local storage");
            refreshRanking();
            refreshWeeklyRanking();
        } else {
            console.log("No cloud data found, checking local data...");
            const localAllTime = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
            const localWeekly = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');

            if (localAllTime.length > 0) {
                console.log(`Uploading ${localAllTime.length} local rankings to cloud`);
                await saveRankingsToCloud(localAllTime, localWeekly);
                console.log("Local rankings uploaded to cloud successfully");
            } else {
                console.log("No local rankings to upload");
            }
        }

        if (UserManager && typeof UserManager.syncUserData === 'function') {
            await UserManager.syncUserData();
            console.log("User data sync completed");
        }

    } catch (error) {
        console.error("Error during ranking sync:", error);
        console.error("Sync error details:", {
            name: error.name,
            message: error.message,
            code: error.code || 'Unknown'
        });
    }
}

function initializeFirebase() {
    console.log('Initializing Firebase...');
    console.log('Current URL:', window.location.href);
    console.log('Current Domain:', window.location.hostname);
    console.log('Current Protocol:', window.location.protocol);

    try {
        if (!validateFirebaseAccess()) {
            console.warn('Firebase: Access validation failed');
            isFirebaseEnabled = false;
            return;
        }

        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK not loaded. Checking script tags...");
            const firebaseScripts = document.querySelectorAll('script[src*="firebase"]');
            console.log('Firebase scripts found:', firebaseScripts.length);
            isFirebaseEnabled = false;
            return;
        }

        console.log('Firebase SDK available, initializing...');

        // Firebase 앱이 이미 초기화되어 있는지 확인
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase app initialized');
        } else {
            console.log('Firebase app already initialized');
        }

        db = firebase.firestore();
        isFirebaseEnabled = true;

        console.log('Firestore initialized successfully');
        console.log('Starting data synchronization...');

        syncRankingsData().then(() => {
            console.log('Initial data sync completed');
        }).catch((error) => {
            console.error('Initial data sync failed:', error);
        });

    } catch (error) {
        console.error("Firebase initialization error:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code
        });
        isFirebaseEnabled = false;
    }
}

// ============================================
// Password Hashing Utility
// ============================================

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

function hashPassword(password, salt) {
    return simpleHash(password + salt);
}

function generateSalt() {
    return Math.random().toString(36).substring(2, 15);
}

// ============================================
// User Database Management
// ============================================

const UserDatabase = {
    getUsers() {
        return JSON.parse(localStorage.getItem('iqTestUsers') || '{}');
    },

    saveUsers(users) {
        localStorage.setItem('iqTestUsers', JSON.stringify(users));
    },

    userExists(nickname) {
        const users = this.getUsers();
        return users.hasOwnProperty(nickname);
    },

    createUser(nickname, age, password) {
        const users = this.getUsers();

        if (this.userExists(nickname)) {
            return { success: false, message: '이미 존재하는 닉네임입니다.' };
        }

        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        users[nickname] = {
            nickname,
            age,
            password: hashedPassword,
            salt,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        this.saveUsers(users);
        return { success: true, message: '회원가입이 완료되었습니다.' };
    },

    authenticateUser(nickname, password) {
        const users = this.getUsers();

        if (!this.userExists(nickname)) {
            return { success: false, message: '존재하지 않는 닉네임입니다.' };
        }

        const user = users[nickname];
        const hashedPassword = hashPassword(password, user.salt);

        if (hashedPassword === user.password) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveUsers(users);
            return { success: true, user };
        } else {
            return { success: false, message: '비밀번호가 올바르지 않습니다.' };
        }
    }
};

// ============================================
// User Management
// ============================================

const UserManager = {
    currentUser: null,
    init() {
        const saved = localStorage.getItem('iqTestCurrentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.updateUI();
        }
    },
    getCurrentUser() {
        return this.currentUser;
    },
    login(nickname, password) {
        const authResult = UserDatabase.authenticateUser(nickname, password);

        if (authResult.success) {
            this.currentUser = {
                nickname: authResult.user.nickname,
                age: authResult.user.age,
                loginDate: new Date().toISOString()
            };
            localStorage.setItem('iqTestCurrentUser', JSON.stringify(this.currentUser));
            this.updateUI();
            return { success: true, message: `${nickname}님, 로그인되었습니다!` };
        } else {
            return authResult;
        }
    },
    register(nickname, age, password) {
        const createResult = UserDatabase.createUser(nickname, age, password);

        if (createResult.success) {
            // 회원가입 후 자동 로그인
            this.currentUser = {
                nickname,
                age,
                loginDate: new Date().toISOString()
            };
            localStorage.setItem('iqTestCurrentUser', JSON.stringify(this.currentUser));
            this.updateUI();
        }

        return createResult;
    },
    logout() {
        this.currentUser = null;
        localStorage.removeItem('iqTestCurrentUser');
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

function toggleAuthForm() {
    const form = document.getElementById('authForm');
    if (form) {
        form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
        if (form.style.display === 'block') {
            switchAuthTab('login'); // 기본적으로 로그인 탭 활성화
        }
    }
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginTab.style.borderBottom = '2px solid #00d4ff';
        loginTab.style.color = '#00d4ff';
        registerTab.style.borderBottom = 'none';
        registerTab.style.color = '#666';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        registerTab.style.borderBottom = '2px solid #00d4ff';
        registerTab.style.color = '#00d4ff';
        loginTab.style.borderBottom = 'none';
        loginTab.style.color = '#666';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function attemptLogin() {
    const nicknameInput = document.getElementById('loginNicknameInput');
    const passwordInput = document.getElementById('loginPasswordInput');

    if (!nicknameInput || !passwordInput) {
        alert('입력 폼을 찾을 수 없습니다.');
        return;
    }

    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value;

    // 입력 검증
    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        passwordInput.focus();
        return;
    }

    const loginResult = UserManager.login(nickname, password);

    if (loginResult.success) {
        alert(loginResult.message);
        toggleAuthForm();
        // 입력 필드 초기화
        nicknameInput.value = '';
        passwordInput.value = '';
    } else {
        alert(loginResult.message);
        passwordInput.focus();
    }
}

function attemptRegister() {
    const nicknameInput = document.getElementById('registerNicknameInput');
    const ageInput = document.getElementById('registerAgeInput');
    const passwordInput = document.getElementById('registerPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');

    if (!nicknameInput || !ageInput || !passwordInput || !confirmPasswordInput) {
        alert('입력 폼을 찾을 수 없습니다.');
        return;
    }

    const nickname = nicknameInput.value.trim();
    const age = parseInt(ageInput.value);
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 입력 검증
    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (nickname.length < 2) {
        alert('닉네임은 2글자 이상 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (nickname.length > 10) {
        alert('닉네임은 10글자 이하로 입력해주세요.');
        nicknameInput.focus();
        return;
    }

    if (!age || isNaN(age)) {
        alert('나이를 올바르게 입력해주세요.');
        ageInput.focus();
        return;
    }

    if (age < 5 || age > 120) {
        alert('나이는 5세에서 120세 사이로 입력해주세요.');
        ageInput.focus();
        return;
    }

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        passwordInput.focus();
        return;
    }

    if (password.length < 4) {
        alert('비밀번호는 4글자 이상 입력해주세요.');
        passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        confirmPasswordInput.focus();
        return;
    }

    const registerResult = UserManager.register(nickname, age, password);

    if (registerResult.success) {
        alert(registerResult.message + ' 자동으로 로그인됩니다.');
        toggleAuthForm();
        // 입력 필드 초기화
        nicknameInput.value = '';
        ageInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
    } else {
        alert(registerResult.message);
        nicknameInput.focus();
    }
}

function logout() {
    UserManager.logout();
}

function handleLoginKeypress(event) {
    if (event.key === 'Enter') {
        attemptLogin();
    }
}

function handleRegisterKeypress(event) {
    if (event.key === 'Enter') {
        attemptRegister();
    }
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
        toggleAuthForm();
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

    const top10 = rankings.slice(0, 10);
    const remaining = rankings.slice(10);

    let html = top10.map((rank, index) => `
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
                    <div style="width: 30px; text-align: center; font-weight: bold; color: #666;">${index + 11}</div>
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
    ['comprehensive', 'easy', 'medium', 'hard'].forEach(type => {
        if (typeof refreshTestRankingPage === 'function') refreshTestRankingPage(type);
        refreshMainTypeRanking(type);
    });
}

function refreshMainTypeRanking(type) {
    const key = type === 'comprehensive' ? 'iqTestRankings' : `iqTest_${type}_Rankings`;
    const rankings = JSON.parse(localStorage.getItem(key) || '[]');
    const mainRankingElement = document.getElementById(`main${type.charAt(0).toUpperCase() + type.slice(1)}Ranking`);

    if (!mainRankingElement) return;

    if (rankings.length === 0) {
        mainRankingElement.innerHTML = '<div style="text-align: center; color: #999; padding: 15px; font-size: 0.8rem;">등록된 기록이 없습니다</div>';
        return;
    }

    const top10Rankings = rankings.slice(0, 10); // 상위 10명 표시
    let html = top10Rankings.map((rank, index) => `
        <div style="display: flex; align-items: center; padding: 4px 6px; margin-bottom: 2px; background: ${index < 3 ? getRankingBg(index) : 'rgba(0,0,0,0.02)'}; border-radius: 4px; font-size: 0.7rem;">
            <div style="width: 16px; text-align: center; font-weight: bold; color: ${index < 3 ? '#007bff' : '#666'}; font-size: 0.65rem;">${index < 3 ? getMedalIcon(index) : (index + 1)}</div>
            <div style="flex: 1; margin-left: 4px; overflow: hidden;">
                <div style="font-weight: 600; color: #333; font-size: 0.65rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${rank.nickname}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 600; color: #007bff; font-size: 0.65rem;">${rank.iq}</div>
            </div>
        </div>
    `).join('');

    // 본인 순위 표시
    if (UserManager.currentUser) {
        const userRank = rankings.findIndex(r => r.nickname === UserManager.currentUser.nickname);
        if (userRank !== -1) {
            const userRankElement = document.getElementById(`my${type.charAt(0).toUpperCase() + type.slice(1)}Rank`);
            if (userRankElement) {
                userRankElement.textContent = `내 순위: ${userRank + 1}등 (IQ ${rankings[userRank].iq})`;
            }
        }
    }

    mainRankingElement.innerHTML = html;
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

function showRankingPage() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    const evaluationSection = document.getElementById('evaluationSection');
    if (evaluationSection) evaluationSection.style.display = 'none';
    const rankingSection = document.querySelector('.ranking-grid-container');
    if (rankingSection) rankingSection.style.display = 'none';
    document.getElementById('rankingPage').style.display = 'block';

    // 종합테스트 탭을 기본으로 선택
    showTestRanking('comprehensive');
}

function goBackToMain() {
    document.getElementById('rankingPage').style.display = 'none';
    document.getElementById('intro').style.display = 'block';
    const evaluationSection = document.getElementById('evaluationSection');
    if (evaluationSection) evaluationSection.style.display = 'block';
    const rankingSection = document.querySelector('.ranking-grid-container');
    if (rankingSection) rankingSection.style.display = 'block';

    // 메인 베너 다시 보이기
    const headerBanner = document.querySelector('header');
    if (headerBanner) headerBanner.style.display = 'block';
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

// Sample Data Generation for Community Activation
function generateSampleRankings() {
    const sampleNicknames = [
        'IQ마스터', '천재소년', '퍼즐킹', '논리왕', '브레인파워', '스마트걸', '아인슈타인jr', '멘사멤버',
        '수학천재', '창의왕', '사고력짱', '지능왕', '퀴즈마스터', '문제해결사', '똑똑이', '영재소녀',
        '논리마스터', '패턴킹', '분석가', '추론왕', '계산왕', '기억력짱', '집중력킹', '인지왕',
        '두뇌파워', '사고왕', '지혜자', '명석한뇌', '뛰어난두뇌', '빠른사고'
    ];

    const classifications = ['천재급', '영재급', '우수', '평균이상', '평균'];

    // 각 테스트 타입별 샘플 데이터 생성
    const testTypes = [
        { key: 'iqTestRankings', name: '종합' },
        { key: 'iqTest_easy_Rankings', name: '쉬움' },
        { key: 'iqTest_medium_Rankings', name: '보통' },
        { key: 'iqTest_hard_Rankings', name: '어려움' }
    ];

    testTypes.forEach(testType => {
        const existingData = JSON.parse(localStorage.getItem(testType.key) || '[]');

        // 이미 데이터가 충분히 있으면 건너뛰기
        if (existingData.length >= 15) return;

        const sampleData = [];
        const usedNicknames = new Set(existingData.map(item => item.nickname));

        // 난이도별로 IQ 점수 범위 조정
        let iqRange;
        switch (testType.name) {
            case '쉬움': iqRange = [110, 140]; break;
            case '보통': iqRange = [120, 150]; break;
            case '어려움': iqRange = [130, 160]; break;
            default: iqRange = [115, 155]; // 종합
        }

        for (let i = 0; i < 20; i++) {
            let nickname;
            do {
                nickname = sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
            } while (usedNicknames.has(nickname));

            usedNicknames.add(nickname);

            const iq = Math.floor(Math.random() * (iqRange[1] - iqRange[0] + 1)) + iqRange[0];
            const classification = iq >= 145 ? '천재급' :
                                 iq >= 135 ? '영재급' :
                                 iq >= 125 ? '우수' :
                                 iq >= 115 ? '평균이상' : '평균';

            // 날짜를 최근 30일 내에서 랜덤하게 생성
            const randomDays = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - randomDays);

            sampleData.push({
                nickname: nickname,
                iq: iq,
                classification: classification,
                date: date.toISOString()
            });
        }

        // 기존 데이터와 합치고 IQ 점수로 정렬
        const combinedData = [...existingData, ...sampleData]
            .sort((a, b) => b.iq - a.iq)
            .slice(0, 50); // 최대 50개로 제한

        localStorage.setItem(testType.key, JSON.stringify(combinedData));
    });

    console.log('Sample ranking data generated for community activation!');
}

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

    // 커뮤니티 활성화를 위한 샘플 데이터 생성
    generateSampleRankings();

    refreshRanking();
    refreshAllTypeRankings();
};
