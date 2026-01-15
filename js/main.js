// メインJavaScript - 共通機能

// Google Sheets API URL
const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbwll8NObL6l6umV_NQIQ1QftXfhg9H-brbuQZ-yN-yBIvcK9c8wzDFpUzY3Q5-oAK5O/exec';

// Google Sheetsにデータを送信
function sendToGoogleSheets(data) {
    fetch(GOOGLE_SHEETS_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(function(error) {
        console.log('送信エラー:', error);
    });
}

// ローカルストレージ管理
const Storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};

// タイマー機能
class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);

            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    pause() {
        this.stop();
    }

    resume() {
        if (!this.interval && this.remaining > 0) {
            this.start();
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// テスト結果の評価
function evaluateScore(score, total) {
    const percentage = (score / total) * 100;

    if (percentage >= 90) return { grade: 'S', message: '素晴らしい！天才的です！' };
    if (percentage >= 80) return { grade: 'A', message: '優秀です！高い能力を示しています。' };
    if (percentage >= 70) return { grade: 'B', message: '良い結果です。平均以上の能力があります。' };
    if (percentage >= 60) return { grade: 'C', message: '標準的な結果です。' };
    if (percentage >= 50) return { grade: 'D', message: 'もう少し頑張りましょう。' };
    return { grade: 'E', message: '復習が必要です。' };
}

// IQスコア計算（改良版）
// 30問中の正答数からIQを推定
// 平均正答率50%（15問）= IQ100、標準偏差を問題数の15%（約4.5問）と仮定
function calculateIQ(score, total, avgScore) {
    // 正答率を計算
    const percentage = score / total;

    // 正答率に基づくIQ計算
    // 50% = IQ100を基準に、正答率の変動をIQに変換
    // 標準偏差15%（正答率）= IQ15点の変動
    const avgPercentage = avgScore / total;
    const stdDev = 0.15; // 正答率の標準偏差を15%と仮定

    const zScore = (percentage - avgPercentage) / stdDev;
    let iq = Math.round(100 + zScore * 15);

    // 現実的な範囲に制限（70〜160）
    iq = Math.max(70, Math.min(160, iq));

    return iq;
}

// シャッフル機能
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 結果をHTMLで表示
function showResult(container, score, total, details = {}) {
    const evaluation = evaluateScore(score, total);
    const percentage = Math.round((score / total) * 100);

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
                ${details.time ? `
                <div class="result-item">
                    <span>所要時間</span>
                    <span>${details.time}</span>
                </div>
                ` : ''}
                ${details.iq ? `
                <div class="result-item">
                    <span>推定IQ</span>
                    <span>${details.iq}</span>
                </div>
                ` : ''}
            </div>
            <button class="nav-btn submit" onclick="location.href='../index.html'">トップに戻る</button>
        </div>
    `;
}

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 過去の結果があれば表示
    const results = Storage.load('testResults');
    if (results) {
        console.log('過去の結果:', results);
    }
});
