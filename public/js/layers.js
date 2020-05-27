var drawBackground = function (background, context, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; x++) {
            for (let y = y1; y < y2; y++) {
                sprites.drawTile(background.tile, context, x, y);
            }
        }
    });
};

export var createBackgroundLayer = function (backgrounds, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;
    backgrounds.forEach(background => {
        drawBackground(background, buffer.getContext('2d'), sprites);
    });
    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0);
    };
};

export var createSpriteLayer = function (entity) {
    return function drawSpriteLayer(context) {
        if (typeof entity.draw === 'undefined') {
            console.error(`This Entity Dose not Have a Drawing Method You should attache method to him or there is a problem in this entity's drawing method`);
        } else {
            entity.draw(context);
        }
    };
};
