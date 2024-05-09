
// Generate Players
function createPlayers(playersData, ctx, canvas) {
    const gameArea = BoundingBox(ctx, 0, 0, canvas.width, canvas.height);
    let playerId = Object.keys(playersData);
    let playerColor = playersData[playerId].color;

    // starting position of the player will be randomized
    let playerX = Math.floor(Math.random() * canvas.width);
    let playerY = Math.floor(Math.random() * canvas.height);
    return Player(ctx, playerX, playerY, gameArea, playerColor, playerId);
}

// Generate Items
function createItems(ctx, canvas) {
    let items = [];

    items.push(
        Item(ctx, canvas, "candy"),
        Item(ctx, canvas, "glass"),
        Item(ctx, canvas, "timer"),
        Item(ctx, canvas, "flask"),
        Item(ctx, canvas, "party"),
        Item(ctx, canvas, "cake"),
        Item(ctx, canvas, "cherry"),
        Item(ctx, canvas, "melon"),
        Item(ctx, canvas, "orange"),
        Item(ctx, canvas, "banana"),
        Item(ctx, canvas, "poo"),
        Item(ctx, canvas, "sign")
    );
    return items;
}

// Game Logic
function checkCollision(entity1, entity2) {
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1.size + entity2.size;
}

// function handleMovement() {
//     if (keys.ArrowUp) player.y -= player.speed;
//     if (keys.ArrowDown) player.y += player.speed;
//     if (keys.ArrowLeft) player.x -= player.speed;
//     if (keys.ArrowRight) player.x += player.speed;
//
//     // Ensure Blob stays within canvas bounds
//     player.x = Math.max(player.size, Math.min(gameCanvas.width - player.size, player.x));
//     player.y = Math.max(player.size, Math.min(gameCanvas.height - player.size, player.y));
// }
//
// function handleCollisions() {
//     // Blob collides with Food
//     foods = foods.filter(food => {
//         if (checkCollision(player, food)) {
//             playerScore += food.points;
//             playerScoreElement.textContent = playerScore;
//             return false;
//         }
//         return true;
//     });
//
//     // Blob collides with Items
//     items = items.filter(item => {
//         if (checkCollision(player, item)) {
//             addItemToInventory(item);
//             return false;
//         }
//         return true;
//     });
//
//     // Blob collides with Obstacles
//     obstacles = obstacles.filter(obstacle => {
//         if (checkCollision(player, obstacle)) {
//             playerScore += obstacle.points;
//             playerScoreElement.textContent = playerScore;
//             return false;
//         }
//         return true;
//     });
//
//     if (playerScore >= targetScore) {
//         endGame();
//     }
// }
//
// function addItemToInventory(item) {
//     for (let i = 0; i < inventory.length; i++) {
//         if (!inventory[i]) {
//             inventory[i] = item;
//             inventoryElements[i].textContent = item.effect;
//             break;
//         }
//     }
// }
//
// function useItem(index) {
//     const item = inventory[index];
//     if (!item) return;
//
//     switch (item.effect) {
//         case 'boost':
//             playerScore += 20;
//             playerScoreElement.textContent = playerScore;
//             break;
//         case 'disrupt':
//             // Disrupt other players (not implemented yet)
//             break;
//     }
//     inventory[index] = null;
//     inventoryElements[index].textContent = 'Empty';
// }
//
// function endGame() {
//     isGameOver = true;
//     gameOverScreen.classList.remove('hidden');
//     winnerMessage.textContent = playerScore >= targetScore ? 'You Win!' : 'Game Over!';
// }
//
// function gameLoop() {
//     if (isGameOver) return;
//
//     handleMovement();
//     handleCollisions();
//     drawAll();
//     requestAnimationFrame(gameLoop);
// }
//
// // Event Listeners
// const keys = {};
// document.addEventListener('keydown', event => {
//     keys[event.key] = true;
//     if (event.key === '1') useItem(0);
//     if (event.key === '2') useItem(1);
// });
//
// document.addEventListener('keyup', event => {
//     keys[event.key] = false;
// });
//
// restartButton.addEventListener('click', () => {
//     isGameOver = false;
//     playerScore = 0;
//     playerScoreElement.textContent = playerScore;
//     initializeObjects();
//     gameOverScreen.classList.add('hidden');
//     gameLoop();
// });
//
// // Start the Game Loop
// gameLoop();
