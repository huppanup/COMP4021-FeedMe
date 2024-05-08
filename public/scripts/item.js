// Define the `Item` object
const Item = function (ctx, gameArea, item) {
    // Create a sprite object using the Sprite module
    const sprite = Sprite(ctx, 0, 0);

    let angle = 0;
    let opacity = 1;

    // Define the sprite sheet sequences for different items
    const sequences = {
        candy: { x: 0, y: 0, width: 32, height: 32, count: 4, timing: 150, loop: true },
        glass: { x: 0, y: 32, width: 32, height: 32, count: 4, timing: 150, loop: true },
        timer: { x: 0, y: 64, width: 32, height: 32, count: 4, timing: 150, loop: true },
        flake: { x: 0, y: 96, width: 32, height: 32, count: 4, timing: 150, loop: true },
    };

    // Initialize the sprite object with the sprite sheet
    sprite.useSheet("/resources/item_sprites.png")
        .setSequence(sequences[item])
        .setScale(5);

    // Function to set the item sequence
    const setItem = function (item) {
        sprite.setSequence(sequences[item]);
    };

    // Function to randomize the item sequence
    const randomizeItem = function () {
        const itemKeys = Object.keys(sequences);
        const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        setItem(randomKey);
    };

    // Function to randomize the position of the item
    const randomize = function (area) {
        console.log(area.width, area.height)
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
        console.log(x, y)

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
            opacity -= 0.01;    // Decrease the opacity when the item is near the boundary
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

    // Return the methods and properties as an object
    return {
        draw: draw,
        update: sprite.update,
        move: move,
        getAngle: getAngle,
        setItem: setItem,
        randomize: randomize
    };
};
