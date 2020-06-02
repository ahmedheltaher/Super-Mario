import Camera from './Camera.js';
import PlayerController from './traits/PlayerController.js';
import Entity from './Entity.js';
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


const createPlaterEnvironment = (PlayerEntity) => {
    const playerEnvironment = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(PlayerEntity);
    playerEnvironment.addTrait(playerControl);
    return playerEnvironment;
};

const main = async (canvas) => {
    const context = canvas.getContext('2d');
    const entityFactory = await loadEntities();
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    level.compositor.newLayer(createCollisionLayer(level));

    const mario = entityFactory.mario();
    const playerEnvironment = createPlaterEnvironment(mario);
    level.newEntity(playerEnvironment);
    
    const inputs = setupKeyboard(mario);
    inputs.listenTo(window);

    const timer = new Timer();
    timer.update = function update(deltaTime) {
        level.update(deltaTime);
        camera.pos.x = Math.max(0, mario.pos.x - 100);
        level.compositor.draw(context, camera);
    };
    timer.start();
};

const canvas = document.getElementById('screen');
main(canvas);