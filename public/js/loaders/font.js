import { loadImage } from "../loaders.js";
import SpriteSheet from "../SpriteSheet.js";

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
    constructor(sprites, size) {
        this.sprites = sprites;
        this.size = size;
    }
    print(text, context, x, y) {
        [...text].forEach((char, pos) => {
            this.sprites.draw(char, context, x + pos * this.size, y);
        });
    }
}

export const loadFont = () =>  {
    return loadImage('./images/font.png')
    .then(image => {
        const fontSprite = new SpriteSheet(image);
        const size = 8;
        const rowLength = image.width;
        for (let [index, char] of [...CHARS].entries()) {
            const x = index * size % rowLength;
            const y = Math.floor(index * size / rowLength) * size;
            console.log(index, char, x, y);
            fontSprite.register(char, x, y, size, size);
        }
        return new Font(fontSprite, size);
    });
};