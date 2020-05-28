import Timer from './Timer.js';
import {
    loadLevel
} from './loaders.js';
import {
    createMario
} from './entities.js';
import { createCollisionLayer } from "./layers.js";
import {setupKeyboard} from './input.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
        createMario(),
        loadLevel('1-1')
    ])
    .then(([mario, level]) => {
        mario.pos.set(64, 64);
        level.compositor.newLayer(createCollisionLayer(level));
        const inputs = setupKeyboard(mario);
        level.newEntity(mario);
        inputs.listenTo(window);
        const timer = new Timer(1 / 60);
        timer.update = function update(deltaTime) {
            level.update(deltaTime);
            level.compositor.draw(context);
        };
        timer.start();
    });
