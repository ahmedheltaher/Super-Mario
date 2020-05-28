import Compositor from './Compositor.js';
import Timer from './Timer.js';
import {
    loadLevel
} from './loaders.js';
import {
    createMario
} from './entities.js';
import {
    loadBackgroundSprites
} from './sprites.js';
import {
    createBackgroundLayer,
    createSpriteLayer
} from './layers.js';

import keyboardState from './keyboardState.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
        createMario(),
        loadBackgroundSprites(),
        loadLevel('1-1')
    ])
    .then(([mario, backgroundSprites, level]) => {
        const compositor = new Compositor();

        const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
        compositor.newLayer(backgroundLayer);

        const gravity = 2000;
        mario.pos.set(64, 180);
        
        const SPACE = 32;
        const inputs = new keyboardState();
        inputs.addMapping(SPACE, keyState => {
            if (keyState) {
                mario.jump.start();
            } else {
                mario.jump.cancel();
            }
            console.log(keyState);
        });
        inputs.listenTo(window);

        const spriteLayer = createSpriteLayer(mario);
        compositor.newLayer(spriteLayer);

        const timer = new Timer(1 / 60);
        timer.update = function update(deltaTime) {
            mario.update(deltaTime);
            compositor.draw(context);
            mario.vel.y += gravity * deltaTime;
        };
        timer.start();
    });
