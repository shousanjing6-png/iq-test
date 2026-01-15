// 一般教養テスト

// 問題データ（15問）
const knowledgeQuestions = [
    // 科学（3問）
    {
        category: '科学',
        question: '水の化学式は次のうちどれですか？',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        answer: 0
    },
    {
        category: '科学',
        question: '地球から最も近い恒星は何ですか？',
        options: ['太陽', 'プロキシマ・ケンタウリ', 'シリウス', 'ベガ'],
        answer: 0
    },
    {
        category: '科学',
        question: '周期表で原子番号1の元素は何ですか？',
        options: ['水素', 'ヘリウム', '酸素', '炭素'],
        answer: 0
    },

    // 歴史（3問）
    {
        category: '歴史',
        question: 'フランス革命が起きたのは何年ですか？',
        options: ['1789年', '1776年', '1804年', '1815年'],
        answer: 0
    },
    {
        category: '歴史',
        question: '第二次世界大戦が終結したのは何年ですか？',
        options: ['1945年', '1944年', '1946年', '1943年'],
        answer: 0
    },
    {
        category: '歴史',
        question: 'ルネサンスが始まったとされる国はどこですか？',
        options: ['イタリア', 'フランス', 'イギリス', 'ドイツ'],
        answer: 0
    },

    // 地理（3問）
    {
        category: '地理',
        question: '世界で最も面積が大きい国はどこですか？',
        options: ['ロシア', 'カナダ', 'アメリカ', '中国'],
        answer: 0
    },
    {
        category: '地理',
        question: '日本で最も高い山は何ですか？',
        options: ['富士山', '北岳', '奥穂高岳', '槍ヶ岳'],
        answer: 0
    },
    {
        category: '地理',
        question: 'オーストラリアの首都はどこですか？',
        options: ['キャンベラ', 'シドニー', 'メルボルン', 'ブリスベン'],
        answer: 0
    },

    // 文学（3問）
    {
        category: '文学',
        question: '「吾輩は猫である」の作者は誰ですか？',
        options: ['夏目漱石', '芥川龍之介', '太宰治', '川端康成'],
        answer: 0
    },
    {
        category: '文学',
        question: '「源氏物語」の作者は誰ですか？',
        options: ['紫式部', '清少納言', '小野小町', '和泉式部'],
        answer: 0
    },
    {
        category: '文学',
        question: '「老人と海」の作者は誰ですか？',
        options: ['ヘミングウェイ', 'フィッツジェラルド', 'スタインベック', 'フォークナー'],
        answer: 0
    },

    // 一般知識（3問）
    {
        category: '一般知識',
        question: '国際連合の本部はどこにありますか？',
        options: ['ニューヨーク', 'ジュネーブ', 'ロンドン', 'パリ'],
        answer: 0
    },
    {
        category: '一般知識',
        question: 'オリンピックの五輪の色に含まれないのはどれですか？',
        options: ['紫', '青', '赤', '緑'],
        answer: 0
    },
    {
        category: '一般知識',
        question: '日本の国鳥は何ですか？',
        options: ['キジ', 'トキ', 'ツル', 'ウグイス'],
        answer: 0
    }
];

// テスト状態
let currentQuestion = 0;
let answers = [];
let timer;
let testStartTime;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initTest();
});

function initTest() {
    testStartTime = Date.now();
    answers = new Array(knowledgeQuestions.length).fill(null);

    document.getElementById('totalQuestions').textContent = knowledgeQuestions.length;

    // タイマー開始（10分）
    timer = new Timer(10 * 60, updateTimer, timeUp);
    timer.start();

    showQuestion(0);
}

function updateTimer(remaining) {
    const display = timer.formatTime(remaining);
    const timerElement = document.getElementById('timer');
    timerElement.textContent = display;

    if (remaining <= 60) {
        timerElement.classList.add('warning');
    }
}

function timeUp() {
    alert('時間切れです。テストを終了します。');
    submitTest();
}

function showQuestion(index) {
    currentQuestion = index;
    const question = knowledgeQuestions[index];
    const container = document.getElementById('questionContainer');

    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('progressBar').style.width = ((index + 1) / knowledgeQuestions.length * 100) + '%';

    let html = `
        <div class="question-number">
            <span style="background:#667eea;color:white;padding:3px 10px;border-radius:15px;font-size:0.8rem;">${question.category}</span>
            問題 ${index + 1}
        </div>
        <div class="question-text">${question.question}</div>
        <div class="options">
    `;

    question.options.forEach((option, i) => {
        const selected = answers[currentQuestion] === i ? 'selected' : '';
        html += `
            <label class="option ${selected}" onclick="selectAnswer(${i})">
                <input type="radio" name="answer" ${selected ? 'checked' : ''}>
                <span>${option}</span>
            </label>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // ナビゲーションボタン更新
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index < knowledgeQuestions.length - 1 ? 'block' : 'none';
    document.getElementById('submitBtn').style.display = index === knowledgeQuestions.length - 1 ? 'block' : 'none';
}

function selectAnswer(index) {
    answers[currentQuestion] = index;
    showQuestion(currentQuestion);
}

function prevQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function nextQuestion() {
    if (currentQuestion < knowledgeQuestions.length - 1) {
        showQuestion(currentQuestion + 1);
    }
}

function submitTest() {
    timer.stop();

    const elapsedTime = Math.round((Date.now() - testStartTime) / 1000);
    let score = 0;

    // カテゴリ別スコア
    const categoryScores = {};

    answers.forEach((answer, i) => {
        const question = knowledgeQuestions[i];
        if (!categoryScores[question.category]) {
            categoryScores[question.category] = { correct: 0, total: 0 };
        }
        categoryScores[question.category].total++;

        if (answer === question.answer) {
            score++;
            categoryScores[question.category].correct++;
        }
    });

    const total = knowledgeQuestions.length;

    // 受験者情報を取得
    const examinee = Storage.load('currentExaminee') || {};

    // 結果を保存
    const result = {
        type: 'knowledge',
        examineeName: examinee.name || '未登録',
        examineeBirth: examinee.birthDate || '未登録',
        score: score,
        total: total,
        categoryScores: categoryScores,
        date: new Date().toISOString(),
        time: elapsedTime
    };

    const results = Storage.load('testResults') || [];
    results.push(result);
    Storage.save('testResults', results);

    // 受験者の完了テストを更新
    if (examinee.name) {
        if (!examinee.completedTests) examinee.completedTests = [];
        if (!examinee.completedTests.includes('knowledge')) {
            examinee.completedTests.push('knowledge');
        }
        Storage.save('currentExaminee', examinee);
    }

    // 結果を表示
    showKnowledgeResult(score, total, categoryScores, elapsedTime);
}

function showKnowledgeResult(score, total, categoryScores, elapsedTime) {
    const container = document.querySelector('.test-container');
    const evaluation = evaluateScore(score, total);
    const percentage = Math.round((score / total) * 100);

    let categoryHTML = '';
    for (const [category, scores] of Object.entries(categoryScores)) {
        const catPercent = Math.round((scores.correct / scores.total) * 100);
        categoryHTML += `
            <div class="result-item">
                <span>${category}</span>
                <span>${scores.correct}/${scores.total} (${catPercent}%)</span>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="result-container">
            <h2>テスト結果</h2>
            <div class="result-score">${score} / ${total}</div>
            <div class="result-message">${evaluation.message}</div>
            <div class="result-details">
                <div class="result-item">
                    <span>正答率</span>
                    <span>${percentage}%</span>
                </div>
                <div class="result-item">
                    <span>評価</span>
                    <span>グレード ${evaluation.grade}</span>
                </div>
                <div class="result-item">
                    <span>所要時間</span>
                    <span>${timer.formatTime(elapsedTime)}</span>
                </div>
            </div>
            <h3 style="margin-top:30px;margin-bottom:15px;">カテゴリ別結果</h3>
            <div class="result-details">
                ${categoryHTML}
            </div>
            <button class="nav-btn submit" onclick="location.href='../index.html'" style="margin-top:30px;">次のテストへ進む</button>
        </div>
    `;
}
