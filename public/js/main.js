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
import SceneRunner from './SceneRunner.js';
import {
    createPlayerProgressLayer
} from './layers/player-progress.js';
import CompositionScene from './CompositionScene.js';
import {
    createColorLayer
} from './layers/color.js';
import Level from './Level.js';

const main = async (canvas) => {
    const videoContext = canvas.getContext('2d');
    const audioContext = new AudioContext();

    const [entityFactory, font] = await Promise.all([
        loadEntities(audioContext), loadFont()
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const sceneRunner = new SceneRunner();

    const mario = createPlayer(entityFactory.mario());
    mario.player.name = 'MARIO';
    const inputRouter = setupKeyboard(window);
    inputRouter.addReceiver(mario);



    const runLevel = async (name) => {
        const level = await loadLevel(name);
        level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
            if (spec.type === "goto") {
                for (const entity of touches) {
                    if (entity.player) {
                        runLevel(spec.name);
                        return;
                    }
                }
            }
        });

        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, level);
        mario.pos.set(0, 0);

        level.newEntity(mario);

        const playerEnvironment = createPlayerEnvironment(mario);
        level.newEntity(playerEnvironment);

        const waitScreen = new CompositionScene();
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
    runLevel('debug-progression');
    window.runLevel = runLevel;
};

const canvas = document.getElementById('screen');
const start = () => {
    window.removeEventListener('click', start);
    main(canvas);
};
window.addEventListener('click', start);