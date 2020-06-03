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
} from "./layers/collision.js";
import {
    loadFont
} from './loaders/font.js';
import {
    createDashboardLayer
} from './layers/dashboard.js';

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
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext), loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    const mario = entityFactory.mario();

    const playerEnvironment = createPlaterEnvironment(mario);
    level.newEntity(playerEnvironment);

    level.compositor.newLayer(createCollisionLayer(level));
    level.compositor.newLayer(createDashboardLayer(font, playerEnvironment));

    const inputs = setupKeyboard(mario);
    inputs.listenTo(window);
    const gameContext = {
        audioContext,
        deltaTime: null
    };
    const timer = new Timer();
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        level.update(gameContext);
        camera.pos.x = Math.max(0, mario.pos.x - 100);
        level.compositor.draw(context, camera);
    };
    timer.start();
};

const canvas = document.getElementById('screen');
const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};
window.addEventListener('click', start);