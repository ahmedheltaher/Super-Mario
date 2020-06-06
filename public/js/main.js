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
} from "./layers/collision.js";
import {
    loadFont
} from './loaders/font.js';
import {
    createDashboardLayer
} from './layers/dashboard.js';
import {
    createPlayerEnvironment,
    createPlayer
} from './player.js';

const main = async (canvas) => {
    const context = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext), loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
    const mario = createPlayer(entityFactory.mario());

    const playerEnvironment = createPlayerEnvironment(mario);
    level.newEntity(playerEnvironment);

    level.compositor.newLayer(createCollisionLayer(level));
    level.compositor.newLayer(createDashboardLayer(font, playerEnvironment));

    const inputs = setupKeyboard(mario);
    inputs.listenTo(window);
    const gameContext = {
        entityFactory,
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
    level.music.player.playTrack('main');
};

const canvas = document.getElementById('screen');
const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};
window.addEventListener('click', start);