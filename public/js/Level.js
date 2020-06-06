import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';
import EventEmitter from './EventEmitter.js';

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;
        this.events = new EventEmitter();
        this.compositor = new Compositor();
        this.entities = new Set();
        this.tileCollider = null;
        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = new TileCollider();
        this.music = new MusicController();
    }

    newEntity(entity) {
        this.entities.add(entity);
    }
    update(gameContext) {
        this.entities.forEach(entity => {
            entity.update(gameContext, this);
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        this.entities.forEach(entity => {
            entity.finalize();
        });

        this.totalTime += gameContext.deltaTime;
    }
}