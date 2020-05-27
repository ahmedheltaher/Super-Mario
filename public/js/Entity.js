import { Vector2 } from "./math.js";
export default class Entity {
    constructor() {
        this.position = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
    }
}
