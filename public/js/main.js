import Camera from './Camera.js';
import Timer from './Timer.js';
import {
    loadLevel
} from './loaders.js';
import {
    createMario
} from './entities.js';
import { createCollisionLayer, creatCameraLayer } from "./layers.js";
import { setupKeyboard } from './input.js';
import { setupMouseControl } from './debug.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
        createMario(),
        loadLevel('1-1')
    ])
    .then(([mario, level]) => {
        const camera = new Camera();
        mario.pos.set(64, 64);
        level.compositor.newLayer(createCollisionLayer(level));
        level.compositor.newLayer(creatCameraLayer(camera));
        const inputs = setupKeyboard(mario);
        level.newEntity(mario);
        setupMouseControl(canvas, mario, camera);
        inputs.listenTo(window);
        const timer = new Timer();
        timer.update = function update(deltaTime) {
            level.update(deltaTime);
            level.compositor.draw(context, camera);
        };
        timer.start();
    });
