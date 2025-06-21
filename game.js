// 2048 Game Logic and UI
const boardSize = 4;
let board = [];
let score = 0;
let highscore = 0;

const boardElem = document.getElementById('board');
const highscoreElem = document.getElementById('highscore');
const gameOverElem = document.getElementById('game-over');

function getHighscore() {
    return parseInt(localStorage.getItem('2048-highscore') || '0', 10);
}
function setHighscore(val) {
    localStorage.setItem('2048-highscore', val);
}

function updateHighscore() {
    highscore = getHighscore();
    if (score > highscore) {
        highscore = score;
        setHighscore(highscore);
    }
    highscoreElem.textContent = `Highscore: ${highscore}`;
}

function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    addRandomTile();
    addRandomTile();
    updateBoard();
    updateHighscore();
    gameOverElem.style.display = 'none';
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    boardElem.innerHTML = '';
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const val = board[r][c];
            const tile = document.createElement('div');
            tile.className = 'tile' + (val ? ` tile-${val}` : '');
            tile.textContent = val ? val : '';
            boardElem.appendChild(tile);
        }
    }
}

function transpose(mat) {
    return mat[0].map((_, i) => mat.map(row => row[i]));
}
function reverseRows(mat) {
    return mat.map(row => row.slice().reverse());
}

function slide(row) {
    let arr = row.filter(x => x);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(x => x);
    while (arr.length < boardSize) arr.push(0);
    return arr;
}

function move(dir) {
    let old = JSON.stringify(board);
    let moved = false;
    if (dir === 'left') {
        for (let r = 0; r < boardSize; r++) {
            let newRow = slide(board[r]);
            if (board[r].join() !== newRow.join()) moved = true;
            board[r] = newRow;
        }
    } else if (dir === 'right') {
        for (let r = 0; r < boardSize; r++) {
            let newRow = slide(board[r].slice().reverse()).reverse();
            if (board[r].join() !== newRow.join()) moved = true;
            board[r] = newRow;
        }
    } else if (dir === 'up') {
        board = transpose(board);
        for (let r = 0; r < boardSize; r++) {
            let newRow = slide(board[r]);
            if (board[r].join() !== newRow.join()) moved = true;
            board[r] = newRow;
        }
        board = transpose(board);
    } else if (dir === 'down') {
        board = transpose(board);
        for (let r = 0; r < boardSize; r++) {
            let newRow = slide(board[r].slice().reverse()).reverse();
            if (board[r].join() !== newRow.join()) moved = true;
            board[r] = newRow;
        }
        board = transpose(board);
    }
    if (moved) {
        addRandomTile();
        updateBoard();
        updateHighscore();
        if (isGameOver()) showGameOver();
    }
}

function isGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) return false;
            if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

function showGameOver() {
    gameOverElem.style.display = 'block';
}

document.addEventListener('keydown', e => {
    if (gameOverElem.style.display === 'block') return;
    if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
    else if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
});

document.getElementById('restart-btn').onclick = initBoard;

window.onload = () => {
    updateHighscore();
    initBoard();
};
