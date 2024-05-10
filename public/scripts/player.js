// This function defines the Player module.
const Player = function(ctx, x, y, gameArea, playerType, playerID) {
    let score = 0;

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        green: {
            idleLeft:  { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUp:    { x: 0, y: 0, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleRight: { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDown:  { x: 0, y: 192, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUpLeft: { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUpRight: { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDownLeft:   { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDownRight:  { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 2000, loop: false },

            /* Moving sprite sequences for facing different directions */
            moveLeft:  { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUp:    { x: 0, y: 0, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveRight: { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDown:  { x: 0, y: 192, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUpLeft:  { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUpRight: { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDownLeft:  { x: 0, y: 64, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDownRight: { x: 0, y: 128, width: 32, height: 32, count: 3, timing: 150, loop: true },
        },
        blue: {
            idleLeft:  { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUp:    { x: 0, y: 320, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDown:  { x: 0, y: 512, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUpLeft: { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleUpRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDownLeft: { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 2000, loop: false },
            idleDownRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 2000, loop: false },

            /* Moving sprite sequences for facing different directions */
            moveLeft:  { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUp:    { x: 0, y: 320, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDown:  { x: 0, y: 512, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUpLeft: { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveUpRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDownLeft: { x: 0, y: 384, width: 32, height: 32, count: 3, timing: 150, loop: true },
            moveDownRight: { x: 0, y: 448, width: 32, height: 32, count: 3, timing: 150, loop: true },
        }

    };

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);
    const playerSequences = sequences[playerType];
    // The sprite object is configured for the player sprite here.
    sprite.setSequence(playerSequences.idleUp)
          .setScale(4)
          .setShadowScale({ x: 0.75, y: 0.20 })
          .useSheet("/resources/blob_sprite.png");

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;

    // This is the moving speed (pixels per second) of the player
    let speed = 250;
    const originalSpeed = speed;

    /*
    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(playerSequences.moveLeft); break;
                case 2: sprite.setSequence(playerSequences.moveUp); break;
                case 3: sprite.setSequence(playerSequences.moveRight); break;
                case 4: sprite.setSequence(playerSequences.moveDown); break;
            }
            direction = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
    const stop = function(dir) {
        if (direction == dir) {
            switch (dir) {
                case 1: sprite.setSequence(playerSequences.idleLeft); break;
                case 2: sprite.setSequence(playerSequences.idleUp); break;
                case 3: sprite.setSequence(playerSequences.idleRight); break;
                case 4: sprite.setSequence(playerSequences.idleDown); break;
            }
            direction = 0;
        }
    };

    */
   // This function sets the player's moving direction.
// - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down, 5: Up-Left, 6: Up-Right, 7: Down-Right, 8: Down-Left)
    const move = function(dir) {
        if (dir >= 1 && dir <= 8 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(playerSequences.moveLeft); break;
                case 2: sprite.setSequence(playerSequences.moveUp); break;
                case 3: sprite.setSequence(playerSequences.moveRight); break;
                case 4: sprite.setSequence(playerSequences.moveDown); break;
                case 5: sprite.setSequence(playerSequences.moveUpLeft); break;
                case 6: sprite.setSequence(playerSequences.moveUpRight); break;
                case 7: sprite.setSequence(playerSequences.moveDownLeft); break;
                case 8: sprite.setSequence(playerSequences.moveDownRight); break;
            }
            direction = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down, 5: Up-Left, 6: Up-Right, 7: Down-Right, 8: Down-Left)
    const stop = function(dir) {
        if (direction == dir) {
            switch (dir) {
                case 1: sprite.setSequence(playerSequences.idleLeft); break;
                case 2: sprite.setSequence(playerSequences.idleUp); break;
                case 3: sprite.setSequence(playerSequences.idleRight); break;
                case 4: sprite.setSequence(playerSequences.idleDown); break;
                case 5: sprite.setSequence(playerSequences.idleUpLeft); break;
                case 6: sprite.setSequence(playerSequences.idleUpRight); break;
                case 7: sprite.setSequence(playerSequences.idleDownleft); break;
                case 8: sprite.setSequence(playerSequences.idleDownRight); break;
            }
            direction = 0;
        }
};
    // This function speeds up the player.
    const speedUp = function() {
        speed *= 2;
    };

    // This function slows down the player.
    const slowDown = function() {
        speed *= 0.5;
    };

    const normalSpeed = function() {
        speed = originalSpeed;
    }

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(now, canvas) {
    /* Update the player if the player is moving */
        if (direction != 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
                case 5: x -= speed / 60; y -= speed / 60;break;
                case 6: x += speed / 60; y -= speed / 60; break;
                case 7: x -= speed / 60; y += speed / 60; break;
                case 8: x+= speed / 60; y += speed / 60; break;
            }

            if (x < 32) {
                x = 32;
            }
            if (x > canvas.width - 32) {
                x = canvas.width - 32;
            }
            if (y < 32) {
                y = 32;
            }
            if (y > canvas.height - 32) {
                y = canvas.height - 32;
            }
            sprite.setXY(x, y);


        /* Update the sprite object */
        sprite.update(now);
    };

    const getX = function() {
        return sprite.getXY().x;
    };

    const getY = function() {
        return sprite.getXY().y;
    }

    const getScore = function(){
        return score;
    }

    const updateScore = function(newScore) {
        score += newScore;
    }

    const getSpeed = function(){
        return speed;
    }

    // The methods are returned as an object here.
    return {
        playerID: playerID,
        move: move,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        getX: getX,
        getY: getY,
        update: update,
        getScore: getScore,
        updateScore: updateScore,
        normalSpeed: normalSpeed,
        getSpeed: getSpeed
    };
};