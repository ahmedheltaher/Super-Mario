import Entity, {
    Trait
} from '../Entity.js';
import {
    loadSpriteSheet
} from "../loaders/sprite.js";
import Killable from '../traits/Killable.js';
import Velocity from '../traits/Velocity.js';
import Gravity from '../traits/Gravity.js';

export var loadBullet = () => {
    return loadSpriteSheet('bullet-bill')
        .then(createBulletFactory);
};


class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.gravity = new Gravity();
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.vel.set(100, -200);
            } else {
                them.killable.kill();
            }
        }
    }

    update(entity, deltaTime, level) {
        if (entity.killable.dead) {
            this.gravity.update(entity, deltaTime, level);
        }
    }
}

var createBulletFactory = (sprite) => {

    function drawBullet(context) {
        sprite.draw('bullet', context, 0, 0, this.vel.x < 0);
    }

    return function createBullet() {
        const bullet = new Entity();
        bullet.size.set(16, 14);

        bullet.addTrait(new Velocity());
        bullet.addTrait(new Behavior());
        bullet.addTrait(new Killable());

        bullet.draw = drawBullet;
        return bullet;
    };
};