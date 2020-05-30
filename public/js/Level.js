import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import {
    Matrix
} from './math.js';


export default class Level {
    constructor() {
        this.gravity = 2000;
        this.totalTime = 0;
        this.compositor = new Compositor();
        this.entities = new Set();
        this.tiles = new Matrix();
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
        this.totalTime += deltaTime;
    }
    initTiles(backgrounds) {
        function applyRange(level, background, xStart, xLength, yStart, yLength) {
            const xEnd = xStart + xLength;
            const yEnd = yStart + yLength;
            for (let x = xStart; x < xEnd; x++) {
                for (let y = yStart; y < yEnd; y++) {
                    level.tiles.set(x, y, {
                        name: background.tile,
                        type: background.type,
                    });
                }
            }
        }
        backgrounds.forEach(background => {
            background.ranges.forEach(range => {
                if (range.length === 4) {
                    const [xStart, xLength, yStart, yLength] = range;
                    applyRange(this, background, xStart, xLength, yStart, yLength);
                } else if (range.length === 3) {
                    const [xStart, xLength, yStart] = range;
                    applyRange(this, background, xStart, xLength, yStart, 1);
                } else if (range.length === 2) {
                    const [xStart, yStart] = range;
                    applyRange(this, background, xStart, 1, yStart, 1);
                }
            });
        });
    }
}
