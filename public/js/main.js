import Camera from './Camera.js';
import Timer from './Timer.js';
import {
    loadLevel
} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {
    setupKeyboard
} from './input.js';

import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
        loadEntities(),
        loadLevel('1-1')
    ])
    .then(([entity, level]) => {
        const camera = new Camera();
        level.compositor.newLayer(createCollisionLayer(level));
        const mario = entity.mario();
        mario.pos.set(64, 64);
        level.newEntity(mario);

        const goomba = entity.goomba();
        goomba.pos.x = 220;
        level.newEntity(goomba);

        const Koopa = entity.koopa();
        Koopa.pos.x = 260;
        level.newEntity(Koopa);

        const inputs = setupKeyboard(mario);
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