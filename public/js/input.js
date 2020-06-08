import keyboardState from './keyboardState.js';
import InputRouter from './InputRouter.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';
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
            router.route(entity => entity.traits.get(Jump).start());
        } else {
            router.route(entity => entity.traits.get(Jump).cancel());
        }
    });
    inputs.addMapping(USED_KEYS.RUN, keyState => {
        router.route(entity => entity.turbo(keyState));
    });
    inputs.addMapping(USED_KEYS.RIGHT, keyState => {
        router.route(entity => entity.traits.get(Go).direction += keyState ? 1 : -1);
    });
    inputs.addMapping(USED_KEYS.LEFT, keyState => {
        router.route(entity => entity.traits.get(Go).direction += keyState ? -1 : 1);
    });
    return router;
};