import Entity, {
    SIDES
} from '../Entity.js';
import {
    loadSpriteSheet
} from '../loaders.js';
import PendulumWalk from "../traits/PendulumWalk.js";

export var loadKoopa = () => {
    return loadSpriteSheet('koopa')
        .then(createKoopaFactory);
};

var createKoopaFactory = (sprite) => {
    const walkAnimation = sprite.animations.get('walk');

    function drawKoopa(context) {
        sprite.draw(walkAnimation(this.lifetime), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new PendulumWalk());

        koopa.draw = drawKoopa;
        return koopa;
    };
};