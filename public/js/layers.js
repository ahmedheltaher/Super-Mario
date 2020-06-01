import TileResolver from './TileResolver.js';

export var createBackgroundLayer = (level, tiles, sprites) => {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement('canvas');
    buffer.width = 256 + 16;
    buffer.height = 240;
    const context = buffer.getContext('2d');
    var redraw = (startIndex, endIndex) => {
        context.clearRect(0, 0, buffer.width, buffer.height);
        for (let x = startIndex; x <= endIndex; x++) {
            const column = tiles.grid[x];
            if (column) {
                column.forEach((tile, y) => {
                    if (sprites.animations.has(tile.name)) {
                        sprites.drawAnimation(tile.name, context, x - startIndex, y, level.totalTime);
                    } else {
                        sprites.drawTile(tile.name, context, x - startIndex, y);
                    }
                });
            }
        }
    };

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);
        context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
    };
};

export var createSpriteLayer = (entities, width = 64, height = 64) => {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');
    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);
            entity.draw(spriteBufferContext);
            context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
        });
    };
};

export var createCollisionLayer = (level) => {
    const resolvedTiles = [];
    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;
    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexAlias(x, y) {
        resolvedTiles.push({
            x,
            y
        });
        return getByIndexOriginal.call(tileResolver, x, y);
    };
    return function drawCollisionLayer(context, camera) {
        context.strokeStyle = '#1034A6';
        resolvedTiles.forEach(({
            x,
            y
        }) => {
            context.beginPath();
            context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
            context.stroke();
        });
        context.strokeStyle = '#800000';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
            context.stroke();
        });
        resolvedTiles.length = 0;
    };
};

export var creatCameraLayer = (cameraToDraw) => {
    return function drawCameraLayer(context, fromCamera) {
        context.strokeStyle = '#DA70D6';
        context.beginPath();
        context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y);
        context.stroke();
    };
};