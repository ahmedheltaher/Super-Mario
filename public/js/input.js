import keyboardState from './keyboardState.js';
const USED_KEYS = {
    JUMP: 'Space',
    RUN: 'ShiftLeft',
    RIGHT: 'KeyD',
    LEFT: 'KeyA'
};
export var setupKeyboard = (player) => {
    const inputs = new keyboardState();
    inputs.addMapping(USED_KEYS.JUMP, keyState => {
        if (keyState) {
            player.jump.start();
        } else {
            player.jump.cancel();
        }
    });
    inputs.addMapping(USED_KEYS.RUN, keyState => {
        player.turbo(keyState);
    });
    inputs.addMapping(USED_KEYS.RIGHT, keyState => {
        player.go.direction += keyState ? 1 : -1;
    });
    inputs.addMapping(USED_KEYS.LEFT, keyState => {
        player.go.direction += keyState ? -1 : 1;
    });
    return inputs;
};