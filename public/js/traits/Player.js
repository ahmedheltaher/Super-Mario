import {
    Trait
} from '../Entity.js';
import Stomper from './Stomper.js';

const COIN_LIFE_THRESHOLD = 100;

export default class Player extends Trait {
    constructor() {
        super('player');
        this.name = 'UNNAMED';
        this.coins = 0;
        this.lives = 3;
        this.score = 0;

        this.listen(Stomper.EVENT_STOMP, () => {
            this.score += 100;
        });
    }
    addCoins(count = 1) {
        this.coins += count;
        this.queue(entity => entity.sounds.add('coin'));
        while (this.coins >= COIN_LIFE_THRESHOLD) {
            this.addLives();
            this.coins -= COIN_LIFE_THRESHOLD;
        }
    }
    addLives(count = 1) {
        this.lives += count;
    }
}