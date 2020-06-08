import {
    SIDES
} from '../Entity.js';
import Trait from "../Trait.js";

export default class Solid extends Trait {
    constructor() {
        super();
        this.obstructs = true;
    }
    obstruct(entity, side, match) {
        if (!this.obstructs) {
            return;
        }
        if (side === SIDES.BOTTOM) {
            entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
        } else if (side === SIDES.TOP) {
            entity.bounds.top = match.y2;
            entity.vel.y = 0;
        } else if (side === SIDES.RIGHT) {
            entity.bounds.right = match.x1;
            entity.vel.x = 0;
        } else if (side === SIDES.LEFT) {
            entity.bounds.left = match.x2;
            entity.vel.x = 0;
        }
    }
}