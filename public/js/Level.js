import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import {
    Matrix
} from './math.js';


export default class Level {
    constructor() {
        this.compositor = new Compositor();
        this.entities = new Set();
        this.tiles = new Matrix();
        this.gravity = 2000;

        this.tileCollider = new TileCollider(this.tiles);
    }
    newEntity(entity) {
        this.entities.add(entity);
    }
    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
            entity.pos.x += entity.vel.x * deltaTime;
            this.tileCollider.checkX(entity);
            entity.pos.y += entity.vel.y * deltaTime;
            this.tileCollider.checkY(entity);
            entity.vel.y += this.gravity * deltaTime;
        });
    }
    initTiles(backgrounds) {
        backgrounds.forEach(background => {
            background.ranges.forEach(([x1, x2, y1, y2]) => {
                for (let x = x1; x < x2; ++x) {
                    for (let y = y1; y < y2; ++y) {
                        this.tiles.set(x, y, {
                            name: background.tile
                        });
                    }
                }
            });
        });
    }
}
