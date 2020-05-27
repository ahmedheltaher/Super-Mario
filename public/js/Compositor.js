export default class Compositor {
    constructor() {
        this.layers = [];
    }
    draw(context) {
        this.layers.forEach(layer => {
            layer(context);
        });
    }
    newLayer(layer) {
        this.layers.push(layer);
    }
}
