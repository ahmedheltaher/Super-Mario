export default class Vector2 {
    constructor(x, y) {
        this.set(x, y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    copy(vector) {
        this.set(vector.x, vector.y);
    }
    get() {
        return;
    }
}