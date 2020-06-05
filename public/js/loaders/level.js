import {
    Matrix
} from '../math.js';
import Level from '../Level.js';
import {
    createSpriteLayer
} from "../layers/sprites.js";
import {
    createBackgroundLayer
} from "../layers/background.js";
import {
    loadJSON
} from "../loaders.js";
import {
    loadSpriteSheet
} from "./sprite.js";
import {
    loadMusicSheet
} from './music.js';

const setupBackgrounds = (levelSpec, level, backgroundSprites) => {
    levelSpec.layers.forEach(layer => {
        const grid = createGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
        level.compositor.newLayer(backgroundLayer);
        level.tileCollider.addGrid(grid);
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
                loadSpriteSheet(levelSpec.spriteSheet),
                loadMusicSheet(levelSpec.musicSheet)
            ]))
            .then(([levelSpec, backgroundSprites, musicPlayer]) => {
                const level = new Level();
                level.music.setPlayer(musicPlayer);
                setupBackgrounds(levelSpec, level, backgroundSprites);
                setupEntities(levelSpec, level, entityFactory);

                return level;
            });
    };
};


const createGrid = (tiles, patterns) => {
    const grid = new Matrix();
    for (const {
            tile,
            x,
            y
        } of expandTiles(tiles, patterns)) {
        grid.set(x, y, tile);
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