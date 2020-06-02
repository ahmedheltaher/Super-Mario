import {
    Vector2
} from "./math.js";
import BoundingBox from './BoundingBox.js';

export const SIDES = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
};
export class Trait {
    constructor(name) {
        this.NAME = name;
    }
    collides(us, them) {}
    obstruct() {}
    update() {}
}

export default class Entity {
    constructor() {
        this.canCollide = true;
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
        this.size = new Vector2(0, 0);
        this.offset = new Vector2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }
    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }
    obstruct(side) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }
    collides(candidate) {        
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        }); 
    }
    draw(){}
    update(deltaTime, level) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });
        this.lifetime += deltaTime;
    }
}