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
    makePlayer,
    findPlayers
} from './player.js';
import SceneRunner from './SceneRunner.js';
import {
    createPlayerProgressLayer
} from './layers/player-progress.js';
import TimedScene from './TimedScene.js';
import {
    createColorLayer
} from './layers/color.js';
import Level from './Level.js';
import Scene from './Scene.js';
import {
    createTextLayer
} from './layers/text.js';

const main = async (canvas) => {
    const videoContext = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext), loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    const mario = entityFactory.mario();
    makePlayer(mario, 'MARIO');

    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);
    window.mario = mario;
    const runLevel = async (name) => {

        const loadScreen = new Scene();
        loadScreen.compositor.newLayer(createColorLayer('#000'));
        loadScreen.compositor.newLayer(createTextLayer(font, `Loading ${name}...`));
        sceneRunner.newScene(loadScreen);
        sceneRunner.runNext();

        const level = await loadLevel(name);
        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
            if (spec.type === "goto") {
                for (const _ of findPlayers(touches)) {
                    runLevel(spec.name);
                    return;
                }
            }
        });

        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, level);
        mario.pos.set(0, 0);

        level.newEntity(mario);

        const playerEnvironment = createPlayerEnvironment(mario);
        level.newEntity(playerEnvironment);

        const waitScreen = new TimedScene();
        waitScreen.compositor.newLayer(createColorLayer('#000'));
        waitScreen.compositor.newLayer(dashboardLayer);
        waitScreen.compositor.newLayer(playerProgressLayer);
        sceneRunner.newScene(waitScreen);


        level.compositor.newLayer(createCollisionLayer(level));
        level.compositor.newLayer(dashboardLayer);

        sceneRunner.newScene(level);
        sceneRunner.runNext();

    };

    const gameContext = {
        audioContext,
        videoContext,
        entityFactory,
        deltaTime: null
    };
    const timer = new Timer();
    timer.update = function update(deltaTime) {
        gameContext.deltaTime = deltaTime;
        sceneRunner.update(gameContext);
    };
    timer.start();
    runLevel('1-1');
    window.runLevel = runLevel;
};

const canvas = document.getElementById('screen');
const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};
window.addEventListener('click', start);