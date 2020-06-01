import Camera from './Camera.js';
import Timer from './Timer.js';
import {
    createLevelLoader
} from './loaders/level.js';
import {
    loadEntities
} from './entities.js';
import {
    setupKeyboard
} from './input.js';

import {
    createCollisionLayer
} from "./layers.js";

const main = async (canvas) => {
    const context = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    level.compositor.newLayer(createCollisionLayer(level));
    const mario = entityFactory.mario();
    mario.pos.set(64, 64);
    level.newEntity(mario);

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
};

const canvas = document.getElementById('screen');
main(canvas);