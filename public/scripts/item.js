// Define the `Item` object
const Item = function (ctx, gameArea, item) {
    // Create a sprite object using the Sprite module
    const sprite = Sprite(ctx, 0, 0);

    // Define the sprite sheet sequences for different items
    const sequences = {
        candy: { x: 0, y: 0, width: 5, height: 4, count: 4, timing: 150, loop: true },
        glass: { x: 0, y: 4, width: 5, height: 4, count: 4, timing: 150, loop: true },
        timer: { x: 0, y: 8, width: 5, height: 4, count: 4, timing: 150, loop: true },
        flake: { x: 0, y: 12, width: 5, height: 4, count: 4, timing: 150, loop: true },
    };

    // Initialize the sprite object with the sprite sheet
    sprite.useSheet("/resources/item_sprites.png")
        .setSequence(sequences[item])
        .setScale(0.5);

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
        // Randomize the starting point (boundary)
        const boundary = Math.floor(Math.random() * 4);
        let x, y, angle;

        switch (boundary) {
            case 0: // Left boundary
                x = 0;
                y = Math.floor(Math.random() * area.height);
                angle = Math.random() * Math.PI - Math.PI / 2; // Move towards the right
                break;
            case 1: // Top boundary
                x = Math.floor(Math.random() * area.width);
                y = 0;
                angle = Math.random() * Math.PI + Math.PI; // Move downwards
                break;
            case 2: // Right boundary
                x = area.width - 1;
                y = Math.floor(Math.random() * area.height);
                angle = Math.random() * Math.PI + Math.PI / 2; // Move towards the left
                break;
            case 3: // Bottom boundary
                x = Math.floor(Math.random() * area.width);
                y = area.height - 1;
                angle = Math.random() * Math.PI; // Move upwards
                break;
        }

        // Set a random speed between 2 and 4
        const speed = 2 + Math.random() * 2;

        // Compute velocity based on angle and speed
        const velocityX = speed * Math.cos(angle);
        const velocityY = speed * Math.sin(angle);

        // Update the item's position
        const updatePosition = function (item) {
            item.x += velocityX;
            item.y += velocityY;

            // If the item moves out of bounds, reset its position
            if (item.x < 0 || item.x > area.width || item.y < 0 || item.y > area.height) {
                randomize(area);
            }

            // Update the sprite's position
            sprite.setXY(item.x, item.y);
        };

        // Randomize the item sequence
        randomizeItem();
        sprite.setXY(x, y);

        // Start moving the item
        sprite.update = function () {
            updatePosition(sprite);
        };
    };

    // Initialize the item with a random position
    randomize(gameArea);

    // Method to update the item
    const update = function () {
        sprite.update();
    };

    // Return the methods and properties as an object
    return {
        draw: sprite.draw,
        update: update,
        setItem: setItem,
        randomize: randomize
    };
};
