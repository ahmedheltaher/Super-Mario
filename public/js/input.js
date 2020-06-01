import keyboardState from './keyboardState.js';
const USED_KEYS = {
    JUMP: 'Space',
    RUN: 'ShiftLeft',
    RIGHT: 'KeyD',
    LEFT: 'KeyA'
};
export var setupKeyboard = (mario) => {
    const inputs = new keyboardState();
    inputs.addMapping(USED_KEYS.JUMP, keyState => {
        if (keyState) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    });
    inputs.addMapping(USED_KEYS.RUN, keyState => {
        mario.turbo(keyState);
    });
    inputs.addMapping(USED_KEYS.RIGHT, keyState => {
        mario.go.direction += keyState ? 1 : -1;
    });
    inputs.addMapping(USED_KEYS.LEFT, keyState => {
        mario.go.direction += keyState ? -1 : 1;
    });
    return inputs;
};