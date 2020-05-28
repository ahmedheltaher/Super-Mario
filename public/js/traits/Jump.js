import {
    Trait
} from '../Entity.js';

export default class Jump extends Trait {
    constructor() {
        super('jump');
        this.duration = 0.5;
        this.velocity = 200;
        this.engagedTime = 0;
    }
    start() {
        this.engagedTime = this.duration;
    }
    cancel() {
        this.engagedTime = 0;
    }
    update(entity, deltaTime) {
        if (this.engagedTime > 0) {
            entity.vel.y = -this.velocity;
            this.engagedTime -= deltaTime;
        }
    }
}