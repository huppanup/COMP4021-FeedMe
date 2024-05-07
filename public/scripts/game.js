const socket = io();

const gameCanvas = document.getElementById('game-area');
const ctx = gameCanvas.getContext('2d');
const playerScoreElement = document.getElementById('player-score');
const targetScoreElement = document.getElementById('target-score');
const inventoryElements = [document.getElementById('item1'), document.getElementById('item2')];
const gameOverScreen = document.getElementById('game-over');
const winnerMessage = document.getElementById('winner-message');
const restartButton = document.getElementById('restart-button');

const targetScore = 50; // Set the target score
let playerScore = 0;
let player = { x: 400, y: 300, size: 20, speed: 5 };
let foods = [];
let items = [];
let obstacles = [];
let inventory = [null, null];
let isGameOver = false;

// Initial Setup
targetScoreElement.textContent = targetScore;
playerScoreElement.textContent = playerScore;

// Generate Food
function generateFood() {
    return {
        x: Math.random() * (gameCanvas.width - 20),
        y: Math.random() * (gameCanvas.height - 20),
        size: 10,
        points: Math.random() > 0.2 ? 10 : -10
    };
}

// Generate Items
function generateItem() {
    return {
        x: Math.random() * (gameCanvas.width - 20),
        y: Math.random() * (gameCanvas.height - 20),
        size: 15,
        effect: Math.random() > 0.5 ? 'boost' : 'disrupt'
    };
}

// Generate Obstacles
function generateObstacle() {
    return {
        x: Math.random() * (gameCanvas.width - 20),
        y: Math.random() * (gameCanvas.height - 20),
        size: 20,
        points: -15
    };
}

// Initialize Objects
function initializeObjects() {
    foods = Array.from({ length: 10 }, generateFood);
    items = Array.from({ length: 5 }, generateItem);
    obstacles = Array.from({ length: 5 }, generateObstacle);
}

initializeObjects();

// Drawing Functions
function drawBlob() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawFood(food) {
    ctx.fillStyle = food.points > 0 ? 'green' : 'red';
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawItem(item) {
    ctx.fillStyle = item.effect === 'boost' ? 'gold' : 'purple';
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawObstacle(obstacle) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawAll() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBlob();
    foods.forEach(drawFood);
    items.forEach(drawItem);
    obstacles.forEach(drawObstacle);
}

// Game Logic
function checkCollision(entity1, entity2) {
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1.size + entity2.size;
}

function handleMovement() {
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;

    // Ensure Blob stays within canvas bounds
    player.x = Math.max(player.size, Math.min(gameCanvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(gameCanvas.height - player.size, player.y));
}

function handleCollisions() {
    // Blob collides with Food
    foods = foods.filter(food => {
        if (checkCollision(player, food)) {
            playerScore += food.points;
            playerScoreElement.textContent = playerScore;
            return false;
        }
        return true;
    });

    // Blob collides with Items
    items = items.filter(item => {
        if (checkCollision(player, item)) {
            addItemToInventory(item);
            return false;
        }
        return true;
    });

    // Blob collides with Obstacles
    obstacles = obstacles.filter(obstacle => {
        if (checkCollision(player, obstacle)) {
            playerScore += obstacle.points;
            playerScoreElement.textContent = playerScore;
            return false;
        }
        return true;
    });

    if (playerScore >= targetScore) {
        endGame();
    }
}

function addItemToInventory(item) {
    for (let i = 0; i < inventory.length; i++) {
        if (!inventory[i]) {
            inventory[i] = item;
            inventoryElements[i].textContent = item.effect;
            break;
        }
    }
}

function useItem(index) {
    const item = inventory[index];
    if (!item) return;

    switch (item.effect) {
        case 'boost':
            playerScore += 20;
            playerScoreElement.textContent = playerScore;
            break;
        case 'disrupt':
            // Disrupt other players (not implemented yet)
            break;
    }
    inventory[index] = null;
    inventoryElements[index].textContent = 'Empty';
}

function endGame() {
    isGameOver = true;
    gameOverScreen.classList.remove('hidden');
    winnerMessage.textContent = playerScore >= targetScore ? 'You Win!' : 'Game Over!';
}

function gameLoop() {
    if (isGameOver) return;

    handleMovement();
    handleCollisions();
    drawAll();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
const keys = {};
document.addEventListener('keydown', event => {
    keys[event.key] = true;
    if (event.key === '1') useItem(0);
    if (event.key === '2') useItem(1);
});

document.addEventListener('keyup', event => {
    keys[event.key] = false;
});

restartButton.addEventListener('click', () => {
    isGameOver = false;
    playerScore = 0;
    playerScoreElement.textContent = playerScore;
    initializeObjects();
    gameOverScreen.classList.add('hidden');
    gameLoop();
});

// Start the Game Loop
gameLoop();
