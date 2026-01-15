// 小論文テスト

// テーマデータ
const essayThemes = [
    {
        id: 1,
        title: 'AIと人間の共存',
        description: '人工知能(AI)の急速な発展により、私たちの生活は大きく変わりつつあります。AIと人間が共存する社会において、人間に求められる能力や役割について、あなたの考えを述べてください。',
        keywords: ['AI', '人工知能', '共存', '人間性', '創造性', '倫理']
    },
    {
        id: 2,
        title: '持続可能な社会の実現',
        description: '地球環境問題が深刻化する中、持続可能な社会を実現するために、個人・企業・政府はそれぞれどのような取り組みを行うべきでしょうか。具体例を挙げながら、あなたの考えを述べてください。',
        keywords: ['環境問題', 'SDGs', '持続可能性', 'エコ', 'カーボンニュートラル']
    },
    {
        id: 3,
        title: '教育のあり方',
        description: '急速に変化する現代社会において、教育はどのように変わるべきでしょうか。従来の教育システムの問題点と、これからの時代に必要な教育について、あなたの考えを述べてください。',
        keywords: ['教育改革', 'オンライン教育', '個別最適化', '生涯学習', '批判的思考']
    },
    {
        id: 4,
        title: '多様性と社会',
        description: '現代社会では、多様性(ダイバーシティ)の尊重が重要視されています。多様な価値観や背景を持つ人々が共に生きる社会を実現するために、何が必要だと考えますか。',
        keywords: ['ダイバーシティ', 'インクルージョン', '多文化共生', '相互理解', '平等']
    },
    {
        id: 5,
        title: '働き方の未来',
        description: 'テレワークの普及やAIの発展により、働き方は大きく変化しています。これからの時代における理想的な働き方とは何か、またそれを実現するために必要なことについて、あなたの考えを述べてください。',
        keywords: ['働き方改革', 'リモートワーク', 'ワークライフバランス', '生産性', '自己実現']
    }
];

// テスト状態
let selectedTheme = null;
let timer;
let testStartTime;
let autoSaveInterval;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initTest();
});

function initTest() {
    // 前回の保存データを確認
    const savedData = Storage.load('essayDraft');

    if (savedData && savedData.text) {
        if (confirm('前回の下書きがあります。続きから始めますか？')) {
            selectedTheme = essayThemes.find(t => t.id === savedData.themeId);
            if (selectedTheme) {
                startEssay(selectedTheme, savedData.text, savedData.remainingTime);
                return;
            }
        }
    }

    showThemeSelection();
}

function showThemeSelection() {
    const container = document.getElementById('themeOptions');

    let html = '';
    essayThemes.forEach(theme => {
        html += `
            <div class="option" onclick="selectTheme(${theme.id})" style="display:block;text-align:left;">
                <h4 style="color:#667eea;margin-bottom:10px;">${theme.title}</h4>
                <p style="font-size:0.9rem;color:#666;line-height:1.6;">${theme.description}</p>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectTheme(themeId) {
    selectedTheme = essayThemes.find(t => t.id === themeId);
    if (selectedTheme) {
        startEssay(selectedTheme);
    }
}

function startEssay(theme, savedText = '', remainingTime = null) {
    testStartTime = Date.now();

    // UIを切り替え
    document.getElementById('themeSelection').style.display = 'none';
    document.getElementById('essayContainer').style.display = 'block';
    document.getElementById('backToThemes').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'block';

    // テーマを表示
    document.getElementById('selectedTheme').innerHTML = `
        <h3>${theme.title}</h3>
        <p>${theme.description}</p>
        <div style="margin-top:15px;">
            <strong>キーワード:</strong>
            ${theme.keywords.map(k => `<span style="background:#e8e8e8;padding:3px 10px;border-radius:15px;margin-right:5px;font-size:0.85rem;">${k}</span>`).join('')}
        </div>
    `;

    // 保存されたテキストがあれば復元
    if (savedText) {
        document.getElementById('essayText').value = savedText;
        updateCharCount();
    }

    // タイマー開始（20分 または 残り時間）
    const duration = remainingTime || 20 * 60;
    timer = new Timer(duration, updateTimer, timeUp);
    timer.start();

    // 自動保存開始（30秒ごと）
    autoSaveInterval = setInterval(autoSave, 30000);
}

function backToThemes() {
    if (document.getElementById('essayText').value.trim()) {
        if (!confirm('入力内容は下書きとして保存されます。テーマ選択に戻りますか？')) {
            return;
        }
        autoSave();
    }

    timer.stop();
    clearInterval(autoSaveInterval);

    document.getElementById('themeSelection').style.display = 'block';
    document.getElementById('essayContainer').style.display = 'none';
    document.getElementById('backToThemes').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
}

function updateTimer(remaining) {
    const display = timer.formatTime(remaining);
    const timerElement = document.getElementById('timer');
    timerElement.textContent = display;

    if (remaining <= 300) { // 5分以下
        timerElement.classList.add('warning');
    }
}

function timeUp() {
    clearInterval(autoSaveInterval);
    alert('時間切れです。小論文を提出します。');
    submitEssay();
}

function updateCharCount() {
    const text = document.getElementById('essayText').value;
    const count = text.length;
    const countElement = document.getElementById('charCount');

    countElement.textContent = `${count} / 800〜1200字`;

    if (count < 800) {
        countElement.className = 'char-count warning';
    } else if (count > 1200) {
        countElement.className = 'char-count warning';
    } else {
        countElement.className = 'char-count success';
    }
}

function autoSave() {
    const text = document.getElementById('essayText').value;

    if (text.trim() && selectedTheme) {
        const saveData = {
            themeId: selectedTheme.id,
            text: text,
            remainingTime: timer.remaining,
            savedAt: new Date().toISOString()
        };

        Storage.save('essayDraft', saveData);

        // 保存通知を表示
        const notice = document.getElementById('autoSaveNotice');
        notice.style.display = 'block';
        notice.textContent = `自動保存しました (${new Date().toLocaleTimeString()})`;

        setTimeout(() => {
            notice.style.display = 'none';
        }, 2000);
    }
}

function submitEssay() {
    const text = document.getElementById('essayText').value;
    const charCount = text.length;

    if (charCount < 100) {
        if (!confirm('文字数が非常に少ないですが、提出しますか？')) {
            return;
        }
    } else if (charCount < 800) {
        if (!confirm(`文字数が${charCount}字です（推奨: 800〜1200字）。提出しますか？`)) {
            return;
        }
    }

    timer.stop();
    clearInterval(autoSaveInterval);

    const elapsedTime = Math.round((Date.now() - testStartTime) / 1000);

    // 受験者情報を取得
    const examinee = Storage.load('currentExaminee') || {};

    // 結果を保存
    const result = {
        type: 'essay',
        examineeName: examinee.name || '未登録',
        examineeBirth: examinee.birthDate || '未登録',
        themeId: selectedTheme.id,
        themeTitle: selectedTheme.title,
        text: text,
        charCount: charCount,
        date: new Date().toISOString(),
        time: elapsedTime
    };

    const results = Storage.load('testResults') || [];
    results.push(result);
    Storage.save('testResults', results);

    // Google Sheetsに送信
    sendToGoogleSheets({
        examineeName: result.examineeName,
        examineeBirth: result.examineeBirth,
        type: '小論文',
        score: '',
        total: '',
        percentage: '',
        iq: '',
        time: result.time,
        theme: result.themeTitle,
        essayText: result.text
    });

    // 受験者の完了テストを更新
    if (examinee.name) {
        if (!examinee.completedTests) examinee.completedTests = [];
        if (!examinee.completedTests.includes('essay')) {
            examinee.completedTests.push('essay');
        }
        Storage.save('currentExaminee', examinee);
    }

    // 下書きを削除
    Storage.remove('essayDraft');

    // 結果を表示
    showEssayResult(result, elapsedTime);
}

function showEssayResult(result, elapsedTime) {
    const container = document.querySelector('.test-container');

    // 簡易分析
    const text = result.text;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    const sentences = text.split(/[。！？]/).filter(s => s.trim());

    let feedback = '';
    if (result.charCount < 800) {
        feedback = '文字数が目標に達していません。もう少し詳しく論じることで、より説得力のある文章になります。';
    } else if (result.charCount > 1200) {
        feedback = '文字数が上限を超えています。要点を絞って、より簡潔に表現することを心がけましょう。';
    } else {
        feedback = '適切な文字数で書かれています。';
    }

    if (paragraphs.length < 3) {
        feedback += ' 段落分けをもう少し意識すると、読みやすい文章になります。';
    }

    container.innerHTML = `
        <div class="result-container">
            <h2>提出完了</h2>
            <div style="margin:30px 0;">
                <h3 style="color:#667eea;margin-bottom:10px;">テーマ: ${result.themeTitle}</h3>
            </div>
            <div class="result-details">
                <div class="result-item">
                    <span>文字数</span>
                    <span>${result.charCount}字</span>
                </div>
                <div class="result-item">
                    <span>段落数</span>
                    <span>${paragraphs.length}段落</span>
                </div>
                <div class="result-item">
                    <span>文の数</span>
                    <span>約${sentences.length}文</span>
                </div>
                <div class="result-item">
                    <span>所要時間</span>
                    <span>${timer.formatTime(elapsedTime)}</span>
                </div>
            </div>
            <div style="background:#f8f9ff;padding:20px;border-radius:10px;margin:30px 0;text-align:left;">
                <h4 style="margin-bottom:10px;">フィードバック</h4>
                <p style="color:#666;line-height:1.8;">${feedback}</p>
            </div>
            <div style="background:#fff;border:1px solid #ddd;padding:20px;border-radius:10px;margin:30px 0;text-align:left;max-height:300px;overflow-y:auto;">
                <h4 style="margin-bottom:10px;">提出内容</h4>
                <p style="color:#666;line-height:1.8;white-space:pre-wrap;">${result.text}</p>
            </div>
            <button class="nav-btn submit" onclick="location.href='../index.html'">トップに戻る</button>
        </div>
    `;
}
