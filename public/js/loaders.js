import SpriteSheet from './SpriteSheet.js';
import Level from './Level.js';
import {
    createBackgroundLayer,
    createSpriteLayer
} from './layers.js';
export var loadImage = (url) => {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
};

var loadJSON = (url) => {
    return fetch(url)
        .then(result => result.json());
};

var loadSpriteSheet = (name) => {
    return loadJSON(`sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL)
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileWidth, sheetSpec.tileHeight);
            sheetSpec.tiles.forEach(tileSpec => {
                sprites.registerTile(tileSpec.name, tileSpec.coordinates[0], tileSpec.coordinates[1]);
            });
            return sprites;
        });
};

export var loadLevel = (name) => {
    return loadJSON(`levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet)
        ]))
        .then(([levelSpec, backgroundSprites]) => {
            const level = new Level();
            level.initTiles(levelSpec.backgrounds);
            const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
            level.compositor.newLayer(backgroundLayer);
            const spriteLayer = createSpriteLayer(level.entities);
            level.compositor.newLayer(spriteLayer);
            return level;
        });
};
