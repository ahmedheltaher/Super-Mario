import {
    Matrix
} from '../math.js';
import Level from '../Level.js';
import { createSpriteLayer } from "../layers/sprites.js";
import {
    createBackgroundLayer
} from "../layers/background.js";
import {
    loadJSON,
    loadSpriteSheet
} from "../loaders.js";

const setupCollision = (levelSpec, level) => {
    const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);
    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
    level.setCollisionGird(collisionGrid);
};


const setupBackgrounds = (levelSpec, level, backgroundSprites) => {
    levelSpec.layers.forEach(layer => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
        level.compositor.newLayer(backgroundLayer);
    });
};

const setupEntities = (levelSpec, level, entityFactory) => {
    levelSpec.entities.forEach(({
        name,
        pos: [x, y]
    }) => {
        const entity = entityFactory[name]();
        entity.pos.set(x, y);
        level.newEntity(entity);
    });
    const spriteLayer = createSpriteLayer(level.entities);
    level.compositor.newLayer(spriteLayer);
};
export const createLevelLoader = (entityFactory) => {
    return function loadLevel(name) {
        return loadJSON(`levels/${name}.json`)
            .then(levelSpec => Promise.all([
                levelSpec,
                loadSpriteSheet(levelSpec.spriteSheet)
            ]))
            .then(([levelSpec, backgroundSprites]) => {
                const level = new Level();

                setupCollision(levelSpec, level);
                setupBackgrounds(levelSpec, level, backgroundSprites);
                setupEntities(levelSpec, level, entityFactory);

                return level;
            });
    };
};


const createCollisionGrid = (tiles, patterns) => {
    const grid = new Matrix();
    for (const {
            tile,
            x,
            y
        } of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            type: tile.type
        });
    }
    return grid;
};

const createBackgroundGrid = (tiles, patterns) => {
    const grid = new Matrix();
    for (const {
            tile,
            x,
            y
        } of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            name: tile.name
        });
    }
    return grid;
};

function* expandSpan(xStart, xLength, yStart, yLength) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {
                x,
                y
            };
        }
    }
}

const expandRange = (range) => {
    if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range;
        return expandSpan(xStart, xLength, yStart, yLength);
    } else if (range.length === 3) {
        const [xStart, xLength, yStart] = range;
        return expandSpan(xStart, xLength, yStart, 1);
    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
};

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles(tiles, patterns) {
    function* walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const {
                    x,
                    y
                } of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;
                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY
                    };
                }
            }
        }
    }
    yield* walkTiles(tiles, 0, 0);
}