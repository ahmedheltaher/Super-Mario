import SpriteSheet from '../SpriteSheet.js';
import {
    createAnimation
} from '../animation.js';
import {
    loadJSON,
    loadImage
} from '../loaders.js';

export var loadSpriteSheet = (name) => {
    return loadJSON(`sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageURL)
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileWidth, sheetSpec.tileHeight);
            if (sheetSpec.tiles) {
                sheetSpec.tiles.forEach(tileSpec => {
                    sprites.registerTile(tileSpec.name, ...tileSpec.coordinates);
                });
            }
            if (sheetSpec.frames) {
                sheetSpec.frames.forEach(frameSpec => {
                    sprites.register(frameSpec.name, ...frameSpec.rect);
                });
            }
            if (sheetSpec.animations) {
                sheetSpec.animations.forEach(animationSpec => {
                    const animation = createAnimation(animationSpec.frames, animationSpec.frameLength);
                    sprites.registerAnimation(animationSpec.name, animation);
                });
            }
            return sprites;
        });
};