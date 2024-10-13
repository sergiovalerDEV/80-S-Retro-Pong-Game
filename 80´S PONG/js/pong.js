// Here DOM elements are got
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const scoreBtns = document.querySelectorAll('.scoreBtn');

// Game constants
const paddleHeight = 80;
const paddleWidth = 10;
const ballSize = 8;

// Game variables
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let leftScore = 0;
let rightScore = 0;
let gameIsOver = false;
let maxScore = 5;

// Function to draw rectangles (paddles)
function drawRect(x, y, width, height) {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, width, height);
}

// Function to draw circles (ball)
function drawCircle(x, y, radius) {
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

// Net drawing
function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20);
    }
}

// Score diplay update
function updateScore() {
    scoreElement.textContent = `${leftScore} : ${rightScore}`;
}

// Game over checking
function checkGameOver() {
    if (leftScore >= maxScore || rightScore >= maxScore) {
        gameIsOver = true;
        gameOverElement.style.display = 'block';
    }
}

// Game state update
function update() {
    if (gameIsOver) return;

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    } else if (ballX > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Score points and reset ball if it goes past paddles
    if (ballX < 0) {
        rightScore++;
        ballReset();
    } else if (ballX > canvas.width) {
        leftScore++;
        ballReset();
    }

    updateScore();
    checkGameOver();
}

// Function to reset the ball to the center
function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Function to draw the game state
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawNet();
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight);
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    drawCircle(ballX, ballY, ballSize);
}

// Here the game loop is created
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listener for left paddle (mouse control)
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top - paddleHeight / 2;
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, mouseY));
});

// Event listener for right paddle (keyboard control)
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'W') {
        rightPaddleY = Math.max(0, rightPaddleY - 20);
    } else if (event.key === 's' || event.key === 'S') {
        rightPaddleY = Math.min(canvas.height - paddleHeight, rightPaddleY + 20);
    }
});

// Event listener for restart button
restartBtn.addEventListener('click', () => {
    
    leftScore = 0;
    rightScore = 0;
    gameIsOver = false;
    gameOverElement.style.display = 'none';
    ballReset();
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    updateScore();
});

// Event listeners for score selection buttons
scoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        maxScore = parseInt(btn.dataset.score);
        scoreBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        restartBtn.click();
    });
});

// Start the game
gameLoop();