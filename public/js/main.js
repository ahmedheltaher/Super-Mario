import Compositor from './Compositor.js';
import {
    loadLevel
} from './loaders.js';
import {
    loadMarioSprite,
    loadBackgroundSprites
} from './sprites.js';
import { createBackgroundLayer } from './layers.js';



const canvas = document.querySelector('#screen');
const context = canvas.getContext('2d');

var createSpriteLayer = function(sprite, position) {
    return function drawSpriteLayer(context) {
        for (let i = 0; i < 20; i++) {
            sprite.draw('idle', context, position.x + i * 16, position.y);

        }
    };
};

Promise.all([
        loadMarioSprite(),
        loadBackgroundSprites(),
        loadLevel('1-1')
    ])
    .then(([marioSprite, backgroundSprites, level]) => {
        const compositor = new Compositor();
        const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
        compositor.addLayer(backgroundLayer);
        const position = {
            x: 64,
            y: 64
        };
        const spriteLayer = createSpriteLayer(marioSprite, position);
        compositor.addLayer(spriteLayer);
        var update = function() {
            compositor.draw(context);
            position.x += 2;
            position.y += 2;
            requestAnimationFrame(update);
        };
        update();
    });