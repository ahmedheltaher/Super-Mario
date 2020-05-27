import SpriteSheet from './SpriteSheet.js';
import { loadImage } from './loaders.js';

export var loadBackgroundSprites = function () {
    return loadImage('/images/tiles.png')
        .then(image => {
            const sprites = new SpriteSheet(image, 16, 16);
            sprites.registerTile('ground', 0, 0);
            sprites.registerTile('sky', 3, 23);
            return sprites;
        });
};
export var loadMarioSprite = function () {
    return loadImage('/images/character.png')
        .then(image => {
            const sprites = new SpriteSheet(image, 16, 16);
            sprites.register('idle', 276, 44, 16, 16);
            return sprites;
        });
};
