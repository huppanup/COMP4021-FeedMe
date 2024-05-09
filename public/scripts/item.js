// Define the `Item` object
const Item = function (ctx, gameArea, item) {
    // Create a sprite object using the Sprite module
    const itemSprite = Sprite(ctx, 0, 0);
    const foodSprite = Sprite(ctx, 0, 0);

    let angle = 0;
    let opacity = 1;

    // Define the sprite sheet sequences for different items
    const sequences = {
        //Item For cheating
        candy: { x: 0, y: 0, width: 32, height: 32, count: 4, timing: 150, loop: true, score: 0 },
        glass: { x: 0, y: 32, width: 32, height: 32, count: 4, timing: 150, loop: true, score: 0 },
        timer: { x: 0, y: 64, width: 32, height: 32, count: 4, timing: 150, loop: true, score: 0 },
        flake: { x: 0, y: 96, width: 32, height: 32, count: 4, timing: 150, loop: true, score: 0 },
        party: { x: 0, y: 128, width: 32, height: 32, count: 4, timing: 150, loop: true, score: 0 },

        // Fruits with positive score
        cake: { x: 0, y: 132.5, width: 34, height: 32, count: 1, timing: 150, loop: true, score: 100 },
        cherry: { x: 66.7, y: 63, width: 34, height: 32, count: 1, timing: 150, loop: true, score: 50},
        melon: { x: 299.7, y: 0, width: 32.7, height: 32, count: 1, timing: 150, loop: true, score: 30 },
        orange: { x: 102, y: 164.5, width: 34, height: 32, count: 1, timing: 150, loop: true, score: 40 },
        banana: { x: 33.3, y: 164.5, width: 34, height: 32, count: 1, timing: 150, loop: true, score: 10 },

        // Fruits with negative score
        poo: { x: 34, y: 33.7, width: 34, height: 32, count: 1, timing: 150, loop: true, score: -100 },
        sign: { x: 34, y: 33.5, width: 34, height: 32, count: 1, timing: 150, loop: true, score: -50 },
    };

    // Initialize the sprite object with the sprite sheet
    itemSprite.useSheet("/resources/item_sprites.png")
        .setSequence(sequences[item]);
        //.setScale(2);

    foodSprite.useSheet("/resources/fruit_sprites.png")
        .setSequence(sequences[item]);
        //.setScale(2);

    // Set the active sprite
    let sprite = itemSprite;

    const items = ['candy', 'glass', 'timer', 'flake', 'party'];
    const foods = ['cake', 'cherry', 'melon', 'orange', 'banana', 'poo', 'sign'];

    // Function to set the item sequence
    const setItem = function (item) {
        if (items.includes(item)) {
            sprite = itemSprite;
        } else if (foods.includes(item)) {
            sprite = foodSprite;
        }
        sprite.setSequence(sequences[item]);

        if (item === 'flake' || item === 'timer') {
            sprite.setScale(3); // Set the scale to the desired value
        } else if (item === 'glass') {
            sprite.setScale(4); // Reset the scale for other items
        } else {
            sprite.setScale(2); // Reset the scale for other items
        }

    };

    // Function to set the item sequence
    // const setItem = function (item) {
    //     sprite.setSequence(sequences[item]);
    // };

    // Function to randomize the item sequence
    const randomizeItem = function () {
        const itemKeys = Object.keys(sequences);
        const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        setItem(randomKey);
    };

    // Function to randomize the position of the item
    const randomize = function (area) {
        //console.log(area.width, area.height)
        // Randomize the starting point (boundary)
        const boundary = Math.floor(Math.random() * 4);
        let x, y;

        switch (boundary) {
            case 0: // Left boundary
                x = 32;
                y = Math.floor(Math.random() * (area.height - 32)) + 32;
                angle = Math.random() * Math.PI - Math.PI / 2; // Move towards the right
                break;
            case 1: // Top boundary
                x = Math.floor(Math.random() * (area.width - 32)) + 32;
                y = 32;
                angle = Math.random() * Math.PI + Math.PI; // Move downwards
                break;
            case 2: // Right boundary
                x = area.width - 32;
                y = Math.floor(Math.random() * (area.height - 32)) + 32;
                angle = Math.random() * Math.PI + Math.PI / 2; // Move towards the left
                break;
            case 3: // Bottom boundary
                x = Math.floor(Math.random() * (area.width - 32)) + 32;
                y = area.height - 32;
                angle = Math.random() * Math.PI; // Move upwards
                break;
        }
        //console.log(x, y)

        // Randomize the item sequence
        randomizeItem();
        sprite.setXY(x, y);

    };

    const getAngle = function(){
        return angle;
    }

    // Function to move the item
    const move = function (time, angle){
        // Generate a random speed for the item
        const minSpeed = 1; // minimum speed
        const maxSpeed = 4; // maximum speed
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

        sprite.setXY(sprite.getXY().x + Math.cos(angle) * speed, sprite.getXY().y + Math.sin(angle) * speed);

        // check X and Y values to see if they are out of bounds
        if(sprite.getXY().x < 32 || sprite.getXY().x > gameArea.width - 32 || sprite.getXY().y < 32 || sprite.getXY().y > gameArea.height - 32){
            opacity -= 0.005;    // Decrease the opacity when the item is near the boundary
            if (opacity <= 0) {
                randomize(gameArea);
                opacity = 1;    // Reset the opacity when the item is repositioned
            }
        }

    };

    // Initialize the item with a random position
    randomize(gameArea);

    // Method to draw the item
    const draw = function(){
        ctx.globalAlpha = opacity;
        sprite.draw();
        ctx.globalAlpha = 1;
    };

    const getX = function(){
        return sprite.getXY().x;
    };

    const getY = function(){
        return sprite.getXY().y;
    };

    const getScore = function() {
        if (sequences[item] && sequences[item].score !== undefined) {
            return sequences[item].score;
        } else {
            return 0;
        }
        //return sequences[item].score;
    }

    // Return the methods and properties as an object
    return {
        draw: draw,
        update: sprite.update,
        move: move,
        getAngle: getAngle,
        setItem: setItem,
        randomize: randomize,
        getX: getX,
        getY: getY,
        getScore: getScore,
        sprite: function () {
            return sprite;
        }
    };
};