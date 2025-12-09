// ============================================
// Firebase ?대씪?곕뱶 ?숆린???ㅼ젙
// ============================================

// Firebase 蹂댁븞 媛뺥솕 ?ㅼ젙
// ?좑툘 蹂댁븞 怨듭?: API ?ㅻ뒗 ?대씪?댁뼵???ъ씠?쒖뿉???꾩쟾???④만 ???놁쓬
// Firebase 蹂댁븞 洹쒖튃???듯븳 ?곗씠???묎렐 ?쒖뼱媛 ?듭떖
const firebaseConfig = {
    apiKey: "AIzaSyCh8Mz5MhNVq6GFg21N42tQZ5KamMJ94eE", // ?대씪?댁뼵?몄슜 怨듦컻 ??
    authDomain: "iqzone-rankings.firebaseapp.com",
    projectId: "iqzone-rankings",
    storageBucket: "iqzone-rankings.firebasestorage.app",
    messagingSenderId: "820111197512",
    appId: "1:820111197512:web:b17f4f19c5f25724ff1f7d",
    measurementId: "G-L95JEJC6JC"
};

// 蹂댁븞: Firebase ?묎렐 ?쒗븳 諛?寃利?
function validateFirebaseAccess() {
    // ?꾨찓??寃利?(?뱀젙 ?꾨찓?몄뿉?쒕쭔 ?묎렐 ?덉슜)
    const allowedDomains = [
        'cattowel39200.github.io',
        'localhost',
        '127.0.0.1',
        'zrr.kr'
    ];

    const currentDomain = window.location.hostname;
    if (!allowedDomains.includes(currentDomain)) {
        console.warn(`?뵏 蹂댁븞 李⑤떒: ?덉슜?섏? ?딆? ?꾨찓??${currentDomain}`);
        return false;
    }

    return true;
}

// Firebase 珥덇린??
let db = null;
let isFirebaseEnabled = false;

function initializeFirebase() {
    try {
        // 蹂댁븞 寃利?癒쇱? ?섑뻾
        if (!validateFirebaseAccess()) {
            console.warn("?뵏 Firebase ?묎렐??蹂댁븞??李⑤떒?섏뿀?듬땲??");
            isFirebaseEnabled = false;
            return;
        }

        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            isFirebaseEnabled = true;
            console.log("??Firebase ?곌껐 ?깃났 - ?대씪?곕뱶 ?숆린???쒖꽦??);
            console.log("?뵏 蹂댁븞: ?뱀씤???꾨찓?몄뿉???묎렐 以?);
        } else {
            console.warn("?좑툘 Firebase ?쇱씠釉뚮윭由?濡쒕뱶 ?ㅽ뙣 - 濡쒖뺄 ??μ냼 ?ъ슜");
        }
    } catch (error) {
        console.warn("?좑툘 Firebase 珥덇린???ㅽ뙣 - 濡쒖뺄 ??μ냼 ?ъ슜:", error);
        isFirebaseEnabled = false;
    }
}

// ?대씪?곕뱶?먯꽌 ??궧 ?곗씠??媛?몄삤湲?
async function loadRankingsFromCloud() {
    if (!isFirebaseEnabled) return null;

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
        console.warn("?대씪?곕뱶?먯꽌 ??궧 ?곗씠??濡쒕뱶 ?ㅽ뙣:", error);
        return null;
    }
}

// ?대씪?곕뱶????궧 ?곗씠?????
async function saveRankingsToCloud(allTimeRankings, weeklyRankings) {
    if (!isFirebaseEnabled) return;

    try {
        await db.collection('rankings').doc('global').set({
            allTime: allTimeRankings,
            weekly: weeklyRankings,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("???대씪?곕뱶????궧 ????꾨즺");
    } catch (error) {
        console.warn("?대씪?곕뱶 ??궧 ????ㅽ뙣:", error);
    }
}

// 濡쒖뺄 ?ㅽ넗由ъ?? ?대씪?곕뱶 ?숆린??
async function syncRankingsData() {
    if (!isFirebaseEnabled) return;

    try {
        // ?대씪?곕뱶?먯꽌 ??궧 ?곗씠??媛?몄삤湲?
        const cloudData = await loadRankingsFromCloud();

        if (cloudData) {
            // ?대씪?곕뱶 ?곗씠?곌? ?덉쑝硫?濡쒖뺄???곸슜
            localStorage.setItem('iqTestRankings', JSON.stringify(cloudData.allTime));
            localStorage.setItem('iqTestWeeklyRankings', JSON.stringify(cloudData.weekly));

            console.log("???대씪?곕뱶 ??궧 ?곗씠?곕줈 ?숆린???꾨즺");

            // UI ?덈줈怨좎묠
            refreshRanking();
            refreshWeeklyRanking();
        } else {
            // ?대씪?곕뱶???곗씠?곌? ?놁쑝硫?濡쒖뺄 ?곗씠?곕? ?대씪?곕뱶???낅줈??
            const localAllTime = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
            const localWeekly = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');

            if (localAllTime.length > 0) {
                await saveRankingsToCloud(localAllTime, localWeekly);
                console.log("??濡쒖뺄 ??궧 ?곗씠?곕? ?대씪?곕뱶???낅줈???꾨즺");
            }
        }

        // ?ъ슜???곗씠???숆린??
        await UserManager.syncUserData();

    } catch (error) {
        console.warn("?곗씠???숆린??以??ㅻ쪟:", error);
    }
}

// ??궧 ??????대씪?곕뱶 ?숆린??(湲곗〈 ?⑥닔???섏젙)
function saveToRankingWithSync(nickname, iq, classification, age) {
    // ?깅줉???ъ슜?먮쭔 ??궧 ???
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || currentUser.nickname !== nickname) {
        console.log('?깅줉???ъ슜?먭? ?꾨땲誘濡???궧????ν븯吏 ?딆쓬');
        return;
    }

    // ??궧 ?뷀듃由??앹꽦
    const newEntry = {
        nickname: nickname,
        iq: iq,
        classification: classification,
        age: age,
        date: new Date().toISOString(),
        userType: 'registered',
        userId: UserManager.generateUserId(nickname)
    };

    let rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');

    // ?숈씪???ъ슜?먭? ?덉쑝硫????믪? ?먯닔濡??낅뜲?댄듃
    const existingIndex = rankings.findIndex(rank => rank.nickname === nickname);
    if (existingIndex !== -1) {
        if (iq > rankings[existingIndex].iq) {
            rankings[existingIndex] = newEntry;
        }
    } else {
        rankings.push(newEntry);
    }

    // IQ ?먯닔 湲곗??쇰줈 ?뺣젹
    rankings.sort((a, b) => b.iq - a.iq);

    localStorage.setItem('iqTestRankings', JSON.stringify(rankings));

    // ?대씪?곕뱶?????
    const weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');
    saveRankingsToCloud(rankings, weeklyRankings);

    console.log('??궧 ????꾨즺:', nickname, iq);
}

function saveToWeeklyRankingWithSync(nickname, iq, classification, age) {
    // ?깅줉???ъ슜?먮쭔 ??궧 ???
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || currentUser.nickname !== nickname) {
        return;
    }

    const weekStart = getWeekStart();
    let weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');

    if (!weeklyRankings[weekStart]) {
        weeklyRankings[weekStart] = [];
    }

    const newEntry = {
        nickname: nickname,
        iq: iq,
        classification: classification,
        age: age,
        date: new Date().toISOString(),
        userType: isRegisteredUser ? 'registered' : 'guest',
        userId: isRegisteredUser ? UserManager.generateUserId(nickname) : null
    };

    // ?깅줉???ъ슜?먯쓽 寃쎌슦留?以묐났 ?뺤씤
    if (isRegisteredUser) {
        const existingIndex = weeklyRankings[weekStart].findIndex(rank =>
            rank.nickname === nickname && rank.userType === 'registered'
        );
        if (existingIndex !== -1) {
            if (iq > weeklyRankings[weekStart][existingIndex].iq) {
                weeklyRankings[weekStart][existingIndex] = newEntry;
            }
        } else {
            weeklyRankings[weekStart].push(newEntry);
        }
    } else {
        // 寃뚯뒪?몃뒗 ??긽 異붽?
        weeklyRankings[weekStart].push(newEntry);
    }

    // IQ ?먯닔 湲곗??쇰줈 ?뺣젹
    weeklyRankings[weekStart].sort((a, b) => b.iq - a.iq);

    localStorage.setItem('iqTestWeeklyRankings', JSON.stringify(weeklyRankings));

    // ?깅줉???ъ슜?먮쭔 ?대씪?곕뱶?????
    if (isRegisteredUser) {
        const allTimeRankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
        saveRankingsToCloud(allTimeRankings, weeklyRankings);
    }
}

// ?좏삎蹂???궧 ????⑥닔
function saveToTypeRanking(nickname, score, classification, age, testType, results) {
    // ?깅줉???ъ슜?먮쭔 ??궧 ???
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser || currentUser.nickname !== nickname) {
        return;
    }

    const storageKey = `iqTest_${testType}_Rankings`;
    let rankings = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const newEntry = {
        nickname: nickname,
        score: score,
        iq: results.iq, // IQ ?먯닔 異붽?
        classification: classification,
        age: age,
        date: new Date().toISOString(),
        testType: testType,
        testName: results.testName || testType,
        accuracyScore: results.accuracyScore,
        timeBonus: results.timeBonus,
        timeEfficiency: results.timeEfficiency,
        totalCorrect: results.totalCorrect,
        totalQuestions: results.totalQuestions,
        averageTime: results.averageTime,
        userType: 'registered',
        userId: UserManager.generateUserId(nickname)
    };

    // ?숈씪???ъ슜?먭? ?덉쑝硫????믪? ?먯닔濡??낅뜲?댄듃
    const existingIndex = rankings.findIndex(rank => rank.nickname === nickname);
    if (existingIndex !== -1) {
        if (score > rankings[existingIndex].score) {
            rankings[existingIndex] = newEntry;
        }
    } else {
        rankings.push(newEntry);
    }

    // ?먯닔 湲곗??쇰줈 ?뺣젹
    rankings.sort((a, b) => b.score - a.score);

    localStorage.setItem(storageKey, JSON.stringify(rankings));

    // Firebase?먮룄 ???(?섏쨷??援ы쁽)
    console.log(`${testType} ??궧 ????꾨즺:`, newEntry);
}

// ============================================
// ?ъ슜???몄쬆 諛?愿由??쒖뒪??
// ============================================

// ?꾩뿭 蹂??
// 濡쒓렇?꾩썐 ?⑥닔
function logout() {
    UserManager.logout();
    updateUserStatusUI();
    alert('濡쒓렇?꾩썐?섏뿀?듬땲??');
}

// ?뚯썝媛???덈궡 ?앹뾽 ?쒖떆
function showRegistrationGuidePopup() {
    const typeNames = {
        comprehensive: '醫낇빀?뚯뒪??,
        easy: '?ъ??뚯뒪??,
        medium: '以묎컙?뚯뒪??,
        hard: '怨좊궃?꾪뀒?ㅽ듃'
    };

    const selectedTypeName = typeNames[selectedTestType] || '?뚯뒪??;

    const popupMessage = `?렞 ${selectedTypeName}瑜??쒖옉?섏떆寃좎뒿?덇퉴?

?뱷 ?됰꽕?꾩쑝濡?媛꾪렪?섍쾶 媛?낇썑 ?뚯뒪?몃? 吏꾪뻾?????덉뒿?덈떎!

???뚯썝媛???쒗깮:
??媛쒖씤 湲곕줉 愿由?諛??쒖쐞 異붿쟻
???뚯뒪???대젰 ???諛?遺꾩꽍
???ㅼ떆媛???궧 李몄뿬

?몘 ?곷떒?먯꽌 ?됰꽕?꾧낵 ?섏씠瑜??낅젰?섍퀬 ?뚯썝媛??踰꾪듉???대┃?섏꽭??`;

    alert(popupMessage);

    // ?곷떒 濡쒓렇???뱀뀡?쇰줈 ?ㅽ겕濡?
    document.getElementById('userStatusSection').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // ?됰꽕???낅젰 ?꾨뱶???ъ빱??
    setTimeout(() => {
        const nicknameInput = document.getElementById('loginNickname');
        if (nicknameInput) {
            nicknameInput.focus();
        }
    }, 800);
}

// ============================================
// IQ ?뚯뒪??臾몄젣 ?곗씠?곕쿋?댁뒪
// ============================================

// ============================================
// ?뚯뒪???곹깭 愿由?
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
let testResults = null; // ?뚯뒪??寃곌낵 ??μ슜
let selectedTestType = 'comprehensive'; // ?좏깮???뚯뒪???좏삎
let currentTestConfig = null; // ?꾩옱 ?뚯뒪???ㅼ젙

// ============================================
// ?뚯뒪???좏삎 ?좏깮 諛?愿由?
// ============================================

function selectTestType(type) {
    selectedTestType = type;

    // 紐⑤뱺 移대뱶?먯꽌 ?좏깮 ?④낵 ?쒓굅
    document.querySelectorAll('.test-type-card').forEach(card => {
        card.classList.remove('selected');
    });

    // ?좏깮??移대뱶???④낵 異붽?
    event.target.closest('.test-type-card').classList.add('selected');

    // ?좏깮???뚯뒪???쒖떆 ?낅뜲?댄듃
    const typeNames = {
        comprehensive: '醫낇빀?뚯뒪??,
        easy: '?ъ??뚯뒪??,
        medium: '以묎컙?뚯뒪??,
        hard: '怨좊궃?꾪뀒?ㅽ듃'
    };

    document.getElementById('selectedTestType').textContent = typeNames[type];

    // 諛붾줈 ?뚯뒪???쒖옉
    startTest();
}

// ?덈줈???먯닔 怨꾩궛 ?쒖뒪??(?뺥솗??+ ?쒓컙 湲곕컲)
function calculateScore(correctAnswers, totalQuestions, averageTime, maxTime) {
    // ?뺥솗???먯닔 (0-100)
    const accuracyScore = (correctAnswers / totalQuestions) * 100;

    // ?쒓컙 蹂대꼫??(鍮좊??섎줉 ?믪쓬, 0-20)
    const timeEfficiency = Math.max(0, (maxTime - averageTime) / maxTime);
    const timeBonus = timeEfficiency * 20;

    // 理쒖쥌 ?먯닔 = ?뺥솗???먯닔 + ?쒓컙 蹂대꼫??
    const finalScore = Math.round(accuracyScore + timeBonus);

    return {
        finalScore: Math.max(0, Math.min(120, finalScore)), // 0-120 ?쒗븳
        accuracyScore: Math.round(accuracyScore),
        timeBonus: Math.round(timeBonus),
        timeEfficiency: Math.round(timeEfficiency * 100)
    };
}

// ============================================
// ?뚯뒪??珥덇린??諛??쒖옉
// ============================================

function startTest() {
    // 濡쒓렇?몃맂 ?ъ슜???뺤씤
    const currentUser = UserManager.getCurrentUser();

    if (!currentUser) {
        showRegistrationGuidePopup();
        return;
    }

    // 濡쒓렇?몃맂 ?ъ슜???뺣낫 ?ъ슜
    userNickname = currentUser.nickname;
    userAge = currentUser.age;
    console.log('濡쒓렇?몃맂 ?ъ슜?먮줈 ?뚯뒪???쒖옉:', userNickname);

    // ?좏깮???뚯뒪???좏삎???곕씪 臾몄젣 濡쒕뱶
    if (selectedTestType === 'comprehensive') {
        // 湲곗〈 醫낇빀?뚯뒪??(湲곗〈 questions ?ъ슜)
        allQuestions = [
            ...shuffleArray(questions.perceptual),
            ...shuffleArray(questions.spatial),
            ...shuffleArray(questions.quantitative),
            ...shuffleArray(questions.logical),
            ...shuffleArray(questions.verbal)
        ];
        allQuestions = allQuestions.slice(0, 25);
        currentTestConfig = {
            name: '醫낇빀?뚯뒪??,
            timeLimit: 60,
            totalQuestions: 25
        };
    } else {
        // ?덈줈???뚯뒪???좏삎 (testTypes ?ъ슜)
        const testConfig = testTypes[selectedTestType];
        allQuestions = shuffleArray([...testConfig.questions]);
        currentTestConfig = {
            name: testConfig.name,
            timeLimit: testConfig.timePerQuestion,
            totalQuestions: testConfig.totalQuestions
        };
    }

    // ?듬? 諛곗뿴 珥덇린??
    answers = new Array(allQuestions.length).fill(null);
    responseTimes = new Array(allQuestions.length).fill(null);

    // ?붾쾭源? 臾몄젣 濡쒕뱶 ?뺤씤
    console.log(`${currentTestConfig.name} ?쒖옉:`, allQuestions.length + '臾명빆');
    console.log('泥?踰덉㎏ 臾몄젣:', allQuestions[0]);

    document.getElementById('intro').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'none';
    document.getElementById('evaluationSection').style.display = 'none';
    document.getElementById('test').style.display = 'block';

    loadQuestion(0);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ============================================
// 臾몄젣 濡쒕뱶 諛??쒖떆
// ============================================

function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = allQuestions[index];

    // 吏꾪뻾 ?곹솴 ?낅뜲?댄듃
    document.getElementById('progress').style.width = `${((index + 1) / allQuestions.length) * 100}%`;
    document.getElementById('questionNum').textContent = `臾몄젣 ${index + 1}/${allQuestions.length}`;

    // 移댄뀒怨좊━ ?쒖떆 (醫낇빀?뚯뒪?몃뒗 湲곗〈 諛⑹떇, ???뚯뒪?몃뒗 ????쒖떆)
    if (selectedTestType === 'comprehensive') {
        document.getElementById('categoryBadge').textContent = q.categoryName;
    } else {
        document.getElementById('categoryBadge').textContent = q.type || '?쇰컲';
    }

    // ?쒖씠???쒖떆 ?낅뜲?댄듃
    const difficultyBadge = document.getElementById('difficultyBadge');
    const difficultyMap = {
        1: { text: '?ъ?', class: 'difficulty-easy' },
        2: { text: '蹂댄넻', class: 'difficulty-medium' },
        3: { text: '?대젮?', class: 'difficulty-hard' },
        4: { text: '?꾨Ц媛', class: 'difficulty-expert' },
        5: { text: '泥쒖옱', class: 'difficulty-genius' }
    };
    const difficulty = difficultyMap[q.difficulty] || difficultyMap[3];
    difficultyBadge.textContent = difficulty.text;
    difficultyBadge.className = `difficulty-badge ${difficulty.class}`;

    // 臾몄젣 ?댁슜 ?뚮뜑留?
    const contentDiv = document.getElementById('questionContent');
    contentDiv.innerHTML = renderQuestionContent(q);

    // ?좏깮吏 ?뚮뜑留?
    const optionsDiv = document.getElementById('optionsGrid');
    optionsDiv.innerHTML = q.options.map((opt, i) => `
                <div class="option" onclick="selectOption(${i})" data-index="${i}">
                    <span class="option-label">${opt}</span>
                </div>
            `).join('');

    // ?댁쟾 ?듬????덉쑝硫??쒖떆
    if (answers[index] !== null) {
        const selectedOption = optionsDiv.querySelector(`[data-index="${answers[index]}"]`);
        if (selectedOption) selectedOption.classList.add('selected');
        document.getElementById('nextBtn').disabled = false;
    } else {
        document.getElementById('nextBtn').disabled = true;
    }

    // ??대㉧ ?쒖옉
    startTimer();
    startTime = Date.now();
}

function renderQuestionContent(q) {
    let html = `<p class="question-text">${q.question}</p>`;

    // ???뚯뒪????낆쓽 異붽? 吏덈Ц ?띿뒪??泥섎━
    if (q.questionText) {
        html += `<div class="question-detail" style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px; font-family: monospace;">${q.questionText}</div>`;
    }

    if (q.matrix) {
        html += '<div class="matrix-grid">';
        q.matrix.forEach((cell, i) => {
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
        html += `<span class="analogy-item">${q.analogy[0]}</span>`;
        html += `<span class="analogy-separator">:</span>`;
        html += `<span class="analogy-item">${q.analogy[1]}</span>`;
        html += `<span class="analogy-separator">=</span>`;
        html += `<span class="analogy-item">${q.analogy[2]}</span>`;
        html += `<span class="analogy-separator">:</span>`;
        html += `<span class="analogy-item unknown">?</span>`;
        html += '</div>';
    }

    if (q.shapeType === 'cube' && q.cubeNet) {
        html += `<div style="text-align: center; margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <p style="color: #8892b0;">${q.cubeNet}</p>
                </div>`;
    }

    if (q.shapeType === 'rotation' && q.shape) {
        html += `<div style="text-align: center; margin: 20px 0; font-size: 3rem;">${q.shape}</div>`;
    }

    return html;
}

// ============================================
// ??대㉧ 愿由?
// ============================================

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
    timerEl.textContent = `${timeLeft}珥?;
    timerEl.style.color = timeLeft <= 10 ? '#ff6b6b' : '#333333';
}

// ============================================
// ?듬? ?좏깮 諛??ㅻ퉬寃뚯씠??
// ============================================

function selectOption(index) {
    // ?댁쟾 ?좏깮 ?댁젣
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    // ???좏깮
    document.querySelector(`[data - index= "${index}"]`).classList.add('selected');
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
    responseTimes[currentQuestionIndex] = 60000; // 理쒕? ?쒓컙

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
// 寃곌낵 怨꾩궛 諛??쒖떆
// ============================================

// ============================================
// IRT 湲곕컲 ?꾨????됯? ?쒖뒪??(2024 媛?대뱶?쇱씤 ?곸슜)
// ============================================

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

    // 媛?臾명빆??IRT 留ㅺ컻蹂???ㅼ젙 (臾명빆 ?뱀꽦 怨≪꽑 湲곕컲)
    allQuestions.forEach((q, i) => {
        const category = q.category;
        categoryScores[category].total++;

        // IRT 3PL 紐⑤뜽 留ㅺ컻蹂??異붿젙
        const itemParam = {
            discrimination: getDifficultyDiscrimination(q.difficulty), // a 留ㅺ컻蹂??
            difficulty: mapDifficultyToTheta(q.difficulty),           // b 留ㅺ컻蹂??
            guessing: 0.20, // c 留ㅺ컻蹂??(5吏?좊떎?뺤씠誘濡?異붿륫瑜?20%)
            response: answers[i] === q.correct ? 1 : 0,
            responseTime: responseTimes[i],
            category: category
        };

        itemParameters.push(itemParam);

        if (itemParam.response === 1) {
            categoryScores[category].correct++;
            totalCorrect++;
        }
    });

    // Maximum Likelihood Estimation?쇰줈 ?λ젰 異붿젙
    const overallAbility = estimateAbilityMLE(itemParameters);

    // ?곸뿭蹂??λ젰 異붿젙
    ['perceptual', 'quantitative', 'spatial', 'logical', 'verbal'].forEach(category => {
        const categoryItems = itemParameters.filter(item => item.category === category);
        if (categoryItems.length > 0) {
            categoryScores[category].ability = estimateAbilityMLE(categoryItems);
        }
    });

    // ?λ젰媛믪쓣 ?쒖? IQ 泥숇룄濡?蹂??(?됯퇏 100, ?쒖??몄감 15)
    let iqScore = Math.round(100 + (overallAbility * 15));

    // 2024??湲곗? Flynn Effect 蹂댁젙 (-0.3????
    const currentYear = new Date().getFullYear();
    const flynnCorrection = (currentYear - 2020) * -0.3;
    iqScore = Math.round(iqScore + flynnCorrection);

    // ?섏씠蹂?洹쒖??붾맂 蹂댁젙 (WISC-V/WAIS-IV 湲곗?)
    const ageAdjustment = calculatePsychometricAgeAdjustment(userAge);
    iqScore += ageAdjustment;

    // ?좊ː??湲곕컲 議곗젙 (?대? ?쇨???怨좊젮)
    const reliability = calculateInternalConsistency(itemParameters);
    const confidenceInterval = calculateConfidenceInterval(iqScore, reliability);

    // IQ 踰붿쐞 ?쒗븳 (?꾩떎??踰붿쐞: 40-160)
    const finalIQ = Math.max(40, Math.min(160, iqScore));

    return {
        iq: finalIQ,
        ability: overallAbility,
        categoryScores,
        totalCorrect,
        totalQuestions: allQuestions.length,
        reliability: reliability,
        confidenceInterval: confidenceInterval,
        measurement_error: calculateStandardError(overallAbility, itemParameters)
    };
}

// ?덈줈???뚯뒪???좏삎 寃곌낵 怨꾩궛 (?뺥솗??+ ?쒓컙 湲곕컲)
function calculateNewTestResults() {
    let totalCorrect = 0;
    let totalTime = 0;
    let validResponses = 0;

    // ?뺣떟 ??諛??됯퇏 ?쒓컙 怨꾩궛
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

    // ?덈줈???먯닔 怨꾩궛 ?쒖뒪???ъ슜
    console.log('DEBUG calculateScore params:', { totalCorrect, totalQuestions: allQuestions.length, averageTime, maxTime });
    const scoreResult = calculateScore(totalCorrect, allQuestions.length, averageTime, maxTime);
    console.log('DEBUG scoreResult:', scoreResult);

    // ?먯닔瑜?IQ ?먯닔濡?蹂??(0-120 ?먯닔瑜?70-140 IQ濡?留ㅽ븨)
    // ??怨듭떇? ?먯닔???뺥솗?꾩? ?쒓컙??怨좊젮?섏뿬 IQ濡?蹂?섑빀?덈떎
    const rawScore = scoreResult.finalScore || 0; // 0-120, 湲곕낯媛?0
    const iqScore = Math.round(70 + (Math.max(0, Math.min(120, rawScore)) / 120) * 70); // 70-140 踰붿쐞??IQ, ?덉쟾??怨꾩궛
    console.log('DEBUG IQ calculation:', { rawScore, iqScore, scoreResult });

    return {
        score: scoreResult.finalScore, // ?먮옒 ?먯닔 (0-120)
        iq: iqScore, // IQ ?먯닔 (70-140)
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

// IRT 留ㅺ컻蹂???⑥닔??
function getDifficultyDiscrimination(difficulty) {
    // ?쒖씠?꾨퀎 蹂蹂꾨룄 留ㅺ컻蹂??(a): ?믪쓣?섎줉 ????援щ텇
    const discriminationMap = {
        1: 0.8,  // ?ъ?: ??? 蹂蹂꾨룄
        2: 1.2,  // 蹂댄넻: 以묎컙 蹂蹂꾨룄
        3: 1.5,  // ?대젮?: ?믪? 蹂蹂꾨룄
        4: 1.8,  // 留ㅼ슦 ?대젮?: 留ㅼ슦 ?믪? 蹂蹂꾨룄
        5: 2.0   // 洹밸룄濡??대젮?: 理쒓퀬 蹂蹂꾨룄
    };
    return discriminationMap[difficulty] || 1.0;
}

function mapDifficultyToTheta(difficulty) {
    // ?쒖씠?꾨? ?λ젰 泥숇룄(罐)濡?留ㅽ븨 (b 留ㅺ컻蹂??
    const difficultyMap = {
        1: -1.5,  // ?ъ?: ??? ?λ젰?먯꽌 50% ?뺣떟瑜?
        2: -0.5,  // 蹂댄넻: ?쎄컙 ??? ?λ젰?먯꽌 50%
        3: 0.0,   // ?대젮?: ?됯퇏 ?λ젰?먯꽌 50%
        4: 1.0,   // 留ㅼ슦 ?대젮?: ?믪? ?λ젰?먯꽌 50%
        5: 2.0    // 洹밸룄濡??대젮?: 留ㅼ슦 ?믪? ?λ젰?먯꽌 50%
    };
    return difficultyMap[difficulty] || 0.0;
}

// Maximum Likelihood Estimation (MLE) ?λ젰 異붿젙
function estimateAbilityMLE(itemParams) {
    if (itemParams.length === 0) return 0;

    let theta = 0; // 珥덇린 ?λ젰媛?
    const maxIterations = 50;
    const tolerance = 0.001;

    for (let iter = 0; iter < maxIterations; iter++) {
        let logLikelihood = 0;
        let firstDerivative = 0;
        let secondDerivative = 0;

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

        if (Math.abs(deltaTheta) < tolerance) break;
    }

    return Math.max(-4, Math.min(4, theta)); // ?λ젰媛?踰붿쐞 ?쒗븳
}

// IRT 3PL 紐⑤뜽 ?뺣쪧 ?⑥닔
function irtProbability(theta, a, b, c) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

// ?щ━痢≪젙?숈쟻 ?섏씠 蹂댁젙 (?쒖??붾맂 洹쒖? 湲곕컲)
function calculatePsychometricAgeAdjustment(age) {
    // WAIS-IV/WISC-V 洹쒖? ?뚯씠釉?湲곕컲 ?섏씠 蹂댁젙
    if (age < 16) {
        // ?꾨룞/泥?냼?? ?곕졊 湲곕컲 諛쒕떖 洹쒖?
        return Math.max(-20, (16 - age) * -2.5);
    } else if (age <= 24) {
        // 泥?뀈: ?몄??λ젰 理쒖쟻湲?
        return 2 + (24 - age) * 0.2;
    } else if (age <= 34) {
        // ?깆씤 珥덇린: ?덉젙湲?
        return 2;
    } else if (age <= 44) {
        // ?깆씤 以묎린: 寃곗젙??吏???곗꽭
        return 3;
    } else if (age <= 54) {
        // ?깆씤 ?꾧린: 寃쏀뿕 吏??理쒓퀬??
        return 2;
    } else if (age <= 64) {
        // 以묐뀈: ?좊룞??吏??媛먯냼 ?쒖옉
        return 1 - (age - 54) * 0.3;
    } else if (age <= 74) {
        // ?몃뀈 珥덇린: 泥섎━?띾룄 ???
        return -2 - (age - 64) * 0.5;
    } else {
        // 怨좊졊: ?곕졊 ?④낵 諛섏쁺
        return Math.max(-15, -7 - (age - 74) * 0.8);
    }
}

// ?대? ?쇨???怨꾩궛 (Cronbach's 慣)
function calculateInternalConsistency(itemParams) {
    if (itemParams.length < 2) return 0.7; // 湲곕낯媛?

    const k = itemParams.length;
    let sumVariances = 0;
    let responses = itemParams.map(item => item.response);
    let totalVariance = variance(responses);

    // 媛?臾명빆??遺꾩궛 怨꾩궛
    itemParams.forEach(item => {
        sumVariances += item.response * (1 - item.response); // ?댄빆遺꾪룷 遺꾩궛
    });

    const alpha = (k / (k - 1)) * (1 - (sumVariances / totalVariance));
    return Math.max(0, Math.min(1, alpha));
}

function variance(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2)) / arr.length;
}

// ?좊ː援ш컙 怨꾩궛
function calculateConfidenceInterval(iqScore, reliability) {
    const standardError = 15 * Math.sqrt(1 - reliability);
    return {
        lower: Math.round(iqScore - 1.96 * standardError),
        upper: Math.round(iqScore + 1.96 * standardError),
        margin: Math.round(1.96 * standardError)
    };
}

// 痢≪젙 ?쒖??ㅼ감 怨꾩궛
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
    // WAIS-IV/WISC-V 湲곕컲 2024???쒖???遺꾨쪟 (DSM-5 湲곗?)
    if (iq >= 130) return {
        label: '留ㅼ슦 ?곗닔 (Very Superior)',
        desc: '?곸쐞 2.1% ?대궡???곗뼱???몄??λ젰??蹂댁쑀?섍퀬 ?덉뒿?덈떎.',
        percentile: 97.9,
        range: '130+'
    };
    if (iq >= 120) return {
        label: '?곗닔 (Superior)',
        desc: '?곸쐞 6.7% ?대궡???곗닔???몄??λ젰?낅땲??',
        percentile: 93.3,
        range: '120-129'
    };
    if (iq >= 110) return {
        label: '?됯퇏 ??(High Average)',
        desc: '?곸쐞 25% ?대궡???묓샇???몄??λ젰??媛吏怨??덉뒿?덈떎.',
        percentile: 75,
        range: '110-119'
    };
    if (iq >= 90) return {
        label: '?됯퇏 (Average)',
        desc: '?쇰컲 ?멸뎄??50%媛 ?랁븯???뺤긽 踰붿쐞???몄??λ젰?낅땲??',
        percentile: 50,
        range: '90-109'
    };
    if (iq >= 80) return {
        label: '?됯퇏 ??(Low Average)',
        desc: '?섏쐞 25% 踰붿쐞?댁?留??뺤긽?곸씤 ?쇱긽 湲곕뒫 ?섑뻾??媛?ν빀?덈떎.',
        percentile: 25,
        range: '80-89'
    };
    if (iq >= 70) return {
        label: '寃쎄퀎???몄?湲곕뒫 (Borderline)',
        desc: '?섏쐞 2-9% 踰붿쐞濡??쇰? ?곸뿭?먯꽌 吏?먯씠 ?꾩슂?????덉뒿?덈떎.',
        percentile: 6.7,
        range: '70-79'
    };
    return {
        label: '?몄?湲곕뒫 ????섏떖',
        desc: '?섏쐞 2.1% 踰붿쐞濡??꾨Ц媛 ?됯?瑜?沅뚯옣?⑸땲??',
        percentile: 2.1,
        range: '<70'
    };
}

function showResults() {
    // 寃뚯떆?먯뿉???뚯븘??寃쎌슦 湲곗〈 寃곌낵 ?ъ슜
    if (testResults) {
        document.getElementById('results').style.display = 'block';
        return;
    }

    document.getElementById('test').style.display = 'none';
    document.getElementById('intro').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'none';
    document.getElementById('evaluationSection').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const results = selectedTestType === 'comprehensive' ? calculateResults() : calculateNewTestResults();
    const classification = getIQClassification(results.iq || results.score);

    // 寃곌낵 ???(寃뚯떆?먯뿉???ъ슜?섍린 ?꾪빐)
    testResults = {
        iq: results.iq || results.score, // iq媛 ?놁쑝硫?score ?ъ슜
        classification: classification,
        categoryScores: results.categoryScores,
        totalCorrect: results.totalCorrect,
        totalQuestions: results.totalQuestions,
        age: userAge
    };

    // ?먮룞?쇰줈 ??궧???깅줉 (?좏삎蹂?
    if (userNickname) {
        if (selectedTestType === 'comprehensive') {
            saveToRankingWithSync(userNickname, results.iq, classification.label, userAge);
        } else {
            saveToTypeRanking(userNickname, results.iq, classification.label, userAge, selectedTestType, results);
        }

        // 濡쒓렇?몃맂 ?ъ슜?먯쓽 寃쎌슦 媛쒖씤 湲곕줉?먮룄 ???
        const currentUser = UserManager.getCurrentUser();
        if (currentUser) {
            const testData = {
                testType: selectedTestType,
                iq: results.iq,
                score: results.score || results.iq,
                classification: classification.label,
                totalCorrect: results.totalCorrect,
                totalQuestions: results.totalQuestions,
                categoryScores: results.categoryScores,
                accuracyScore: results.accuracyScore,
                timeBonus: results.timeBonus,
                averageTime: results.averageTime
            };

            UserManager.addTestRecord(testData).then(() => {
                console.log('?ъ슜???뚯뒪??湲곕줉 ????꾨즺');
                // UI ?낅뜲?댄듃 (?ъ슜???뺣낫 媛깆떊)
                updateUserStatusUI();
            }).catch(error => {
                console.error('?ъ슜???뚯뒪??湲곕줉 ????ㅽ뙣:', error);
            });
        } else {
            console.log('寃뚯뒪??紐⑤뱶 - 媛쒖씤 湲곕줉 ??ν븯吏 ?딆쓬');
        }

        refreshRanking();
        refreshAllTypeRankings(); // 硫붿씤 ??궧???덈줈怨좎묠
    }

    // ?먯닔 ?쒖떆 (紐⑤뱺 ?뚯뒪????낆뿉??IQ ?먯닔 ?쒖떆)
    const iqScore = results.iq; // ?댁젣 紐⑤뱺 ?뚯뒪????낆뿉??IQ ?먯닔媛 ?덉쓬
    const rawScore = results.score; // ?먮옒 ?먯닔 (?덈줈???뚯뒪????낆쓽 寃쎌슦)

    console.log('DEBUG - results:', results);
    console.log('DEBUG - iqScore:', iqScore, 'rawScore:', rawScore, 'testType:', selectedTestType);

    // IQ ?먯닔 媛뺤젣 怨꾩궛 諛??쒖떆
    let displayScore = 70; // 理쒖냼媛?

    if (results && results.iq && !isNaN(results.iq) && results.iq > 0) {
        displayScore = results.iq;
    } else if (results && results.score && !isNaN(results.score)) {
        // 媛뺤젣濡?IQ ?먯닔 怨꾩궛
        const safeScore = Math.max(0, Math.min(120, results.score));
        displayScore = Math.round(70 + (safeScore / 120) * 70);
    } else {
        // 理쒗썑???섎떒: ?꾩떆 怨꾩궛
        displayScore = 85; // 湲곕낯 IQ ?먯닔
    }

    const iqElement = document.getElementById('iqScore');
    iqElement.textContent = displayScore;
    iqElement.style.color = '#007bff'; // 媛뺤젣濡??됱긽??蹂寃쏀븯??蹂???뺤씤
    console.log('DEBUG - FINAL displayScore:', displayScore, 'from results:', results);
    document.getElementById('classLabel').textContent = classification.label;
    document.getElementById('classDesc').textContent = classification.desc;

    if (selectedTestType === 'comprehensive') {
        document.getElementById('percentile').textContent = `? 곸쐞 ${ (100 - classification.percentile).toFixed(1) }% (諛깅텇 ?? ${ classification.percentile })`;
    } else {
        // ?덈줈???뚯뒪????낆? ?곸꽭 ?먯닔 遺꾩꽍 ?쒖떆
        const scoreDetail = `? 뺥솗 ?? ${ results.accuracyScore }?? + ? 쒓컙蹂대꼫 ?? ${ results.timeBonus }??= IQ ${ iqScore } `;
        document.getElementById('percentile').textContent = scoreDetail;
    }

    // IRT 湲곕컲 痢≪젙 ?뺣낫 異붽? ?쒖떆 (?덈떎硫?
    if (results.measurementError) {
        const confidenceInterval = `${ Math.round(results.iq - (1.96 * results.measurementError)) } -${ Math.round(results.iq + (1.96 * results.measurementError)) } `;
        const errorElement = document.getElementById('measurementInfo');
        if (errorElement) {
            errorElement.textContent = `95 % ? 좊ː援ш컙 : ${ confidenceInterval } (痢≪젙 ? ㅼ감 : 짹${ Math.round(results.measurementError) })`;
        }
    }

    // 移댄뀒怨좊━蹂?遺꾩꽍 ?쒖떆 ?щ? (醫낇빀?뚯뒪?몄뿉留??쒖떆)
    const categoryAnalysisElement = document.getElementById('categoryAnalysis');
    if (selectedTestType === 'comprehensive' && results.categoryScores) {
        // 醫낇빀?뚯뒪?몄씪 ?뚮쭔 ?곸뿭蹂?遺꾩꽍 HTML ?앹꽦
        categoryAnalysisElement.innerHTML = `
        < h3 style = "margin-bottom: 30px; color: #333333;" >? 곸뿭蹂 ? 遺꾩꽍</h3 >
                    <div class="result-category">
                        <h4>吏媛?異붾줎 (Perceptual Reasoning)</h4>
                        <div class="result-bar">
                            <div class="result-bar-fill" id="perceptualBar" style="width: 0%"></div>
                        </div>
                        <div class="result-score" id="perceptualScore">0/5</div>
                    </div>
                    <div class="result-category">
                        <h4>?섎━ ?쇰━ (Quantitative Reasoning)</h4>
                        <div class="result-bar">
                            <div class="result-bar-fill" id="quantitativeBar" style="width: 0%"></div>
                        </div>
                        <div class="result-score" id="quantitativeScore">0/5</div>
                    </div>
                    <div class="result-category">
                        <h4>?쒓났媛?泥섎━ (Spatial Processing)</h4>
                        <div class="result-bar">
                            <div class="result-bar-fill" id="spatialBar" style="width: 0%"></div>
                        </div>
                        <div class="result-score" id="spatialScore">0/5</div>
                    </div>
                    <div class="result-category">
                        <h4>?쇰━ 異붾줎 (Logical Reasoning)</h4>
                        <div class="result-bar">
                            <div class="result-bar-fill" id="logicalBar" style="width: 0%"></div>
                        </div>
                        <div class="result-score" id="logicalScore">0/5</div>
                    </div>
                    <div class="result-category">
                        <h4>?몄뼱 ?좎텛 (Verbal Analogies)</h4>
                        <div class="result-bar">
                            <div class="result-bar-fill" id="verbalBar" style="width: 0%"></div>
                        </div>
                        <div class="result-score" id="verbalScore">0/5</div>
                    </div>
    `;
        categoryAnalysisElement.style.display = 'block';

        setTimeout(() => {
            const categories = ['perceptual', 'quantitative', 'spatial', 'logical', 'verbal'];
            categories.forEach(cat => {
                const score = results.categoryScores[cat];
                if (score) {
                    const percentage = (score.correct / score.total) * 100;
                    document.getElementById(`${ cat } Bar`).style.width = `${ percentage }% `;
document.getElementById(`${ cat } Score`).textContent = `${ score.correct }/${score.total}`;
}
                    });
                }, 500);
            } else {
    categoryAnalysisElement.style.display = 'none';
}
        }

// ============================================
// Brain Animation Script
// ============================================

const canvas = document.getElementById('brainCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let connections = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.min(100, (canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
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

// ============================================
// ??궧 ?쒖뒪??(二쇨컙 諛??꾩껜)
// ============================================

// 二쇨컙 ??궧???꾪븳 二쇱감 怨꾩궛 (ISO 8601 湲곗?)
function getWeekStart() {
    const now = new Date();
    const day = now.getDay(); // 0 (?? ~ 6 (??
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // ?붿슂??湲곗?
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0]; // YYYY-MM-DD ?뺤떇
}

// 二쇨컙 ??궧 ?덈줈怨좎묠
function refreshWeeklyRanking() {
    const weekStart = getWeekStart();
    const weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');

    // ?대쾲 二??곗씠?곌? ?놁쑝硫?珥덇린??
    if (!weeklyRankings[weekStart]) {
        weeklyRankings[weekStart] = [];
    }

    // 吏??二??곗씠???뺣━ (?좏깮?ы빆: ?덈Т ?ㅻ옒???곗씠????젣)
    // ...

    // ??궧 ?쒖떆 濡쒖쭅? refreshRanking怨??좎궗?섍쾶 援ы쁽
    // ?ш린?쒕뒗 硫붿씤 ??쒕낫?쒖뿉 ?쒖떆???곸쐞 3紐낅쭔 異붿텧?섎뒗 濡쒖쭅 ?덉떆
    // ...
}

// 二쇨컙 ??궧 珥덇린??泥댄겕 (留ㅼ＜ ?붿슂??0??
function checkWeeklyReset() {
    const lastCheck = localStorage.getItem('lastWeeklyCheck');
    const currentWeek = getWeekStart();

    if (lastCheck !== currentWeek) {
        // ?덈줈??二쇨? ?쒖옉??
        console.log('?덈줈??二쇨컙 ??궧???쒖옉?섏뿀?듬땲??', currentWeek);
        localStorage.setItem('lastWeeklyCheck', currentWeek);
        // ?꾩슂??寃쎌슦 ?뚮┝ ?쒖떆
    }
}

// ============================================
// ??궧 ?쒖뒪??(UI ?쒖떆)
// ============================================

function refreshRanking() {
    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const rankingList = document.getElementById('rankingList');

    if (!rankingList) return; // ??궧 由ъ뒪???붿냼媛 ?놁쑝硫?以묐떒

    if (rankings.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">?꾩쭅 ?깅줉????궧???놁뒿?덈떎.</div>';
        return;
    }

    // ?곸쐞 5紐낅쭔 湲곕낯 ?쒖떆
    const top5 = rankings.slice(0, 5);
    const remaining = rankings.slice(5);

    let html = top5.map((rank, index) => `
                <div style="display: flex; align-items: center; padding: 12px 15px; margin-bottom: 8px; background: ${getRankingBg(index)}; border-radius: 12px; border: 1px solid ${getRankingBorder(index)};">
                    <div style="width: 30px; text-align: center; font-size: 1.2rem; font-weight: bold;">
                        ${getMedalIcon(index)}
                    </div>
                    <div style="flex: 1; margin-left: 10px;">
                        <div style="font-weight: 700; color: #333333;">${rank.nickname}</div>
                        <div style="color: #666; font-size: 0.85rem;">${rank.classification}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: ${getIQTextColor(rank.iq)}; font-size: 1.1rem;">IQ ${rank.iq}</div>
                        <div style="color: #999; font-size: 0.8rem;">${new Date(rank.date).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');

    // ?붾낫湲??뱀뀡 (?④? 泥섎━)
    if (remaining.length > 0) {
        html += `
                    <div id="moreRankings" style="display: none;">
                        ${remaining.map((rank, index) => `
                            <div style="display: flex; align-items: center; padding: 10px 15px; margin-bottom: 8px; background: rgba(0, 0, 0, 0.02); border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.05);">
                                <div style="width: 30px; text-align: center; font-weight: bold; color: #666;">
                                    ${index + 6}
                                </div>
                                <div style="flex: 1; margin-left: 10px;">
                                    <div style="font-weight: 600; color: #555;">${rank.nickname}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: 600; color: #555;">IQ ${rank.iq}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="toggleMoreRankings()" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.05); border: none; border-radius: 10px; color: #666; cursor: pointer; margin-top: 10px;">
                        ??留롮? ??궧 蹂닿린 (${remaining.length}紐?
                    </button>
                `;
    }

    rankingList.innerHTML = html;
}

function toggleMoreRankings() {
    const moreRankings = document.getElementById('moreRankings');
    const btn = event.target;
    if (moreRankings.style.display === 'none') {
        moreRankings.style.display = 'block';
        btn.textContent = '?묎린';
    } else {
        moreRankings.style.display = 'none';
        btn.textContent = `??留롮? ??궧 蹂닿린 (${document.querySelectorAll('#moreRankings > div').length}紐?`;
    }
}

function getMedalIcon(index) {
    if (index === 0) return '?쪍';
    if (index === 1) return '?쪎';
    if (index === 2) return '?쪏';
    return `<span style="font-size: 0.9rem; color: #666;">${index + 1}</span>`;
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
    return 'rgba(0, 0, 0, 0.05)';
}

function getIQTextColor(iq) {
    if (iq >= 130) return '#7b2cbf'; // 泥쒖옱湲?- 蹂대씪??
    if (iq >= 120) return '#00d4ff'; // ?곗닔 - ?섎뒛??
    if (iq >= 110) return '#22c55e'; // ?됯퇏??- 珥덈줉??
    return '#333333'; // ?쇰컲 - 寃?뺤깋
}

// ?섑뵆 ?곗씠???앹꽦 (泥섏쓬 ?ㅽ뻾 ??
function generateSampleData() {
    if (!localStorage.getItem('iqTestRankings')) {
        const samples = [
            { nickname: 'BrainMaster', iq: 142, classification: '留ㅼ슦 ?곗닔 (Very Superior)', date: new Date().toISOString(), age: 24 },
            { nickname: 'LogicPro', iq: 135, classification: '留ㅼ슦 ?곗닔 (Very Superior)', date: new Date().toISOString(), age: 28 },
            { nickname: 'ThinkFast', iq: 128, classification: '?곗닔 (Superior)', date: new Date().toISOString(), age: 31 },
            { nickname: 'SmartMind', iq: 121, classification: '?곗닔 (Superior)', date: new Date().toISOString(), age: 22 },
            { nickname: 'IQTester', iq: 115, classification: '?됯퇏 ??(High Average)', date: new Date().toISOString(), age: 26 }
        ];
        localStorage.setItem('iqTestRankings', JSON.stringify(samples));
    }
}

function getIQClassificationLabel(iq) {
    if (iq >= 130) return '留ㅼ슦 ?곗닔';
    if (iq >= 120) return '?곗닔';
    if (iq >= 110) return '?됯퇏 ??;
    if (iq >= 90) return '?됯퇏';
    if (iq >= 80) return '?됯퇏 ??;
    if (iq >= 70) return '寃쎄퀎??;
    return '留ㅼ슦 ??쓬';
}

// ?곗씠??珥덇린??(媛쒕컻??
function resetAllData() {
    if (confirm('紐⑤뱺 ??궧 諛??ъ슜???곗씠?곕? 珥덇린?뷀븯?쒓쿋?듬땲源?')) {
        localStorage.clear();
        location.reload();
    }
}

// ============================================
// 珥덇린??諛??대깽??由ъ뒪??
// ============================================

// ?됰꽕???낅젰 湲?먯닔 ?쒗븳 ?쒖떆
document.addEventListener('input', function (e) {
    if (e.target.id === 'loginNickname') {
        // ?꾩슂??寃쎌슦 湲?먯닔 ?쒖떆 濡쒖쭅 異붽?
    }
});

window.addEventListener('load', async () => {
    // Firebase 珥덇린??
    initializeFirebase();

    // ?ъ슜???몄뀡 蹂듦뎄
    const savedUser = UserManager.getCurrentUser();
    if (savedUser) {
        isLoggedIn = true;
        currentUser = savedUser;
        updateUserStatusUI();
        console.log('?ъ슜???몄뀡 蹂듦뎄??', currentUser.nickname);
    }

    // ?섑뵆 ?곗씠???앹꽦
    generateSampleData();

    // ??궧 ?곗씠???숆린??(鍮꾨룞湲?
    await syncRankingsData();

    // UI 珥덇린??
    refreshRanking();
    refreshWeeklyRanking();
    refreshAllTypeRankings(); // 紐⑤뱺 ?좏삎 ??궧 ?덈줈怨좎묠
    checkWeeklyReset();

    // 蹂댁븞 紐⑤땲?곕쭅 ?쒖옉
    if (window.IQZoneSecurity) {
        window.IQZoneSecurity.log('SYSTEM', '?좏뵆由ъ??댁뀡 濡쒕뱶 ?꾨즺');
    }
});

// ??궧 ?섏씠吏 ?쒖떆 ?⑥닔
function showRankingPage() {
    document.getElementById('results').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'none';
    document.getElementById('rankingPage').style.display = 'block';

    // 湲곕낯?곸쑝濡?醫낇빀?뚯뒪????궧 ?쒖떆
    showTestRanking('comprehensive');
}

// 硫붿씤?쇰줈 ?뚯븘媛湲?
function goBackToMain() {
    document.getElementById('rankingPage').style.display = 'none';
    document.getElementById('test').style.display = 'none';
    document.getElementById('results').style.display = 'none';

    document.getElementById('intro').style.display = 'block';
    document.getElementById('mainDashboard').style.display = 'block';
    document.getElementById('evaluationSection').style.display = 'block';

    // ??궧 ?덈줈怨좎묠
    refreshAllTypeRankings();
}

// ??궧 ???꾪솚 諛??쒖떆
function showTestRanking(type) {
    // 紐⑤뱺 ??鍮꾪솢?깊솕
    document.querySelectorAll('.ranking-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // ?좏깮?????쒖꽦??
    document.getElementById(`${type}Tab`).classList.add('active');

    // 紐⑤뱺 ??궧 ?뱀뀡 ?④린湲?
    document.querySelectorAll('.ranking-section').forEach(section => {
        section.style.display = 'none';
    });

    // ?좏깮????궧 ?뱀뀡 ?쒖떆
    document.getElementById(`${type}Ranking`).style.display = 'block';

    // ?대떦 ??궧 ?곗씠??濡쒕뱶 諛??쒖떆
    refreshTestRankingPage(type);
}

// ?뱀젙 ?뚯뒪???좏삎????궧 ?섏씠吏 ?덈줈怨좎묠
function refreshTestRankingPage(type) {
    const storageKey = type === 'comprehensive' ? 'iqTestRankings' : `iqTest_${type}_Rankings`;
    const rankings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const listElement = document.getElementById(`${type}RankingList`);
    const myRankElement = document.getElementById(`my${type.charAt(0).toUpperCase() + type.slice(1)}Rank`);

    if (!listElement) return;

    if (rankings.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">?꾩쭅 ?깅줉????궧???놁뒿?덈떎.</div>';
        if (myRankElement) myRankElement.style.display = 'none';
        return;
    }

    // TOP 10 ?쒖떆
    const top10 = rankings.slice(0, 10);

    listElement.innerHTML = top10.map((rank, index) => {
        const ranking = index + 1;
        const isTopThree = ranking <= 3;
        const medal = ranking === 1 ? '?쪍' : ranking === 2 ? '?쪎' : ranking === 3 ? '?쪏' : `${ranking}??;
        const scoreDisplay = type === 'comprehensive' ? `IQ ${ rank.iq }` : `${ rank.score }??;

        // 諛곌꼍???ㅼ젙 (?좏삎蹂??뚮쭏???곸슜 媛??
        let bgStyle = getRankingBg(index);

        return `
                    <div style="display: flex; align-items: center; padding: 12px 15px; margin-bottom: 8px; background: ${bgStyle}; border-radius: 12px; border: 1px solid ${getRankingBorder(index)}; box-shadow: ${isTopThree ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none'};">
                        <div style="width: 50px; text-align: center; font-size: ${isTopThree ? '1.4rem' : '1rem'}; font-weight: ${isTopThree ? 'bold' : 'normal'};">
                            ${medal}
                        </div>
                        <div style="flex: 1; margin-left: 12px;">
                            <div style="font-weight: 700; color: #333333; font-size: 1.1rem;">
                                ${rank.nickname}
                            </div>
                            <div style="color: #666; font-size: 0.9rem; margin-top: 2px;">
                                ${rank.classification || getIQClassificationLabel(rank.iq)} ??${rank.age}??
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: ${getIQTextColor(rank.iq)}; font-size: 1.2rem;">
                                ${scoreDisplay}
                            </div>
                            <div style="color: #999; font-size: 0.8rem;">
                                ${new Date(rank.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `;
    }).join('');

    // ???쒖쐞 ?쒖떆
    if (userNickname && myRankElement) {
        const myRankIndex = rankings.findIndex(rank => rank.nickname === userNickname);

        if (myRankIndex !== -1) {
            const myRank = rankings[myRankIndex];
            const ranking = myRankIndex + 1;
            const scoreDisplay = type === 'comprehensive' ? `IQ ${myRank.iq}` : `${myRank.score}??;

            myRankElement.style.display = 'block';
            myRankElement.innerHTML = `
                < h4 >? 렞 ??? 쒖쐞(${ type === 'comprehensive' ? '醫낇빀' : type})</h4 >
                    <div style="font-size: 1.1rem;">
                        <strong>${ranking}??/strong> / ${rankings.length}紐?以?
                            <span style="color: ${getIQTextColor(myRank.iq)}; font-weight: bold; margin-left: 10px;">${scoreDisplay}</span>
                    </div>
        `;
        } else {
            myRankElement.style.display = 'none';
        }
    }
}

// 硫붿씤 ?붾㈃???좏삎蹂???궧 ?덈줈怨좎묠
function refreshTypeRankings(type) {
    const storageKey = `iqTest_${ type } _Rankings`;
    const rankings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const listElement = document.getElementById(`main${ type.charAt(0).toUpperCase() + type.slice(1) } Ranking`);
    const myRankElement = document.getElementById(`my${ type.charAt(0).toUpperCase() + type.slice(1) } Rank`);

    if (!listElement) return;

    if (rankings.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 15px; font-size: 0.85rem;">?곗씠???놁쓬</div>';
        if (myRankElement) myRankElement.textContent = '';
        return;
    }

    // ?곸쐞 5紐낅쭔 ?쒖떆
    const top5 = rankings.slice(0, 5);

    listElement.innerHTML = top5.map((rank, index) => {
        const ranking = index + 1;
        const medal = ranking === 1 ? '?쪍' : ranking === 2 ? '?쪎' : ranking === 3 ? '?쪏' : `< span class="main-rank-number" > ${ ranking }</span > `;

        return `
            < div class="main-ranking-item" >
                <div style="display: flex; align-items: center; width: 100%;">
                    <div style="width: 25px; text-align: center; margin-right: 8px;">${medal}</div>
                    <div class="main-rank-info">
                        <div class="main-rank-nickname">${rank.nickname}</div>
                        <div class="main-rank-score">${rank.score}??(IQ ${rank.iq})</div>
                    </div>
                </div>
                    </div >
            `;
    }).join('');

    // ???쒖쐞 ?붿빟 ?쒖떆
    if (userNickname && myRankElement) {
        const myRankIndex = rankings.findIndex(rank => rank.nickname === userNickname);
        if (myRankIndex !== -1) {
            myRankElement.textContent = `??? 쒖쐞 : ${ myRankIndex + 1 }?? (? 곸쐞 ${ Math.round(((myRankIndex + 1) / rankings.length) * 100) }%)`;
        } else {
            myRankElement.textContent = '湲곕줉 ?놁쓬';
        }
    }
}

// 紐⑤뱺 ?좏삎 ??궧 ?덈줈怨좎묠 (硫붿씤 ?붾㈃??
function refreshAllTypeRankings() {
    refreshTypeRankings('easy');
    refreshTypeRankings('medium');
    refreshTypeRankings('hard');

    // 醫낇빀 ?뚯뒪????궧??硫붿씤???쒖떆 (湲곗〈 ?⑥닔 ?ъ궗???먮뒗 ?덈줈 援ы쁽)
    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const listElement = document.getElementById('mainComprehensiveRanking');
    const myRankElement = document.getElementById('myComprehensiveRank');

    if (listElement) {
        if (rankings.length === 0) {
            listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 15px; font-size: 0.85rem;">?곗씠???놁쓬</div>';
            if (myRankElement) myRankElement.textContent = '';
        } else {
            const top5 = rankings.slice(0, 5);
            listElement.innerHTML = top5.map((rank, index) => {
                const ranking = index + 1;
                const medal = ranking === 1 ? '?쪍' : ranking === 2 ? '?쪎' : ranking === 3 ? '?쪏' : `< span class="main-rank-number" > ${ ranking }</span > `;
                return `
            < div class="main-ranking-item" >
                <div style="display: flex; align-items: center; width: 100%;">
                    <div style="width: 25px; text-align: center; margin-right: 8px;">${medal}</div>
                    <div class="main-rank-info">
                        <div class="main-rank-nickname">${rank.nickname}</div>
                        <div class="main-rank-score">IQ ${rank.iq}</div>
                    </div>
                </div>
                            </div >
            `;
            }).join('');

            if (userNickname && myRankElement) {
                const myRankIndex = rankings.findIndex(rank => rank.nickname === userNickname);
                if (myRankIndex !== -1) {
                    myRankElement.textContent = `??? 쒖쐞 : ${ myRankIndex + 1 }?? (? 곸쐞 ${ Math.round(((myRankIndex + 1) / rankings.length) * 100) }%)`;
                } else {
                    myRankElement.textContent = '湲곕줉 ?놁쓬';
                }
            }
        }
    }
}

// 二쇨컙 ??궧 諛곌꼍??(?ъ궗??
function getWeeklyRankingBg(index) {
    return getRankingBg(index);
}

function getWeeklyRankingBorder(index) {
    return getRankingBorder(index);
}

// ?꾩껜 ??궧 ?섏씠吏???곗씠???덈줈怨좎묠
function refreshAllTimeRankingPage() {
    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const rankingList = document.getElementById('allTimeRankingList');
    const myRankSection = document.getElementById('myAllTimeRank');

    if (rankings.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">?꾩쭅 ?깅줉????궧???놁뒿?덈떎.</div>';
        myRankSection.style.display = 'none';
        return;
    }

    // TOP 10留??쒖떆
    const top10 = rankings.slice(0, 10);

    rankingList.innerHTML = top10.map((rank, index) => {
        const ranking = index + 1;
        const isTopThree = ranking <= 3;
        const medal = ranking === 1 ? '?쪍' : ranking === 2 ? '?쪎' : ranking === 3 ? '?쪏' : `${ ranking }??;

        return `
                    <div style="display: flex; align-items: center; padding: 12px 15px; margin-bottom: 8px; background: ${getRankingBg(index)}; border-radius: 12px; border: 1px solid ${getRankingBorder(index)}; box-shadow: ${isTopThree ? '0 4px 12px rgba(0, 212, 255, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.05)'};">
                        <div style="width: 50px; text-align: center; font-size: ${isTopThree ? '1.4rem' : '1rem'}; font-weight: ${isTopThree ? 'bold' : 'normal'};">
                            ${medal}
                        </div>
                        <div style="flex: 1; margin-left: 12px;">
                            <div style="font-weight: 700; color: #333333; font-size: 1.1rem;">
                                ?쭬 ${rank.nickname}
                            </div>
                            <div style="color: #666; font-size: 0.9rem; margin-top: 2px;">
                                ${rank.classification} ??${rank.age}??
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: ${getIQTextColor(rank.iq)}; font-size: 1.2rem;">
                                IQ ${rank.iq}
                            </div>
                            <div style="color: #999; font-size: 0.8rem;">
                                ${new Date(rank.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `;
    }).join('');

    // ???쒖쐞 ?쒖떆
    showMyRankInAllTime();
}

// 二쇨컙 ??궧 ?섏씠吏???곗씠???덈줈怨좎묠
function refreshWeeklyRankingPage() {
    const weekStart = getWeekStart();
    const weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');
    const currentWeekRankings = weeklyRankings[weekStart] || [];
    const rankingList = document.getElementById('weeklyRankingList');
    const myRankSection = document.getElementById('myWeeklyRank');

    if (currentWeekRankings.length === 0) {
        rankingList.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">?대쾲 二??꾩쭅 ?깅줉????궧???놁뒿?덈떎.</div>';
        myRankSection.style.display = 'none';
        return;
    }

    rankingList.innerHTML = currentWeekRankings.map((rank, index) => {
        const ranking = index + 1;
        const isTopThree = ranking <= 3;
        const medal = ranking === 1 ? '?쪍' : ranking === 2 ? '?쪎' : ranking === 3 ? '?쪏' : `${ranking}??;

        return `
            < div style = "display: flex; align-items: center; padding: 12px 15px; margin-bottom: 8px; background: ${getWeeklyRankingBg(index)}; border-radius: 12px; border: 1px solid ${getWeeklyRankingBorder(index)}; box-shadow: ${isTopThree ? '0 4px 12px rgba(0, 212, 255, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.05)'};" >
                        <div style="width: 50px; text-align: center; font-size: ${isTopThree ? '1.4rem' : '1rem'}; font-weight: ${isTopThree ? 'bold' : 'normal'};">
                            ${medal}
                        </div>
                        <div style="flex: 1; margin-left: 12px;">
                            <div style="font-weight: 700; color: #333333; font-size: 1.1rem;">
                                ?쭬 ${rank.nickname}
                            </div>
                            <div style="color: #666; font-size: 0.9rem; margin-top: 2px;">
                                ${rank.classification} ??${rank.age}??
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: ${getIQTextColor(rank.iq)}; font-size: 1.2rem;">
                                IQ ${rank.iq}
                            </div>
                            <div style="color: #999; font-size: 0.8rem;">
                                ${new Date(rank.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div >
            `;
    }).join('');

    // ???쒖쐞 ?쒖떆
    showMyRankInWeekly();
}

// ?꾩껜 ??궧?먯꽌 ???쒖쐞 ?쒖떆
function showMyRankInAllTime() {
    const myRankSection = document.getElementById('myAllTimeRank');

    if (!userNickname) {
        myRankSection.style.display = 'none';
        return;
    }

    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    const myRankIndex = rankings.findIndex(rank => rank.nickname === userNickname);

    if (myRankIndex === -1) {
        myRankSection.style.display = 'none';
        return;
    }

    const myRank = rankings[myRankIndex];
    const ranking = myRankIndex + 1;

    myRankSection.style.display = 'block';
    myRankSection.innerHTML = `
            < h4 >? 렞 ??? 꾩껜 ? 쒖쐞</h4 >
                <div style="font-size: 1.1rem;">
                    <strong>${ranking}??/strong> / ${rankings.length}紐?以?
                        <span style="color: ${getIQTextColor(myRank.iq)}; font-weight: bold; margin-left: 10px;">IQ ${myRank.iq}</span>
                </div>
        `;
}

// 二쇨컙 ??궧?먯꽌 ???쒖쐞 ?쒖떆
function showMyRankInWeekly() {
    const myRankSection = document.getElementById('myWeeklyRank');

    if (!userNickname) {
        myRankSection.style.display = 'none';
        return;
    }

    const weekStart = getWeekStart();
    const weeklyRankings = JSON.parse(localStorage.getItem('iqTestWeeklyRankings') || '{}');
    const currentWeekRankings = weeklyRankings[weekStart] || [];
    const myRankIndex = currentWeekRankings.findIndex(rank => rank.nickname === userNickname);

    if (myRankIndex === -1) {
        myRankSection.style.display = 'none';
        return;
    }

    const myRank = currentWeekRankings[myRankIndex];
    const ranking = myRankIndex + 1;

    myRankSection.style.display = 'block';
    myRankSection.innerHTML = `
            < h4 >? 뱟 ?? 二쇨컙 ? 쒖쐞</h4 >
                <div style="font-size: 1.1rem;">
                    <strong>${ranking}??/strong> / ${currentWeekRankings.length}紐?以?
                        <span style="color: ${getIQTextColor(myRank.iq)}; font-weight: bold; margin-left: 10px;">IQ ${myRank.iq}</span>
                </div>
        `;
}

// ?꾩껜 ??궧 ??蹂닿린 湲곕뒫 (湲곗〈 肄붾뱶? ?곕룞)
function expandAllTimeRanking() {
    const moreRankings = document.getElementById('moreRankings');
    const button = document.querySelector('button[onclick*="toggleMoreRankings"]');

    if (moreRankings && button) {
        if (moreRankings.style.display === 'none') {
            moreRankings.style.display = 'block';
            button.textContent = '??궧 ?묎린';
        } else {
            moreRankings.style.display = 'none';
            const remainingCount = document.querySelectorAll('#moreRankings > div').length;
            button.textContent = `?? 留롮 ? ?? 궧 蹂닿린(${ remainingCount }紐 ? `;
        }
    }
}

// ============================================
// ?먮룞 蹂댁븞 紐⑤땲?곕쭅 ?쒖뒪??
// ============================================

// 蹂댁븞 ?대깽??濡쒓퉭
const securityLog = {
    events: [],
    maxEvents: 100,

    log: function (type, message, data = null) {
        const event = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            data: data,
            domain: window.location.hostname,
            userAgent: navigator.userAgent
        };

        this.events.unshift(event);
        if (this.events.length > this.maxEvents) {
            this.events.pop();
        }

        // ?ш컖??蹂댁븞 ?대깽?몃뒗 肄섏넄??寃쎄퀬 異쒕젰
        if (type === 'SECURITY_VIOLATION' || type === 'SUSPICIOUS_ACTIVITY') {
            console.warn(`? 슚 蹂댁븞 寃쎄퀬[${ type }]: ${ message }`, data);
        }

        // 濡쒖뺄 ?ㅽ넗由ъ???蹂댁븞 濡쒓렇 ???(理쒓렐 50媛쒕쭔)
        try {
            const recentLogs = this.events.slice(0, 50);
            localStorage.setItem('iqzone_security_log', JSON.stringify(recentLogs));
        } catch (e) {
            console.warn("蹂댁븞 濡쒓렇 ????ㅽ뙣:", e);
        }
    },

    getStats: function () {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const recentEvents = this.events.filter(e =>
            now - new Date(e.timestamp).getTime() < oneHour
        );

        return {
            totalEvents: this.events.length,
            recentEvents: recentEvents.length,
            securityViolations: recentEvents.filter(e => e.type === 'SECURITY_VIOLATION').length,
            suspiciousActivity: recentEvents.filter(e => e.type === 'SUSPICIOUS_ACTIVITY').length
        };
    }
};

// ?먮룞 蹂댁븞 泥댄겕 ?⑥닔??
function performSecurityChecks() {
    // 1. ?꾨찓??寃利?
    const currentDomain = window.location.hostname;
    const allowedDomains = ['cattowel39200.github.io', 'localhost', '127.0.0.1'];

    if (!allowedDomains.includes(currentDomain)) {
        securityLog.log('SECURITY_VIOLATION', '?뱀씤?섏? ?딆? ?꾨찓?몄뿉???묎렐', { domain: currentDomain });
    }

    // 2. Firebase ?곌껐 ?곹깭 ?뺤씤
    if (isFirebaseEnabled) {
        securityLog.log('INFO', 'Firebase ?대씪?곕뱶 ?숆린???쒖꽦');
    } else {
        securityLog.log('WARNING', 'Firebase ?곌껐 ?ㅽ뙣 - 濡쒖뺄 紐⑤뱶濡??숈옉');
    }

    // 3. 釉뚮씪?곗? ?섍꼍 ?뺤씤
    if (window.location.protocol === 'file:') {
        securityLog.log('WARNING', '濡쒖뺄 ?뚯씪濡??ㅽ뻾??);
    }

    // 4. ??궧 ?곗씠??臾닿껐??湲곕낯 寃??
    const rankings = JSON.parse(localStorage.getItem('iqTestRankings') || '[]');
    if (rankings.length > 1000) {
        securityLog.log('SUSPICIOUS_ACTIVITY', '鍮꾩젙?곸쟻?쇰줈 留롮? ??궧 ?곗씠??, { count: rankings.length });
    }
}

// ?섏떖?ㅻ윭???쒕룞 媛먯?
let rapidSubmissionCount = 0;
let lastSubmissionTime = 0;

function detectSuspiciousActivity() {
    const now = Date.now();

    // ?덈Т 鍮좊Ⅸ ?곗냽 ?쒖텧 媛먯?
    if (now - lastSubmissionTime < 5000) { // 5珥??대궡 ?ъ젣異?
        rapidSubmissionCount++;
        if (rapidSubmissionCount > 3) {
            securityLog.log('SUSPICIOUS_ACTIVITY', '鍮꾩젙?곸쟻?쇰줈 鍮좊Ⅸ ?곗냽 ?쒖텧 ?쒕룄', {
                count: rapidSubmissionCount,
                timeDiff: now - lastSubmissionTime
            });
        }
    } else {
        rapidSubmissionCount = 0;
    }

    lastSubmissionTime = now;
}

// 蹂댁븞 ?듦퀎 由ы룷???앹꽦
function generateSecurityReport() {
    const stats = securityLog.getStats();
    const report = {
        reportDate: new Date().toISOString(),
        domain: window.location.hostname,
        firebaseStatus: isFirebaseEnabled ? 'Connected' : 'Disconnected',
        stats: stats,
        recentEvents: securityLog.events.slice(0, 10)
    };

    console.log('?뱤 蹂댁븞 由ы룷??', report);
    return report;
}

// 珥덇린 蹂댁븞 寃???ㅽ뻾
setTimeout(() => {
    performSecurityChecks();
    securityLog.log('SYSTEM', 'IQZone 蹂댁븞 紐⑤땲?곕쭅 ?쒖옉');
}, 2000);

// ?뺢린 蹂댁븞 寃??(10遺꾨쭏??
setInterval(performSecurityChecks, 10 * 60 * 1000);

// 1?쒓컙留덈떎 蹂댁븞 由ы룷???앹꽦
setInterval(() => {
    const report = generateSecurityReport();
    securityLog.log('REPORT', '?뺢린 蹂댁븞 由ы룷???앹꽦', report);
}, 60 * 60 * 1000);

// ?꾩뿭 蹂댁븞 ?⑥닔 ?몄텧 (媛쒕컻???꾧뎄?먯꽌 ?ъ슜 媛??
window.IQZoneSecurity = {
    getSecurityLog: () => securityLog.events,
    getSecurityStats: () => securityLog.getStats(),
    generateReport: generateSecurityReport,
    clearLog: () => securityLog.events = []
};

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
animate();
