import Compositor from './Compositor.js';
import Timer from './Timer.js';
import {
    loadLevel
} from './loaders.js';
import {
    loadBackgroundSprites
} from './sprites.js';
import {
    createMario
} from './entities.js';
import {
    createBackgroundLayer,
    createSpriteLayer
} from './layers.js';



const canvas = document.querySelector('#screen');
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
        
        const gravity = 30;
        mario.position.set(64, 180);
        mario.velocity.set(200, -600);
        
        const spriteLayer = createSpriteLayer(mario);
        compositor.newLayer(spriteLayer);
        
        const timer = new Timer(1/60);
        timer.update = function update(deltaTime) {
            compositor.draw(context);
            mario.update(deltaTime);
            mario.velocity.y += gravity;
        };
        timer.start();
    });