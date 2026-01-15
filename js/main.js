// メインJavaScript - 共通機能

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

// IQスコア計算（簡易版）
function calculateIQ(score, total, avgScore) {
    // 標準偏差を15と仮定した簡易計算
    const zScore = (score - avgScore) / (total * 0.15);
    return Math.round(100 + zScore * 15);
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
