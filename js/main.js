// メインJavaScript - 共通機能

// Google Sheets API URL
const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzcKzdz9eGmR6KVhBvRxHPs4hY5qCQD4MuLI1-XXq63F-QnP-fI3J_RYjGclc1f22V7/exec';

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

// IQスコア計算（動的統計版）
// 実際の受験者データから平均・標準偏差を計算してIQを算出
function calculateIQ(score, total) {
    // 過去のMensaテスト結果を取得
    const allResults = Storage.load('testResults') || [];
    const mensaResults = allResults.filter(r => r.type === 'mensa');

    // 正答率を計算
    const percentage = score / total;

    let avgPercentage, stdDev;

    if (mensaResults.length >= 10) {
        // 十分なデータがある場合：実際の統計を使用
        const percentages = mensaResults.map(r => r.score / r.total);

        // 平均を計算
        avgPercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;

        // 標準偏差を計算
        const variance = percentages.reduce((sum, p) => sum + Math.pow(p - avgPercentage, 2), 0) / percentages.length;
        stdDev = Math.sqrt(variance);

        // 標準偏差が小さすぎる場合は最小値を設定（0除算防止）
        if (stdDev < 0.05) {
            stdDev = 0.05;
        }
    } else {
        // データが不十分な場合：デフォルト値を使用
        // 平均50%、標準偏差15%（一般的なIQテストの想定）
        avgPercentage = 0.5;
        stdDev = 0.15;
    }

    // zスコアを計算（偏差値の元となる標準化得点）
    const zScore = (percentage - avgPercentage) / stdDev;

    // IQに変換（平均100、標準偏差15）
    let iq = Math.round(100 + zScore * 15);

    // 現実的な範囲に制限（70〜160）
    iq = Math.max(70, Math.min(160, iq));

    return iq;
}

// 統計情報を取得する関数（管理画面用）
function getMensaStatistics() {
    const allResults = Storage.load('testResults') || [];
    const mensaResults = allResults.filter(r => r.type === 'mensa');

    if (mensaResults.length === 0) {
        return {
            count: 0,
            avgPercentage: null,
            stdDev: null,
            minScore: null,
            maxScore: null,
            avgIQ: null
        };
    }

    const percentages = mensaResults.map(r => r.score / r.total);
    const iqs = mensaResults.map(r => r.iq);

    const avgPercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const variance = percentages.reduce((sum, p) => sum + Math.pow(p - avgPercentage, 2), 0) / percentages.length;
    const stdDev = Math.sqrt(variance);

    return {
        count: mensaResults.length,
        avgPercentage: Math.round(avgPercentage * 100),
        stdDev: Math.round(stdDev * 100),
        minScore: Math.min(...percentages.map(p => Math.round(p * 100))),
        maxScore: Math.max(...percentages.map(p => Math.round(p * 100))),
        avgIQ: Math.round(iqs.reduce((sum, iq) => sum + iq, 0) / iqs.length)
    };
}

// すべてのMensa結果のIQを再計算する関数
function recalculateAllIQ() {
    const allResults = Storage.load('testResults') || [];

    // まず現在の統計を計算（全データを使用）
    const mensaResults = allResults.filter(r => r.type === 'mensa');

    if (mensaResults.length < 2) {
        return { updated: 0, message: 'データが不足しています（最低2件必要）' };
    }

    const percentages = mensaResults.map(r => r.score / r.total);
    const avgPercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const variance = percentages.reduce((sum, p) => sum + Math.pow(p - avgPercentage, 2), 0) / percentages.length;
    let stdDev = Math.sqrt(variance);

    if (stdDev < 0.05) {
        stdDev = 0.05;
    }

    // 全てのMensa結果のIQを再計算
    let updatedCount = 0;
    allResults.forEach(result => {
        if (result.type === 'mensa') {
            const percentage = result.score / result.total;
            const zScore = (percentage - avgPercentage) / stdDev;
            let newIQ = Math.round(100 + zScore * 15);
            newIQ = Math.max(70, Math.min(160, newIQ));

            if (result.iq !== newIQ) {
                result.iq = newIQ;
                updatedCount++;
            }
        }
    });

    // 更新したデータを保存
    Storage.save('testResults', allResults);

    return {
        updated: updatedCount,
        message: `${updatedCount}件のIQを再計算しました`,
        stats: {
            avgPercentage: Math.round(avgPercentage * 100),
            stdDev: Math.round(stdDev * 100)
        }
    };
}

// ==========================================
// 問題別統計管理
// ==========================================

// 問題別の統計を記録
function recordQuestionStats(testType, questionIndex, isCorrect) {
    const stats = Storage.load('questionStats') || {};
    const key = `${testType}_${questionIndex}`;

    if (!stats[key]) {
        stats[key] = {
            testType: testType,
            questionIndex: questionIndex,
            totalAttempts: 0,
            correctCount: 0,
            lastUpdated: null
        };
    }

    stats[key].totalAttempts++;
    if (isCorrect) {
        stats[key].correctCount++;
    }
    stats[key].lastUpdated = new Date().toISOString();

    Storage.save('questionStats', stats);
}

// 複数の問題統計を一括記録
function recordAllQuestionStats(testType, answers, correctAnswers) {
    answers.forEach((answer, index) => {
        const isCorrect = answer === correctAnswers[index];
        recordQuestionStats(testType, index, isCorrect);
    });
}

// 問題別の統計を取得
function getQuestionStats(testType) {
    const stats = Storage.load('questionStats') || {};
    const result = [];

    for (const key in stats) {
        if (stats[key].testType === testType) {
            const s = stats[key];
            result.push({
                index: s.questionIndex,
                totalAttempts: s.totalAttempts,
                correctCount: s.correctCount,
                correctRate: s.totalAttempts > 0 ? Math.round((s.correctCount / s.totalAttempts) * 100) : 0,
                lastUpdated: s.lastUpdated
            });
        }
    }

    // インデックス順にソート
    result.sort((a, b) => a.index - b.index);
    return result;
}

// 問題の難易度を分析
function analyzeQuestionDifficulty(testType) {
    const stats = getQuestionStats(testType);

    if (stats.length === 0) {
        return { easy: [], medium: [], hard: [], noData: [] };
    }

    const easy = [];    // 正答率80%以上（簡単すぎる）
    const medium = [];  // 正答率30-80%（適切）
    const hard = [];    // 正答率30%未満（難しすぎる）
    const noData = [];  // データ不足（5回未満）

    stats.forEach(s => {
        if (s.totalAttempts < 5) {
            noData.push(s);
        } else if (s.correctRate >= 80) {
            easy.push(s);
        } else if (s.correctRate >= 30) {
            medium.push(s);
        } else {
            hard.push(s);
        }
    });

    return { easy, medium, hard, noData };
}

// 問題の出題順を正答率に基づいて調整（易→難）
function getAdjustedQuestionOrder(testType, totalQuestions) {
    const stats = getQuestionStats(testType);

    // 統計がない問題はデフォルトの正答率50%として扱う
    const questionRates = [];
    for (let i = 0; i < totalQuestions; i++) {
        const stat = stats.find(s => s.index === i);
        questionRates.push({
            index: i,
            correctRate: stat ? stat.correctRate : 50,
            hasData: !!stat && stat.totalAttempts >= 5
        });
    }

    // 正答率が高い順（易しい順）にソート
    questionRates.sort((a, b) => b.correctRate - a.correctRate);

    return questionRates.map(q => q.index);
}

// 問題の配点を正答率に基づいて調整
function getQuestionWeights(testType, totalQuestions) {
    const stats = getQuestionStats(testType);

    const weights = [];
    for (let i = 0; i < totalQuestions; i++) {
        const stat = stats.find(s => s.index === i);

        // 基本配点は1点
        // 正答率が低い問題ほど配点が高い
        let weight = 1;
        if (stat && stat.totalAttempts >= 5) {
            if (stat.correctRate < 20) {
                weight = 2.0;  // 非常に難しい
            } else if (stat.correctRate < 40) {
                weight = 1.5;  // 難しい
            } else if (stat.correctRate >= 80) {
                weight = 0.8;  // 簡単
            }
        }
        weights.push(weight);
    }

    return weights;
}

// ==========================================
// 問題管理機能
// ==========================================

// 問題の有効/無効状態を取得
function getDisabledQuestions(testType) {
    const disabled = Storage.load('disabledQuestions') || {};
    return disabled[testType] || [];
}

// 問題を無効化
function disableQuestion(testType, questionIndex) {
    const disabled = Storage.load('disabledQuestions') || {};
    if (!disabled[testType]) {
        disabled[testType] = [];
    }
    if (!disabled[testType].includes(questionIndex)) {
        disabled[testType].push(questionIndex);
    }
    Storage.save('disabledQuestions', disabled);
}

// 問題を有効化
function enableQuestion(testType, questionIndex) {
    const disabled = Storage.load('disabledQuestions') || {};
    if (disabled[testType]) {
        disabled[testType] = disabled[testType].filter(i => i !== questionIndex);
    }
    Storage.save('disabledQuestions', disabled);
}

// 問題が無効かどうかを確認
function isQuestionDisabled(testType, questionIndex) {
    const disabled = getDisabledQuestions(testType);
    return disabled.includes(questionIndex);
}

// 有効な問題のインデックスを取得
function getEnabledQuestionIndices(testType, totalQuestions) {
    const disabled = getDisabledQuestions(testType);
    const enabled = [];
    for (let i = 0; i < totalQuestions; i++) {
        if (!disabled.includes(i)) {
            enabled.push(i);
        }
    }
    return enabled;
}

// 問題統計をリセット
function resetQuestionStats(testType, questionIndex) {
    const stats = Storage.load('questionStats') || {};
    const key = `${testType}_${questionIndex}`;
    if (stats[key]) {
        delete stats[key];
        Storage.save('questionStats', stats);
    }
}

// 全ての問題統計をリセット
function resetAllQuestionStats(testType) {
    const stats = Storage.load('questionStats') || {};
    const keysToDelete = Object.keys(stats).filter(key => key.startsWith(testType + '_'));
    keysToDelete.forEach(key => delete stats[key]);
    Storage.save('questionStats', stats);
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
