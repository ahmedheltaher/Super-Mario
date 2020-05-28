import Level from './Level.js';
import {
    createBackgroundLayer,
    createSpriteLayer
} from './layers.js';
import {
    loadBackgroundSprites
} from './sprites.js';

export var loadImage = function (url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
};

export var loadLevel = function (name) {
    return Promise.all([
            fetch(`/levels/${name}.json`)
            .then(result => result.json()),
            loadBackgroundSprites()
        ])
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
