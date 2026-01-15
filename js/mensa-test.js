// Mensaタイプテスト（高難度版）

// 問題データ
const mensaQuestions = [
    // 図形パターン認識問題（10問）- 高難度
    {
        type: 'pattern',
        question: '複数の規則性を見つけ、?に入る図形を選んでください。',
        pattern: [
            { shape: 'circle', color: '#3498db', size: 'small', filled: true },
            { shape: 'square', color: '#e74c3c', size: 'medium', filled: false },
            { shape: 'triangle', color: '#2ecc71', size: 'large', filled: true },
            { shape: 'circle', color: '#e74c3c', size: 'medium', filled: false },
            { shape: 'square', color: '#2ecc71', size: 'large', filled: true },
            { shape: 'triangle', color: '#3498db', size: 'small', filled: false },
            { shape: 'circle', color: '#2ecc71', size: 'large', filled: true },
            { shape: 'square', color: '#3498db', size: 'small', filled: false },
            null
        ],
        options: [
            { shape: 'triangle', color: '#e74c3c', size: 'medium', filled: true },
            { shape: 'triangle', color: '#e74c3c', size: 'large', filled: false },
            { shape: 'circle', color: '#e74c3c', size: 'medium', filled: true },
            { shape: 'triangle', color: '#3498db', size: 'medium', filled: true }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '行と列の両方の規則性を考慮して、?に入る図形を選んでください。',
        pattern: [
            { shape: 'circle', innerShape: 'dot', color: '#9b59b6' },
            { shape: 'square', innerShape: 'cross', color: '#9b59b6' },
            { shape: 'triangle', innerShape: 'none', color: '#9b59b6' },
            { shape: 'square', innerShape: 'none', color: '#1abc9c' },
            { shape: 'triangle', innerShape: 'dot', color: '#1abc9c' },
            { shape: 'circle', innerShape: 'cross', color: '#1abc9c' },
            { shape: 'triangle', innerShape: 'cross', color: '#e67e22' },
            { shape: 'circle', innerShape: 'none', color: '#e67e22' },
            null
        ],
        options: [
            { shape: 'square', innerShape: 'dot', color: '#e67e22' },
            { shape: 'square', innerShape: 'cross', color: '#e67e22' },
            { shape: 'triangle', innerShape: 'dot', color: '#e67e22' },
            { shape: 'circle', innerShape: 'dot', color: '#e67e22' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '回転と色の変化の規則性を見つけてください。',
        pattern: [
            { shape: 'arrow', color: '#3498db', direction: 'up' },
            { shape: 'arrow', color: '#e74c3c', direction: 'right' },
            { shape: 'arrow', color: '#2ecc71', direction: 'down' },
            { shape: 'arrow', color: '#f39c12', direction: 'left' },
            { shape: 'arrow', color: '#e74c3c', direction: 'up' },
            { shape: 'arrow', color: '#2ecc71', direction: 'right' },
            { shape: 'arrow', color: '#f39c12', direction: 'down' },
            { shape: 'arrow', color: '#3498db', direction: 'left' },
            null
        ],
        options: [
            { shape: 'arrow', color: '#2ecc71', direction: 'up' },
            { shape: 'arrow', color: '#3498db', direction: 'up' },
            { shape: 'arrow', color: '#2ecc71', direction: 'right' },
            { shape: 'arrow', color: '#f39c12', direction: 'up' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '図形の数と種類の変化パターンを見つけてください。',
        pattern: [
            { shapes: ['circle'], color: '#3498db' },
            { shapes: ['circle', 'square'], color: '#3498db' },
            { shapes: ['circle', 'square', 'triangle'], color: '#3498db' },
            { shapes: ['square'], color: '#e74c3c' },
            { shapes: ['square', 'triangle'], color: '#e74c3c' },
            { shapes: ['square', 'triangle', 'circle'], color: '#e74c3c' },
            { shapes: ['triangle'], color: '#2ecc71' },
            { shapes: ['triangle', 'circle'], color: '#2ecc71' },
            null
        ],
        options: [
            { shapes: ['triangle', 'circle', 'square'], color: '#2ecc71' },
            { shapes: ['triangle', 'square', 'circle'], color: '#2ecc71' },
            { shapes: ['circle', 'triangle', 'square'], color: '#2ecc71' },
            { shapes: ['triangle', 'circle'], color: '#2ecc71' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '対角線上の規則性も考慮してください。',
        pattern: [
            { shape: 'hexagon', color: '#9b59b6', size: 'large' },
            { shape: 'pentagon', color: '#3498db', size: 'medium' },
            { shape: 'diamond', color: '#e74c3c', size: 'small' },
            { shape: 'pentagon', color: '#e74c3c', size: 'large' },
            { shape: 'diamond', color: '#9b59b6', size: 'medium' },
            { shape: 'hexagon', color: '#3498db', size: 'small' },
            { shape: 'diamond', color: '#3498db', size: 'large' },
            { shape: 'hexagon', color: '#e74c3c', size: 'medium' },
            null
        ],
        options: [
            { shape: 'pentagon', color: '#9b59b6', size: 'small' },
            { shape: 'pentagon', color: '#3498db', size: 'small' },
            { shape: 'hexagon', color: '#9b59b6', size: 'small' },
            { shape: 'diamond', color: '#9b59b6', size: 'small' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '塗りつぶしパターンと形状の両方の規則を見つけてください。',
        pattern: [
            { shape: 'circle', color: '#3498db', filled: true, size: 'small' },
            { shape: 'circle', color: '#3498db', filled: false, size: 'medium' },
            { shape: 'circle', color: '#3498db', filled: true, size: 'large' },
            { shape: 'square', color: '#e74c3c', filled: false, size: 'small' },
            { shape: 'square', color: '#e74c3c', filled: true, size: 'medium' },
            { shape: 'square', color: '#e74c3c', filled: false, size: 'large' },
            { shape: 'triangle', color: '#2ecc71', filled: true, size: 'small' },
            { shape: 'triangle', color: '#2ecc71', filled: false, size: 'medium' },
            null
        ],
        options: [
            { shape: 'triangle', color: '#2ecc71', filled: true, size: 'large' },
            { shape: 'triangle', color: '#2ecc71', filled: false, size: 'large' },
            { shape: 'circle', color: '#2ecc71', filled: true, size: 'large' },
            { shape: 'triangle', color: '#3498db', filled: true, size: 'large' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '星の頂点数と色の複合規則を見つけてください。',
        pattern: [
            { shape: 'star', color: '#f1c40f', points: 4 },
            { shape: 'star', color: '#e74c3c', points: 5 },
            { shape: 'star', color: '#3498db', points: 6 },
            { shape: 'star', color: '#e74c3c', points: 4 },
            { shape: 'star', color: '#3498db', points: 5 },
            { shape: 'star', color: '#f1c40f', points: 6 },
            { shape: 'star', color: '#3498db', points: 4 },
            { shape: 'star', color: '#f1c40f', points: 5 },
            null
        ],
        options: [
            { shape: 'star', color: '#e74c3c', points: 6 },
            { shape: 'star', color: '#3498db', points: 6 },
            { shape: 'star', color: '#f1c40f', points: 6 },
            { shape: 'star', color: '#e74c3c', points: 5 }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '内部記号と外枠の組み合わせ規則を見つけてください。',
        pattern: [
            { shape: 'square', innerShape: 'dot', color: '#9b59b6', filled: false },
            { shape: 'circle', innerShape: 'cross', color: '#1abc9c', filled: true },
            { shape: 'triangle', innerShape: 'none', color: '#e67e22', filled: false },
            { shape: 'circle', innerShape: 'none', color: '#9b59b6', filled: true },
            { shape: 'triangle', innerShape: 'dot', color: '#1abc9c', filled: false },
            { shape: 'square', innerShape: 'cross', color: '#e67e22', filled: true },
            { shape: 'triangle', innerShape: 'cross', color: '#9b59b6', filled: true },
            { shape: 'square', innerShape: 'none', color: '#1abc9c', filled: false },
            null
        ],
        options: [
            { shape: 'circle', innerShape: 'dot', color: '#e67e22', filled: true },
            { shape: 'circle', innerShape: 'dot', color: '#e67e22', filled: false },
            { shape: 'circle', innerShape: 'cross', color: '#e67e22', filled: true },
            { shape: 'square', innerShape: 'dot', color: '#e67e22', filled: true }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '向きと形の両方が変化するパターンを解読してください。',
        pattern: [
            { shape: 'rectangle', color: '#3498db', orientation: 'horizontal' },
            { shape: 'rectangle', color: '#3498db', orientation: 'vertical' },
            { shape: 'arrow', color: '#3498db', direction: 'up' },
            { shape: 'rectangle', color: '#e74c3c', orientation: 'vertical' },
            { shape: 'arrow', color: '#e74c3c', direction: 'up' },
            { shape: 'rectangle', color: '#e74c3c', orientation: 'horizontal' },
            { shape: 'arrow', color: '#2ecc71', direction: 'up' },
            { shape: 'rectangle', color: '#2ecc71', orientation: 'horizontal' },
            null
        ],
        options: [
            { shape: 'rectangle', color: '#2ecc71', orientation: 'vertical' },
            { shape: 'arrow', color: '#2ecc71', direction: 'right' },
            { shape: 'rectangle', color: '#2ecc71', orientation: 'horizontal' },
            { shape: 'arrow', color: '#2ecc71', direction: 'down' }
        ],
        answer: 0
    },
    {
        type: 'pattern',
        question: '3つの異なる規則が同時に適用されています。?を見つけてください。',
        pattern: [
            { shape: 'circle', color: '#9b59b6', size: 'small', innerShape: 'none' },
            { shape: 'square', color: '#1abc9c', size: 'medium', innerShape: 'dot' },
            { shape: 'triangle', color: '#e67e22', size: 'large', innerShape: 'cross' },
            { shape: 'square', color: '#e67e22', size: 'small', innerShape: 'dot' },
            { shape: 'triangle', color: '#9b59b6', size: 'medium', innerShape: 'cross' },
            { shape: 'circle', color: '#1abc9c', size: 'large', innerShape: 'none' },
            { shape: 'triangle', color: '#1abc9c', size: 'small', innerShape: 'cross' },
            { shape: 'circle', color: '#e67e22', size: 'medium', innerShape: 'none' },
            null
        ],
        options: [
            { shape: 'square', color: '#9b59b6', size: 'large', innerShape: 'dot' },
            { shape: 'square', color: '#9b59b6', size: 'medium', innerShape: 'dot' },
            { shape: 'triangle', color: '#9b59b6', size: 'large', innerShape: 'cross' },
            { shape: 'circle', color: '#9b59b6', size: 'large', innerShape: 'none' }
        ],
        answer: 0
    },

    // 数列問題（5問）- 高難度
    {
        type: 'sequence',
        question: '次の数列の規則性を見つけ、?に入る数字を選んでください。',
        sequence: [1, 4, 10, 22, 46, '?'],
        options: ['94', '92', '88', '96'],
        answer: 0
    },
    {
        type: 'sequence',
        question: '次の数列の規則性を見つけ、?に入る数字を選んでください。',
        sequence: [1, 2, 6, 24, 120, '?'],
        options: ['720', '600', '240', '840'],
        answer: 0
    },
    {
        type: 'sequence',
        question: '次の数列の規則性を見つけ、?に入る数字を選んでください。',
        sequence: [3, 7, 15, 31, 63, '?'],
        options: ['127', '125', '126', '124'],
        answer: 0
    },
    {
        type: 'sequence',
        question: '次の数列の規則性を見つけ、?に入る数字を選んでください。',
        sequence: [1, 1, 2, 3, 5, 8, 13, 21, 34, '?'],
        options: ['55', '54', '56', '53'],
        answer: 0
    },
    {
        type: 'sequence',
        question: '次の数列の規則性を見つけ、?に入る数字を選んでください。',
        sequence: [2, 6, 14, 30, 62, '?'],
        options: ['126', '124', '128', '130'],
        answer: 0
    },

    // 確率問題（5問）- 高難度
    {
        type: 'logic',
        question: 'サイコロを2回振ったとき、出た目の合計が7になる確率は？',
        options: [
            '1/6',
            '1/12',
            '1/9',
            '1/8'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '52枚のトランプから2枚を引くとき、2枚ともエースである確率は？',
        options: [
            '1/221',
            '1/169',
            '1/52',
            '1/13'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '赤玉3個、白玉5個の袋から2個を同時に取り出すとき、両方とも赤玉である確率は？',
        options: [
            '3/28',
            '9/64',
            '3/8',
            '1/8'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: 'コインを5回投げたとき、ちょうど3回表が出る確率は？',
        options: [
            '5/16',
            '1/4',
            '3/8',
            '1/2'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '3人でジャンケンを1回したとき、1人だけが勝つ確率は？',
        options: [
            '1/3',
            '1/9',
            '1/4',
            '1/2'
        ],
        answer: 0
    },

    // 論理パズル問題（10問）- 高難度
    {
        type: 'logic',
        question: 'A、B、C、D、Eの5人が一列に並んでいます。AはCの隣にいない。BはDの右側にいる。CはEの左側にいる。AはBの隣にいる。左から2番目にいるのは誰？',
        options: [
            'A',
            'B',
            'C',
            'D'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '3人の容疑者A、B、Cがいます。犯人は1人だけで、犯人は嘘をつき、無実の人は真実を言います。A「Bが犯人だ」B「私は無実だ」C「Aは嘘をついている」。犯人は誰？',
        options: [
            'B',
            'A',
            'C',
            '判断できない'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '4つの箱があり、それぞれ赤、青、緑、黄色です。各箱には異なる動物（猫、犬、鳥、魚）が入っています。猫は赤い箱にいない。犬は青か緑の箱にいる。鳥は黄色い箱にいない。魚は赤い箱にいる。犬は何色の箱にいる？',
        options: [
            '青か緑（情報不足）',
            '青',
            '緑',
            '黄色'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '「すべてのXはYである」「あるYはZである」「すべてのZはWである」が真のとき、必ず正しいと言えるのは？',
        options: [
            'あるYはWである',
            'すべてのXはWである',
            'すべてのYはZである',
            'あるXはZである'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '3つのスイッチA、B、Cがあり、それぞれが1つの電球を制御しています。AがONのとき電球1は点灯。BがONのときAの効果が反転。CがONのときBの効果が反転。B=ON、C=ON、A=ONのとき、電球1は？',
        options: [
            '点灯している',
            '消灯している',
            'どちらとも言えない',
            '情報が不足'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: 'ある島には、常に真実を言う人と常に嘘を言う人だけがいます。島民Aに「あなたは嘘つきですか？」と聞くと「はい」と答えました。これについて正しいのは？',
        options: [
            'この状況は論理的に矛盾している',
            'Aは正直者である',
            'Aは嘘つきである',
            '判断できない'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '甲、乙、丙の3人がテストを受けた。「甲の点数 > 乙の点数」「乙の点数 + 丙の点数 = 甲の点数」「3人の合計点は100点」のとき、甲の点数は？',
        options: [
            '50点',
            '40点',
            '60点',
            '判断できない'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: 'A→B、B→C、C→Dが真のとき、¬D（Dでない）から確実に導けるのは？',
        options: [
            '¬A（Aでない）',
            '¬B（Bでない）だけ',
            '¬C（Cでない）だけ',
            '何も導けない'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '5枚のカードがあり、表に1,2,3,4,5、裏にA,B,C,D,Eが書かれている（対応は不明）。「偶数の裏は母音」が成り立つか確認するため、最低限めくるべきカードは？',
        options: [
            '2と4とBとD',
            '2と4だけ',
            '1と3と5だけ',
            'すべてのカード'
        ],
        answer: 0
    },
    {
        type: 'logic',
        question: '12個の同じ見た目のボールがあり、1つだけ重さが異なる（重いか軽いか不明）。天秤を3回だけ使って、異なるボールを特定し、それが重いか軽いか判定できるか？',
        options: [
            '可能である',
            '特定はできるが重い軽いは判定できない',
            '3回では不可能',
            '4回必要'
        ],
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
    answers = new Array(mensaQuestions.length).fill(null);

    document.getElementById('totalQuestions').textContent = mensaQuestions.length;

    // タイマー開始（30分）
    timer = new Timer(30 * 60, updateTimer, timeUp);
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
    const question = mensaQuestions[index];
    const container = document.getElementById('questionContainer');

    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('progressBar').style.width = ((index + 1) / mensaQuestions.length * 100) + '%';

    let html = `
        <div class="question-number">問題 ${index + 1}</div>
        <div class="question-text">${question.question}</div>
    `;

    if (question.type === 'pattern') {
        html += renderPatternQuestion(question);
    } else if (question.type === 'sequence') {
        html += renderSequenceQuestion(question);
    } else if (question.type === 'logic') {
        html += renderLogicQuestion(question);
    }

    container.innerHTML = html;

    // ナビゲーションボタン更新
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index < mensaQuestions.length - 1 ? 'block' : 'none';
    document.getElementById('submitBtn').style.display = index === mensaQuestions.length - 1 ? 'block' : 'none';
}

function renderPatternQuestion(question) {
    let html = '<div class="pattern-grid">';

    question.pattern.forEach((cell, i) => {
        if (cell === null) {
            html += '<div class="pattern-cell question-mark">?</div>';
        } else {
            html += `<div class="pattern-cell">${renderShape(cell)}</div>`;
        }
    });

    html += '</div>';
    html += '<div class="option-grid">';

    question.options.forEach((option, i) => {
        const selected = answers[currentQuestion] === i ? 'selected' : '';
        html += `<div class="option-cell ${selected}" onclick="selectAnswer(${i})">${renderShape(option)}</div>`;
    });

    html += '</div>';
    return html;
}

function renderShape(data) {
    const size = data.size === 'small' ? 25 : (data.size === 'large' ? 50 : 35);
    const rotation = data.rotation || 0;
    const filled = data.filled !== false;

    let svg = `<svg width="60" height="60" viewBox="0 0 60 60" style="transform: rotate(${rotation}deg)">`;

    switch (data.shape) {
        case 'circle':
            if (filled) {
                svg += `<circle cx="30" cy="30" r="${size/2}" fill="${data.color}"/>`;
            } else {
                svg += `<circle cx="30" cy="30" r="${size/2}" fill="none" stroke="${data.color}" stroke-width="3"/>`;
            }
            break;
        case 'square':
            const s = size;
            if (filled) {
                svg += `<rect x="${30-s/2}" y="${30-s/2}" width="${s}" height="${s}" fill="${data.color}"/>`;
            } else {
                svg += `<rect x="${30-s/2}" y="${30-s/2}" width="${s}" height="${s}" fill="none" stroke="${data.color}" stroke-width="3"/>`;
            }
            break;
        case 'triangle':
            const h = size * 0.866;
            if (filled) {
                svg += `<polygon points="30,${30-h/2} ${30-size/2},${30+h/2} ${30+size/2},${30+h/2}" fill="${data.color}"/>`;
            } else {
                svg += `<polygon points="30,${30-h/2} ${30-size/2},${30+h/2} ${30+size/2},${30+h/2}" fill="none" stroke="${data.color}" stroke-width="3"/>`;
            }
            break;
        case 'diamond':
            if (filled) {
                svg += `<polygon points="30,${30-size/2} ${30+size/2},30 30,${30+size/2} ${30-size/2},30" fill="${data.color}"/>`;
            } else {
                svg += `<polygon points="30,${30-size/2} ${30+size/2},30 30,${30+size/2} ${30-size/2},30" fill="none" stroke="${data.color}" stroke-width="3"/>`;
            }
            break;
        case 'pentagon':
            svg += `<polygon points="30,10 48,24 42,46 18,46 12,24" fill="${data.color}"/>`;
            break;
        case 'hexagon':
            svg += `<polygon points="30,10 48,20 48,40 30,50 12,40 12,20" fill="${data.color}"/>`;
            break;
        case 'rectangle':
            if (data.orientation === 'horizontal') {
                svg += `<rect x="10" y="22" width="40" height="16" fill="${data.color}"/>`;
            } else {
                svg += `<rect x="22" y="10" width="16" height="40" fill="${data.color}"/>`;
            }
            break;
        case 'arrow':
            const arrows = {
                up: 'M30,10 L45,35 L37,35 L37,50 L23,50 L23,35 L15,35 Z',
                right: 'M50,30 L25,45 L25,37 L10,37 L10,23 L25,23 L25,15 Z',
                down: 'M30,50 L15,25 L23,25 L23,10 L37,10 L37,25 L45,25 Z',
                left: 'M10,30 L35,15 L35,23 L50,23 L50,37 L35,37 L35,45 Z'
            };
            svg += `<path d="${arrows[data.direction]}" fill="${data.color}"/>`;
            break;
        case 'star':
            const points = data.points || 5;
            let starPath = '';
            for (let i = 0; i < points * 2; i++) {
                const r = i % 2 === 0 ? 20 : 10;
                const angle = (i * Math.PI / points) - Math.PI / 2;
                const x = 30 + r * Math.cos(angle);
                const y = 30 + r * Math.sin(angle);
                starPath += (i === 0 ? 'M' : 'L') + x + ',' + y;
            }
            starPath += 'Z';
            svg += `<path d="${starPath}" fill="${data.color}"/>`;
            break;
    }

    // 内側の形状
    if (data.innerShape === 'dot') {
        svg += `<circle cx="30" cy="30" r="5" fill="#333"/>`;
    } else if (data.innerShape === 'cross') {
        svg += `<line x1="22" y1="22" x2="38" y2="38" stroke="#333" stroke-width="3"/>`;
        svg += `<line x1="38" y1="22" x2="22" y2="38" stroke="#333" stroke-width="3"/>`;
    }

    // 複数の形状
    if (data.shapes) {
        const count = data.shapes.length;
        data.shapes.forEach((shape, i) => {
            const offsetX = count === 1 ? 30 : (count === 2 ? (i === 0 ? 20 : 40) : (i * 20 + 10));
            if (shape === 'circle') {
                svg += `<circle cx="${offsetX}" cy="30" r="8" fill="${data.color}"/>`;
            } else if (shape === 'square') {
                svg += `<rect x="${offsetX-6}" y="24" width="12" height="12" fill="${data.color}"/>`;
            } else if (shape === 'triangle') {
                svg += `<polygon points="${offsetX},22 ${offsetX-7},38 ${offsetX+7},38" fill="${data.color}"/>`;
            }
        });
    }

    svg += '</svg>';
    return svg;
}

function renderSequenceQuestion(question) {
    let html = '<div class="sequence-display" style="text-align:center;margin:30px 0;">';
    html += '<div style="font-size:2rem;font-weight:bold;letter-spacing:15px;color:#333;">';
    html += question.sequence.join('  →  ');
    html += '</div></div>';

    html += '<div class="options">';
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

    return html;
}

function renderLogicQuestion(question) {
    let html = '<div class="options">';
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
    return html;
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
    if (currentQuestion < mensaQuestions.length - 1) {
        showQuestion(currentQuestion + 1);
    }
}

function submitTest() {
    timer.stop();

    const elapsedTime = Math.round((Date.now() - testStartTime) / 1000);
    let score = 0;

    answers.forEach((answer, i) => {
        if (answer === mensaQuestions[i].answer) {
            score++;
        }
    });

    const total = mensaQuestions.length;
    const avgScore = total * 0.4; // 高難度のため平均正答率40%と仮定
    const iq = calculateIQ(score, total, avgScore);

    // 受験者情報を取得
    const examinee = Storage.load('currentExaminee') || {};

    // 結果を保存
    const result = {
        type: 'mensa',
        examineeName: examinee.name || '未登録',
        examineeBirth: examinee.birthDate || '未登録',
        score: score,
        total: total,
        iq: iq,
        date: new Date().toISOString(),
        time: elapsedTime
    };

    const results = Storage.load('testResults') || [];
    results.push(result);
    Storage.save('testResults', results);

    // 受験者の完了テストを更新
    if (examinee.name) {
        if (!examinee.completedTests) examinee.completedTests = [];
        if (!examinee.completedTests.includes('mensa')) {
            examinee.completedTests.push('mensa');
        }
        Storage.save('currentExaminee', examinee);
    }

    // 結果を表示
    const container = document.querySelector('.test-container');
    showResultWithNext(container, score, total, {
        time: timer.formatTime(elapsedTime),
        iq: iq
    });
}

function showResultWithNext(container, score, total, details) {
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
            <button class="nav-btn submit" onclick="location.href='../index.html'">次のテストへ進む</button>
        </div>
    `;
}
