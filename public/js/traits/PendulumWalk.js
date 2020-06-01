import {
    Trait,
    SIDES
} from '../Entity.js';

export default class PendulumWalk extends Trait {
    constructor() {
        super('pandlumwalk');
        this.speed = -30;

    }
    obstruct(entity, side) {
        if (side === SIDES.LEFT || side === SIDES.RIGHT) {
            this.speed = -this.speed;
        }
    }
    update(entity, deltaTime) {
        entity.vel.x = this.speed;
    }
}