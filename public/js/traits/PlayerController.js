import Trait from "../Trait.js";
import Vector2 from "../math/Vector.js";
import Killable from "./Killable.js";

export default class PlayerController extends Trait {
    constructor() {
        super();
        this.checkpoint = new Vector2(0, 0);
        this.player = null;
    }
    setPlayer(entity) {
        this.player = entity;
    }
    update(entity, {
        deltaTime
    }, level) {
        if (!level.entities.has(this.player)) {
            this.player.traits.get(Killable).revive();
            this.player.pos.copy(this.checkpoint);
            level.entities.add(this.player);
        }
    }
}