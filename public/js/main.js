import Camera from './Camera.js';
import Timer from './Timer.js';
import {
    loadLevel
} from './loaders.js';
import {
    createMario
} from './entities.js';
import {
    setupKeyboard
} from './input.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
        createMario(),
        loadLevel('1-1')
    ])
    .then(([mario, level]) => {
        const camera = new Camera();
        mario.pos.set(64, 64);

        const inputs = setupKeyboard(mario);
        level.newEntity(mario);
        inputs.listenTo(window);
        const timer = new Timer();
        timer.update = function update(deltaTime) {
            level.update(deltaTime);
            if (mario.pos.x > 100) {
                camera.pos.x = mario.pos.x - 100;
            }
            level.compositor.draw(context, camera);
        };
        timer.start();
    });
