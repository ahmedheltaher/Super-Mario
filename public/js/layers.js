export var createBackgroundLayer = function (level, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;
    const context = buffer.getContext('2d');
    level.tiles.forEach((tile, x, y) => {
        sprites.drawTile(tile.name, context, x, y);
    });
    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0);
    };
};

export var createSpriteLayer = function (entities) {
    return function drawSpriteLayer(context) {
        entities.forEach(entity => {
            entity.draw(context);
        });
    };
};

export var createCollisionLayer = function (level) {
    const resolvedTiles = [];
    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;
    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexAlias(x, y) {
        resolvedTiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    };
    return function drawCollisionLayer(context) {
        context.strokeStyle = '#1034A6';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
            context.stroke();
        });
        context.strokeStyle = '#800000';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
            context.stroke();
        });
        resolvedTiles.length = 0;
    };
};

