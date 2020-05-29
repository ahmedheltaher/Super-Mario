import SpriteSheet from './SpriteSheet.js';
import { loadImage } from './loaders.js';

export var loadMarioSprite = function () {
    return loadImage('/images/character.png')
        .then(image => {
            const sprites = new SpriteSheet(image, 16, 16);
            sprites.register('idle', 276, 44, 16, 16);
            return sprites;
        });
};
