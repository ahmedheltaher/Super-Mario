import keyboardState from './keyboardState.js';
const USED_KEYS = {
    SPACE: 'Space',
    RIGHT: 'KeyD',
    LEFT: 'KeyA'
};
export var setupKeyboard = function (entity) {
    const inputs = new keyboardState();
    inputs.addMapping(USED_KEYS.SPACE, keyState => {
        if (keyState) {
            entity.jump.start();
        } else {
            entity.jump.cancel();
        }
    });
    inputs.addMapping(USED_KEYS.RIGHT, keyState => {
        entity.go.direction = keyState;
    });
    inputs.addMapping(USED_KEYS.LEFT, keyState => {
        entity.go.direction = -keyState;
    });
    return inputs;
};
