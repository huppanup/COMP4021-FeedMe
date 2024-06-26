
// Generate Players
function createPlayers(playersData, currentPlayer, ctx, canvas) {
    const gameArea = BoundingBox(ctx, 0, 0, canvas.width, canvas.height);
    let playersId = Object.keys(playersData);

    console.log("currentPlayer: ", currentPlayer)

    for (let i = 0; i < playersId.length; i++) {
        if (playersId[i] === currentPlayer.id) {
            let playerId = playersId[i];
            let playerColor = playersData[playerId].color;
            console.log("playerColor: ", playerColor)

            // starting position of the player will be randomized
            let playerX = Math.floor(Math.random() * canvas.width);
            let playerY = Math.floor(Math.random() * canvas.height);
            return Player(ctx, playerX, playerY, gameArea, playerColor, playerId);
        }
    }
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
    const dx = entity1.getX() - entity2.getX();
    const dy = entity1.getY() - entity2.getY();
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 64
}
// Check if cheatMode is on
let cheatMode = false; 

function checkCheat(){
    if (cheatMode) {
        // cheat mode
        console.log("Cheat mode activated");
    } else {
        // normal mode
        console.log("Normal mode");
    }
    return cheatMode; 
}

function handleKeyDownUp(player) {
    // Keep track of keys currently pressed down
    let keysDown = {};

    // Add keydown event listener
    $(document).on("keydown", function (event) {
        // Add key to keysDown object if it's an arrow key
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keysDown[event.keyCode] = true;
        }

        // Check for diagonal movement
        if (keysDown[37] && keysDown[38]) { // Up-Left
            player.move(5);
        } else if (keysDown[38] && keysDown[39]) { // Up-Right
            player.move(6);
        } else if (keysDown[39] && keysDown[40]) { // Down-Right
            player.move(8);
        } else if (keysDown[40] && keysDown[37]) { // Down-Left
            player.move(7);
        } else {
            // Handle non-diagonal movement
            switch (event.keyCode) {
                case 37: // Left
                    player.move(1);
                    break;
                case 38: // Up
                    player.move(2);
                    break;
                case 39: // Right
                    player.move(3);
                    break;
                case 40: // Down
                    player.move(4);
                    break;
                // case 16: // Shift
                //     cheatMode = true;
                //     player.speedUp();
                //     break;
            }
        }
    });

    // Add keyup event listener
    $(document).on("keyup", function(event) {
        // Remove key from keysDown object if it's an arrow key
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            delete keysDown[event.keyCode];
        }

        // Check for diagonal movement
        if (keysDown[37] && keysDown[38]) { // Up-Left
            player.move(5);
        } else if (keysDown[38] && keysDown[39]) { // Up-Right
            player.move(6);
        } else if (keysDown[39] && keysDown[40]) { // Down-Right
            player.move(7);
        } else if (keysDown[40] && keysDown[37]) { // Down-Left
            player.move(8);
        } else {
            // Handle non-diagonal movement
            switch (event.keyCode) {
                case 37: // Left
                    if (!keysDown[37]) player.stop(1);
                    if (keysDown[38]) player.move(2);
                    if (keysDown[40]) player.move(4);
                    break;
                case 38: // Up
                    if (!keysDown[38]) player.stop(2);
                    if (keysDown[37]) player.move(1);
                    if (keysDown[39]) player.move(3);
                    break;
                case 39: // Right
                    if (!keysDown[39]) player.stop(3);
                    if (keysDown[38]) player.move(2);
                    if (keysDown[40]) player.move(4);
                    break;å
                case 40: // Down
                    if (!keysDown[40]) player.stop(4);
                    if (keysDown[37]) player.move(1);
                    if (keysDown[39]) player.move(3);
                    break;
                case 16: // Shift
                    cheatMode = false; 
                    player.slowDown(); 
                    break; 
            }
        }
    });
}