import {
    Trait
} from '../Entity.js';
import { Vector2 } from '../math.js';

export default class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vector2(0, 0);
        this.player = null;
        this.time = 300;
        this.score = 0;
    }
    setPlayer(entity) {
        this.player = entity;
        this.player.stomper.onStomp = () => {
            this.score += 100;
        };
    }
    update(entity, deltaTime, level) {
        if (!level.entities.has(this.player)) {
            this.player.killable.revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        } else {
            this.time -= deltaTime * 2;
        }
    }
}