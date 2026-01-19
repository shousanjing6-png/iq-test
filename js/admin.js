// 管理者画面

const ADMIN_PASSWORD = 'viavia';
let allResults = [];
let examineesData = {}; // 受験者ごとのデータを保持

// パスワードチェック
function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const error = document.getElementById('loginError');

    if (input === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadResults();
    } else {
        error.style.display = 'block';
        document.getElementById('passwordInput').value = '';
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // ログイン画面を表示、管理者コンテンツを非表示
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
});

function loadResults() {
    allResults = Storage.load('testResults') || [];
    buildExamineesData();
    updateStats();
    updateStatsInfo();
    renderExamineeView();
    filterResults();
}

// 統計情報を更新
function updateStatsInfo() {
    const stats = getMensaStatistics();
    const statsInfo = document.getElementById('statsInfo');

    if (stats.count >= 2) {
        statsInfo.style.display = 'flex';
        document.getElementById('statAvgPercent').textContent = stats.avgPercentage + '%';
        document.getElementById('statStdDev').textContent = stats.stdDev + '%';
        document.getElementById('statAvgIQ').textContent = stats.avgIQ;
        document.getElementById('statCount').textContent = stats.count + '件';
    } else {
        statsInfo.style.display = 'none';
    }
}

// IQ再計算
function recalculateIQ() {
    const mensaCount = allResults.filter(r => r.type === 'mensa').length;

    if (mensaCount < 2) {
        alert('IQを再計算するには、最低2件のMensaテスト結果が必要です。');
        return;
    }

    if (confirm('すべてのMensaテスト結果のIQを、現在の統計データに基づいて再計算しますか？\n\n※ 受験者数が増えると、より正確なIQが算出されます。')) {
        const result = recalculateAllIQ();
        alert(result.message + '\n\n現在の統計:\n・平均正答率: ' + result.stats.avgPercentage + '%\n・標準偏差: ' + result.stats.stdDev + '%');

        // データを再読み込み
        loadResults();
    }
}

// 受験者ごとにデータを集約
function buildExamineesData() {
    examineesData = {};

    allResults.forEach(result => {
        const key = result.examineeName + '_' + result.examineeBirth;
        if (!examineesData[key]) {
            examineesData[key] = {
                name: result.examineeName,
                birth: result.examineeBirth,
                allResults: [],
                mensa: [],
                knowledge: [],
                essay: []
            };
        }

        examineesData[key].allResults.push(result);

        if (result.type === 'mensa') {
            examineesData[key].mensa.push(result);
        } else if (result.type === 'knowledge') {
            examineesData[key].knowledge.push(result);
        } else if (result.type === 'essay') {
            examineesData[key].essay.push(result);
        }
    });

    // 各結果を日付順にソート（新しい順）
    for (const key in examineesData) {
        examineesData[key].allResults.sort((a, b) => new Date(b.date) - new Date(a.date));
        examineesData[key].mensa.sort((a, b) => new Date(b.date) - new Date(a.date));
        examineesData[key].knowledge.sort((a, b) => new Date(b.date) - new Date(a.date));
        examineesData[key].essay.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// 検索機能
function searchExaminees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    renderExamineeView(searchTerm);
}

// ビュー切り替え
function switchView(view) {
    const examineeView = document.getElementById('examineeView');
    const resultView = document.getElementById('resultView');
    const questionView = document.getElementById('questionView');
    const examineeBtn = document.getElementById('examineeViewBtn');
    const resultBtn = document.getElementById('resultViewBtn');
    const questionBtn = document.getElementById('questionViewBtn');

    // すべて非表示
    examineeView.style.display = 'none';
    resultView.style.display = 'none';
    questionView.style.display = 'none';
    examineeBtn.classList.remove('active');
    resultBtn.classList.remove('active');
    questionBtn.classList.remove('active');

    if (view === 'examinee') {
        examineeView.style.display = 'block';
        examineeBtn.classList.add('active');
    } else if (view === 'result') {
        resultView.style.display = 'block';
        resultBtn.classList.add('active');
    } else if (view === 'question') {
        questionView.style.display = 'block';
        questionBtn.classList.add('active');
        renderQuestionAnalysis();
    }
}

// 問題分析を表示
function renderQuestionAnalysis() {
    const analysis = analyzeQuestionDifficulty('mensa');
    const stats = getQuestionStats('mensa');

    // サマリー更新
    document.getElementById('easyCount').textContent = analysis.easy.length;
    document.getElementById('mediumCount').textContent = analysis.medium.length;
    document.getElementById('hardCount').textContent = analysis.hard.length;
    document.getElementById('noDataCount').textContent = analysis.noData.length;

    const questionList = document.getElementById('questionList');
    const noData = document.getElementById('noQuestionData');

    if (stats.length === 0) {
        questionList.innerHTML = '';
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    // 問題を正答率順にソート（低い順 = 難しい順）
    const sortedStats = [...stats].sort((a, b) => a.correctRate - b.correctRate);

    // 全問題数を取得（統計がない問題も含める）
    const totalQuestions = 30; // Mensaテストの問題数
    const allQuestions = [];

    for (let i = 0; i < totalQuestions; i++) {
        const stat = stats.find(s => s.index === i);
        const isDisabled = isQuestionDisabled('mensa', i);

        allQuestions.push({
            index: i,
            totalAttempts: stat ? stat.totalAttempts : 0,
            correctRate: stat ? stat.correctRate : 0,
            isDisabled: isDisabled
        });
    }

    // 正答率順にソート（低い順 = 難しい順）
    const sortedQuestions = [...allQuestions].sort((a, b) => a.correctRate - b.correctRate);

    questionList.innerHTML = sortedQuestions.map(s => {
        let difficulty, statusText;
        if (s.isDisabled) {
            difficulty = 'disabled';
            statusText = '無効';
        } else if (s.totalAttempts < 5) {
            difficulty = 'nodata';
            statusText = 'データ不足';
        } else if (s.correctRate >= 80) {
            difficulty = 'easy';
            statusText = '簡単すぎる';
        } else if (s.correctRate >= 30) {
            difficulty = 'medium';
            statusText = '適切';
        } else {
            difficulty = 'hard';
            statusText = '難しすぎる';
        }

        const toggleBtn = s.isDisabled
            ? `<button class="toggle-btn enable" onclick="toggleQuestion(${s.index}, true)">有効化</button>`
            : `<button class="toggle-btn disable" onclick="toggleQuestion(${s.index}, false)">無効化</button>`;

        return `
            <div class="question-item ${difficulty}">
                <div class="question-number">問題 ${s.index + 1}</div>
                <div class="question-stats">
                    <div class="question-rate">
                        <div class="rate-bar">
                            <div class="rate-fill ${difficulty}" style="width: ${s.correctRate}%"></div>
                        </div>
                        <span class="rate-value">${s.correctRate}%</span>
                    </div>
                    <div class="question-attempts">${s.totalAttempts}回受験</div>
                </div>
                <span class="question-status ${difficulty}">${statusText}</span>
                ${toggleBtn}
            </div>
        `;
    }).join('');
}

// 問題の有効/無効を切り替え
function toggleQuestion(index, enable) {
    if (enable) {
        enableQuestion('mensa', index);
    } else {
        if (confirm(`問題 ${index + 1} を無効化しますか？\n無効化された問題はテストに出題されなくなります。`)) {
            disableQuestion('mensa', index);
        }
    }
    renderQuestionAnalysis();
}

// 受験者一覧を表示
function renderExamineeView(searchTerm = '') {
    const grid = document.getElementById('examineeGrid');
    const noData = document.getElementById('noExamineeData');

    let examineeList = Object.entries(examineesData)
        .filter(([key, e]) => e.name && e.name !== '未登録')
        .map(([key, e]) => ({ ...e, key }));

    // 検索フィルタ
    if (searchTerm) {
        examineeList = examineeList.filter(e =>
            e.name.toLowerCase().includes(searchTerm)
        );
    }

    if (examineeList.length === 0) {
        grid.innerHTML = '';
        noData.style.display = 'block';
        noData.textContent = searchTerm ? '検索結果がありません' : 'まだ受験者がいません';
        return;
    }

    noData.style.display = 'none';

    grid.innerHTML = examineeList.map(examinee => {
        // 最新の結果を取得
        const latestMensa = examinee.mensa[0] || null;
        const latestKnowledge = examinee.knowledge[0] || null;
        const latestEssay = examinee.essay[0] || null;

        return renderExamineeCard({
            ...examinee,
            mensa: latestMensa,
            knowledge: latestKnowledge,
            essay: latestEssay
        });
    }).join('');
}

// 受験者カードを生成
function renderExamineeCard(examinee) {
    // IQ表示
    let iqHtml = '';
    if (examinee.mensa) {
        iqHtml = `
            <div class="iq-display">
                <div class="iq-value">${examinee.mensa.iq}</div>
                <div class="iq-label">IQ</div>
            </div>
        `;
    } else {
        iqHtml = `
            <div class="iq-display" style="background:#ccc;">
                <div class="iq-value">-</div>
                <div class="iq-label">未受験</div>
            </div>
        `;
    }

    // 得意分野・苦手分野（一般教養から）
    let strengthHtml = '';
    if (examinee.knowledge && examinee.knowledge.categoryScores) {
        const strengths = [];
        const weaknesses = [];

        for (const [category, scores] of Object.entries(examinee.knowledge.categoryScores)) {
            const percent = (scores.correct / scores.total) * 100;
            if (percent >= 67) {
                strengths.push(category);
            } else if (percent < 50) {
                weaknesses.push(category);
            }
        }

        let tagsHtml = '';
        if (strengths.length > 0) {
            tagsHtml += strengths.map(s => `<span class="strength-tag">◎ ${s}</span>`).join('');
        }
        if (weaknesses.length > 0) {
            tagsHtml += weaknesses.map(w => `<span class="weakness-tag">△ ${w}</span>`).join('');
        }

        if (tagsHtml) {
            strengthHtml = `
                <div class="strength-section">
                    <h4>得意・苦手分野</h4>
                    <div class="strength-tags">${tagsHtml}</div>
                </div>
            `;
        }
    } else {
        strengthHtml = `
            <div class="strength-section">
                <h4>得意・苦手分野</h4>
                <p class="no-test">一般教養テスト未受験</p>
            </div>
        `;
    }

    // 小論文評価
    let essayHtml = '';
    if (examinee.essay) {
        const aiEval = generateEssayEvaluation(examinee.essay);
        essayHtml = `
            <div class="essay-summary">
                <h4>小論文評価（${examinee.essay.themeTitle || 'テーマ不明'}）</h4>
                <div class="essay-scores">
                    <div class="essay-score-item">
                        <div class="essay-score-value">${aiEval.structure}</div>
                        <div class="essay-score-label">構成力</div>
                    </div>
                    <div class="essay-score-item">
                        <div class="essay-score-value">${aiEval.logic}</div>
                        <div class="essay-score-label">論理性</div>
                    </div>
                    <div class="essay-score-item">
                        <div class="essay-score-value">${aiEval.expression}</div>
                        <div class="essay-score-label">表現力</div>
                    </div>
                    <div class="essay-score-item">
                        <div class="essay-score-value">${aiEval.originality}</div>
                        <div class="essay-score-label">独創性</div>
                    </div>
                    <div class="essay-score-item">
                        <div class="essay-score-value" style="color:#2ecc71;">${aiEval.total}/40</div>
                        <div class="essay-score-label">総合</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        essayHtml = `
            <div class="essay-summary">
                <h4>小論文評価</h4>
                <p class="no-test">小論文テスト未受験</p>
            </div>
        `;
    }

    // 受験日
    let dateInfo = '';
    const dates = [];
    if (examinee.mensa) dates.push(`Mensa: ${new Date(examinee.mensa.date).toLocaleDateString('ja-JP')}`);
    if (examinee.knowledge) dates.push(`教養: ${new Date(examinee.knowledge.date).toLocaleDateString('ja-JP')}`);
    if (examinee.essay) dates.push(`小論文: ${new Date(examinee.essay.date).toLocaleDateString('ja-JP')}`);
    if (dates.length > 0) {
        dateInfo = `<div class="test-date">${dates.join(' | ')}</div>`;
    }

    // 受験回数
    const testCounts = [];
    const mensaCount = examineesData[examinee.name + '_' + examinee.birth]?.mensa.length || 0;
    const knowledgeCount = examineesData[examinee.name + '_' + examinee.birth]?.knowledge.length || 0;
    const essayCount = examineesData[examinee.name + '_' + examinee.birth]?.essay.length || 0;
    const totalCount = mensaCount + knowledgeCount + essayCount;

    const countInfo = `<div class="test-date">受験回数: ${totalCount}回（Mensa: ${mensaCount} / 教養: ${knowledgeCount} / 小論文: ${essayCount}）</div>`;

    const examKey = examinee.name + '_' + examinee.birth;

    return `
        <div class="examinee-card" onclick="showExamineeDetail('${examKey.replace(/'/g, "\\'")}')">
            <div class="examinee-header">
                <div>
                    <div class="examinee-name">${examinee.name}</div>
                    <div class="examinee-birth">${examinee.birth}</div>
                </div>
                ${iqHtml}
            </div>
            ${strengthHtml}
            ${essayHtml}
            ${dateInfo}
            ${countInfo}
        </div>
    `;
}

function updateStats() {
    const mensaResults = allResults.filter(r => r.type === 'mensa');
    const knowledgeResults = allResults.filter(r => r.type === 'knowledge');
    const essayResults = allResults.filter(r => r.type === 'essay');

    document.getElementById('totalTests').textContent = allResults.length;
    document.getElementById('mensaCount').textContent = mensaResults.length;
    document.getElementById('knowledgeCount').textContent = knowledgeResults.length;
    document.getElementById('essayCount').textContent = essayResults.length;
}

function filterResults() {
    const typeFilter = document.getElementById('typeFilter').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let filtered = [...allResults];

    // タイプでフィルター
    if (typeFilter !== 'all') {
        filtered = filtered.filter(r => r.type === typeFilter);
    }

    // ソート
    if (sortOrder === 'newest') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'score') {
        filtered.sort((a, b) => {
            const scoreA = a.type === 'essay' ? a.charCount : (a.score / a.total);
            const scoreB = b.type === 'essay' ? b.charCount : (b.score / b.total);
            return scoreB - scoreA;
        });
    }

    renderResults(filtered);
}

function renderResults(results) {
    const tbody = document.getElementById('resultsBody');
    const noData = document.getElementById('noData');

    if (results.length === 0) {
        tbody.innerHTML = '';
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    tbody.innerHTML = results.map((result, index) => {
        const date = new Date(result.date);
        const dateStr = date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP', {hour: '2-digit', minute: '2-digit'});

        const typeLabel = getTypeLabel(result.type);
        const typeBadge = `<span class="badge ${result.type}">${typeLabel}</span>`;

        const examineeName = result.examineeName || '未登録';

        let scoreHtml;
        if (result.type === 'essay') {
            scoreHtml = `${result.charCount}字`;
        } else {
            const percentage = Math.round((result.score / result.total) * 100);
            const scoreClass = percentage >= 70 ? 'high' : (percentage >= 50 ? 'medium' : 'low');
            scoreHtml = `
                <div class="score-bar"><div class="score-fill ${scoreClass}" style="width:${percentage}%"></div></div>
                ${result.score}/${result.total} (${percentage}%)
            `;
        }

        const timeStr = formatTime(result.time);
        const originalIndex = allResults.indexOf(result);

        return `
            <tr>
                <td>${examineeName}</td>
                <td>${dateStr}</td>
                <td>${typeBadge}</td>
                <td>${scoreHtml}</td>
                <td>${timeStr}</td>
                <td><button class="detail-btn" onclick="showDetail(${originalIndex})">詳細</button></td>
            </tr>
        `;
    }).join('');
}

function getTypeLabel(type) {
    switch (type) {
        case 'mensa': return 'Mensa';
        case 'knowledge': return '一般教養';
        case 'essay': return '小論文';
        default: return type;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs.toString().padStart(2, '0')}秒`;
}

function showDetail(index) {
    const result = allResults[index];
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    title.textContent = getTypeLabel(result.type) + 'テスト 詳細';

    if (result.type === 'mensa') {
        body.innerHTML = renderMensaDetail(result);
    } else if (result.type === 'knowledge') {
        body.innerHTML = renderKnowledgeDetail(result);
    } else if (result.type === 'essay') {
        body.innerHTML = renderEssayDetail(result);
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function renderMensaDetail(result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const evaluation = evaluateScore(result.score, result.total);

    return `
        <div class="result-details">
            <div class="result-item">
                <span>受験者</span>
                <span style="font-weight:bold;">${result.examineeName || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>生年月日</span>
                <span>${result.examineeBirth || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>受験日時</span>
                <span>${new Date(result.date).toLocaleString('ja-JP')}</span>
            </div>
            <div class="result-item">
                <span>スコア</span>
                <span>${result.score} / ${result.total} (${percentage}%)</span>
            </div>
            <div class="result-item">
                <span>推定IQ</span>
                <span style="font-weight:bold;color:#667eea;">${result.iq}</span>
            </div>
            <div class="result-item">
                <span>評価</span>
                <span>グレード ${evaluation.grade}</span>
            </div>
            <div class="result-item">
                <span>所要時間</span>
                <span>${formatTime(result.time)}</span>
            </div>
        </div>
        <div class="ai-evaluation">
            <h4><span class="ai-badge">AI分析</span> パフォーマンス分析</h4>
            <p style="color:#666;line-height:1.8;">
                ${generateMensaAnalysis(result)}
            </p>
        </div>
    `;
}

function renderKnowledgeDetail(result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const evaluation = evaluateScore(result.score, result.total);

    let categoryHtml = '';
    if (result.categoryScores) {
        categoryHtml = '<h4 style="margin-top:20px;margin-bottom:10px;">カテゴリ別結果</h4><div class="result-details">';
        for (const [category, scores] of Object.entries(result.categoryScores)) {
            const catPercent = Math.round((scores.correct / scores.total) * 100);
            categoryHtml += `
                <div class="result-item">
                    <span>${category}</span>
                    <span>${scores.correct}/${scores.total} (${catPercent}%)</span>
                </div>
            `;
        }
        categoryHtml += '</div>';
    }

    return `
        <div class="result-details">
            <div class="result-item">
                <span>受験者</span>
                <span style="font-weight:bold;">${result.examineeName || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>生年月日</span>
                <span>${result.examineeBirth || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>受験日時</span>
                <span>${new Date(result.date).toLocaleString('ja-JP')}</span>
            </div>
            <div class="result-item">
                <span>スコア</span>
                <span>${result.score} / ${result.total} (${percentage}%)</span>
            </div>
            <div class="result-item">
                <span>評価</span>
                <span>グレード ${evaluation.grade}</span>
            </div>
            <div class="result-item">
                <span>所要時間</span>
                <span>${formatTime(result.time)}</span>
            </div>
        </div>
        ${categoryHtml}
        <div class="ai-evaluation">
            <h4><span class="ai-badge">AI分析</span> 学習アドバイス</h4>
            <p style="color:#666;line-height:1.8;">
                ${generateKnowledgeAnalysis(result)}
            </p>
        </div>
    `;
}

function renderEssayDetail(result) {
    const aiEval = generateEssayEvaluation(result);

    return `
        <div class="result-details">
            <div class="result-item">
                <span>受験者</span>
                <span style="font-weight:bold;">${result.examineeName || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>生年月日</span>
                <span>${result.examineeBirth || '未登録'}</span>
            </div>
            <div class="result-item">
                <span>受験日時</span>
                <span>${new Date(result.date).toLocaleString('ja-JP')}</span>
            </div>
            <div class="result-item">
                <span>テーマ</span>
                <span>${result.themeTitle || 'テーマ情報なし'}</span>
            </div>
            <div class="result-item">
                <span>文字数</span>
                <span>${result.charCount}字</span>
            </div>
            <div class="result-item">
                <span>所要時間</span>
                <span>${formatTime(result.time)}</span>
            </div>
        </div>

        <h4 style="margin-top:20px;margin-bottom:10px;">提出内容</h4>
        <div class="essay-content">${result.text || '内容なし'}</div>

        <div class="ai-evaluation">
            <h4><span class="ai-badge">AI評価</span> 小論文評価レポート</h4>

            <div class="evaluation-grid">
                <div class="evaluation-item">
                    <div class="evaluation-score">${aiEval.structure}/10</div>
                    <div class="evaluation-label">構成力</div>
                </div>
                <div class="evaluation-item">
                    <div class="evaluation-score">${aiEval.logic}/10</div>
                    <div class="evaluation-label">論理性</div>
                </div>
                <div class="evaluation-item">
                    <div class="evaluation-score">${aiEval.expression}/10</div>
                    <div class="evaluation-label">表現力</div>
                </div>
                <div class="evaluation-item">
                    <div class="evaluation-score">${aiEval.originality}/10</div>
                    <div class="evaluation-label">独創性</div>
                </div>
                <div class="evaluation-item">
                    <div class="evaluation-score">${aiEval.total}/40</div>
                    <div class="evaluation-label">総合点</div>
                </div>
            </div>

            <h5 style="margin-top:15px;margin-bottom:10px;">総評</h5>
            <p style="color:#666;line-height:1.8;">${aiEval.comment}</p>

            <h5 style="margin-top:15px;margin-bottom:10px;">改善ポイント</h5>
            <ul style="color:#666;line-height:1.8;padding-left:20px;">
                ${aiEval.improvements.map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>
    `;
}

// AI分析生成（Mensaテスト用）
function generateMensaAnalysis(result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const iq = result.iq;

    let analysis = '';

    if (iq >= 130) {
        analysis = `非常に優れた論理的思考力を示しています。IQ ${iq}は上位2%に相当し、複雑なパターン認識や抽象的思考において卓越した能力があります。`;
    } else if (iq >= 115) {
        analysis = `平均以上の知的能力を示しています。IQ ${iq}は上位15%に相当し、論理的思考や問題解決において優れた能力を持っています。`;
    } else if (iq >= 100) {
        analysis = `標準的な知的能力を示しています。IQ ${iq}は平均的な範囲にあり、日常的な問題解決には十分な能力があります。`;
    } else {
        analysis = `基礎的な論理的思考力は確認できます。さらなる練習により、パターン認識能力の向上が期待できます。`;
    }

    if (percentage < 50) {
        analysis += ' 時間配分を見直し、図形問題では複数の規則性を同時に考慮することを意識してみてください。';
    }

    return analysis;
}

// AI分析生成（一般教養テスト用）
function generateKnowledgeAnalysis(result) {
    const percentage = Math.round((result.score / result.total) * 100);

    let weakCategories = [];
    let strongCategories = [];

    if (result.categoryScores) {
        for (const [category, scores] of Object.entries(result.categoryScores)) {
            const catPercent = (scores.correct / scores.total) * 100;
            if (catPercent < 50) {
                weakCategories.push(category);
            } else if (catPercent >= 80) {
                strongCategories.push(category);
            }
        }
    }

    let analysis = `正答率${percentage}%の結果でした。`;

    if (strongCategories.length > 0) {
        analysis += `${strongCategories.join('、')}の分野では優れた知識を示しています。`;
    }

    if (weakCategories.length > 0) {
        analysis += `${weakCategories.join('、')}の分野は復習が推奨されます。`;
    }

    if (percentage >= 80) {
        analysis += ' 全体的に幅広い教養を持っていることが確認できます。';
    } else if (percentage >= 60) {
        analysis += ' 基本的な一般教養は身についています。弱点分野を重点的に学習することで、さらなる向上が期待できます。';
    } else {
        analysis += ' 各分野の基礎から学習し直すことをお勧めします。新聞やニュースに日常的に触れることも効果的です。';
    }

    return analysis;
}

// AI評価生成（小論文用）
function generateEssayEvaluation(result) {
    const text = result.text || '';
    const charCount = result.charCount || text.length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const sentences = text.split(/[。！？]/).filter(s => s.trim()).length;

    // 各項目のスコア計算（簡易版）
    let structure = 5;
    let logic = 5;
    let expression = 5;
    let originality = 5;

    // 構成力評価
    if (paragraphs >= 3) structure += 2;
    if (paragraphs >= 4) structure += 1;
    if (charCount >= 800 && charCount <= 1200) structure += 2;
    else if (charCount >= 600) structure += 1;

    // 論理性評価（接続詞の使用をチェック）
    const logicWords = ['しかし', 'したがって', 'なぜなら', 'つまり', '一方', 'また', 'そのため', 'ゆえに'];
    logicWords.forEach(word => {
        if (text.includes(word)) logic += 0.5;
    });
    logic = Math.min(10, Math.round(logic));

    // 表現力評価（文の多様性）
    if (sentences >= 10) expression += 1;
    if (sentences >= 15) expression += 1;
    if (text.includes('例えば') || text.includes('具体的に')) expression += 1;
    if (charCount >= 800) expression += 1;
    expression = Math.min(10, expression);

    // 独創性評価（特定のキーワードをチェック）
    const originalWords = ['私は考える', '独自', '新しい', '提案', '解決策', '将来', '可能性'];
    originalWords.forEach(word => {
        if (text.includes(word)) originality += 0.5;
    });
    originality = Math.min(10, Math.round(originality));

    const total = structure + logic + expression + originality;

    // コメント生成
    let comment = '';
    if (total >= 32) {
        comment = '非常に優れた小論文です。論理的な構成と説得力のある論述が高く評価できます。主張が明確で、読み手を引き込む文章力があります。';
    } else if (total >= 24) {
        comment = '良好な小論文です。基本的な構成は整っており、主張も伝わります。論理的なつながりをさらに意識することで、より説得力のある文章になるでしょう。';
    } else if (total >= 16) {
        comment = '改善の余地がある小論文です。主張を明確にし、具体例を交えながら論理的に展開することを心がけてください。';
    } else {
        comment = '基礎的な部分から見直しが必要です。序論・本論・結論の構成を意識し、各段落で何を伝えたいのかを明確にしましょう。';
    }

    // 改善ポイント
    let improvements = [];
    if (structure < 7) {
        improvements.push('序論・本論・結論の三部構成を意識してみてください');
    }
    if (logic < 7) {
        improvements.push('「したがって」「なぜなら」などの接続詞を使い、論理的なつながりを明確にしましょう');
    }
    if (expression < 7) {
        improvements.push('具体例を挙げることで、主張をより分かりやすく伝えられます');
    }
    if (originality < 7) {
        improvements.push('自分自身の意見や独自の視点をより積極的に表現してみましょう');
    }
    if (charCount < 800) {
        improvements.push('文字数が少なめです。論拠を補強する内容を追加しましょう');
    }
    if (improvements.length === 0) {
        improvements.push('現状の質を維持しながら、さらに深い考察に挑戦してみてください');
    }

    return {
        structure,
        logic,
        expression,
        originality,
        total,
        comment,
        improvements
    };
}

function clearAllData() {
    if (confirm('すべてのテスト結果を削除しますか？この操作は取り消せません。')) {
        Storage.remove('testResults');
        Storage.remove('essayDraft');
        allResults = [];
        updateStats();
        filterResults();
        alert('すべてのデータを削除しました。');
    }
}

// モーダル外クリックで閉じる
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.getElementById('examineeModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeExamineeModal();
    }
});

// 受験者詳細モーダルを表示
function showExamineeDetail(key) {
    const examinee = examineesData[key];
    if (!examinee) return;

    const modal = document.getElementById('examineeModal');
    const title = document.getElementById('examineeModalTitle');
    const body = document.getElementById('examineeModalBody');

    title.textContent = examinee.name + ' の全テスト履歴';

    // 統計情報
    const latestMensa = examinee.mensa[0];
    const latestIQ = latestMensa ? latestMensa.iq : '-';

    // 最高IQ
    let maxIQ = '-';
    if (examinee.mensa.length > 0) {
        maxIQ = Math.max(...examinee.mensa.map(r => r.iq));
    }

    // 一般教養の平均正答率
    let avgKnowledge = '-';
    if (examinee.knowledge.length > 0) {
        const total = examinee.knowledge.reduce((sum, r) => sum + (r.score / r.total * 100), 0);
        avgKnowledge = Math.round(total / examinee.knowledge.length) + '%';
    }

    body.innerHTML = `
        <div class="examinee-detail-header">
            <div>
                <div class="examinee-detail-name">${examinee.name}</div>
                <div class="examinee-detail-birth">生年月日: ${examinee.birth}</div>
            </div>
            <div class="examinee-stats">
                <div class="examinee-stat-item">
                    <div class="examinee-stat-value">${latestIQ}</div>
                    <div class="examinee-stat-label">最新IQ</div>
                </div>
                <div class="examinee-stat-item">
                    <div class="examinee-stat-value">${maxIQ}</div>
                    <div class="examinee-stat-label">最高IQ</div>
                </div>
                <div class="examinee-stat-item">
                    <div class="examinee-stat-value">${avgKnowledge}</div>
                    <div class="examinee-stat-label">教養平均</div>
                </div>
                <div class="examinee-stat-item">
                    <div class="examinee-stat-value">${examinee.allResults.length}</div>
                    <div class="examinee-stat-label">総受験数</div>
                </div>
            </div>
        </div>

        ${renderTestSection('Mensa テスト', 'mensa', examinee.mensa)}
        ${renderTestSection('一般教養テスト', 'knowledge', examinee.knowledge)}
        ${renderTestSection('小論文テスト', 'essay', examinee.essay)}
    `;

    modal.classList.add('active');
}

// テストセクションをレンダリング
function renderTestSection(title, type, results) {
    if (results.length === 0) {
        return `
            <div class="test-section">
                <h4>${title} <span class="badge ${type}">未受験</span></h4>
                <p class="no-test">このテストはまだ受験していません</p>
            </div>
        `;
    }

    const historyItems = results.map((result, index) => {
        const date = new Date(result.date);
        const dateStr = date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP', {hour: '2-digit', minute: '2-digit'});

        let scoreHtml = '';
        if (type === 'mensa') {
            scoreHtml = `IQ: ${result.iq} (${result.score}/${result.total})`;
        } else if (type === 'knowledge') {
            const percentage = Math.round((result.score / result.total) * 100);
            scoreHtml = `${result.score}/${result.total} (${percentage}%)`;
        } else if (type === 'essay') {
            scoreHtml = `${result.charCount}字`;
        }

        const originalIndex = allResults.indexOf(result);

        return `
            <div class="history-item" onclick="event.stopPropagation(); showDetail(${originalIndex})">
                <div class="history-info">
                    <div class="history-type">${index === 0 ? '【最新】' : ''}${type === 'essay' && result.themeTitle ? result.themeTitle : ''}</div>
                    <div class="history-date">${dateStr} | 所要時間: ${formatTime(result.time)}</div>
                </div>
                <div class="history-score">${scoreHtml}</div>
            </div>
        `;
    }).join('');

    return `
        <div class="test-section">
            <h4>${title} <span class="badge ${type}">${results.length}回受験</span></h4>
            <div class="history-list">
                ${historyItems}
            </div>
        </div>
    `;
}

// 受験者詳細モーダルを閉じる
function closeExamineeModal() {
    document.getElementById('examineeModal').classList.remove('active');
}
