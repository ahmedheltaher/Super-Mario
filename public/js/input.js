import keyboardState from './keyboardState.js';
import InputRouter from './InputRouter.js';
const USED_KEYS = {
    JUMP: 'Space',
    RUN: 'ShiftLeft',
    RIGHT: 'KeyD',
    LEFT: 'KeyA'
};

export var setupKeyboard = (window) => {
    const inputs = new keyboardState();
    const router = new InputRouter();
    inputs.listenTo(window);

    inputs.addMapping(USED_KEYS.JUMP, keyState => {
        if (keyState) {
            router.route(entity => entity.jump.start());
        } else {
            router.route(entity => entity.jump.cancel());
        }
    });
    inputs.addMapping(USED_KEYS.RUN, keyState => {
        router.route(entity => entity.turbo(keyState));
    });
    inputs.addMapping(USED_KEYS.RIGHT, keyState => {
        router.route(entity => entity.go.direction += keyState ? 1 : -1);
    });
    inputs.addMapping(USED_KEYS.LEFT, keyState => {
        router.route(entity => entity.go.direction += keyState ? -1 : 1);
    });
    return router;
};