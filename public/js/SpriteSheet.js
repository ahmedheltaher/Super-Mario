export default class SpriteSheet {
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
    }
    register(name, x, y, width, height) {
        if (this.tiles.get(name)) {
            console.error(`There is already a tile Registered With Name: ${name}`);
            return false;
        }
        const buffer = document.createElement('canvas');
        buffer.width = this.width;
        buffer.height = height;
        buffer.getContext('2d').drawImage(this.image, x, y , width, height, 0, 0, width, height);
        this.tiles.set(name, buffer);
        return true;
    }
    registerTile(name, x, y) {
        this.register(name, x * this.width, y * this.height, this.width, this.height);
    }
    draw(name, context, x, y) {
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x, y);
    }
    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
