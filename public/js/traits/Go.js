import Trait from "../Trait.js";
import Jump from "./Jump.js";

export default class Go extends Trait {
    constructor() {
        super();
        this.direction = 0;
        this.distance = 0;
        this.heading = 1;
        this.acceleration = 400;
        this.deceleration = 300;
        this.resistanceForce = 1 / 5000;
    }
    update(entity, {
        deltaTime
    }) {
        const absX = Math.abs(entity.vel.x);

        if (this.direction !== 0) {
            entity.vel.x += this.acceleration * deltaTime * this.direction;

            if (entity.traits.get(Jump)) {
                if (entity.traits.get(Jump).falling === false) {
                    this.heading = this.direction;
                }
            } else {
                this.heading = this.direction;
            }

        } else if (entity.vel.x !== 0) {
            const deceleration = Math.min(absX, this.deceleration * deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -deceleration : deceleration;
        } else {
            this.distance = 0;
        }

        const drag = this.resistanceForce * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX * deltaTime;
    }
}