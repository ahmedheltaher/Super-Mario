import Entity from './Entity.js';
import Go from './traits/Go.js';
import Jump from './traits/Jump.js';
import {
    loadSpriteSheet
} from './loaders.js';
import { createAnimation } from './animation.js';

export var createMario = () => {
    return loadSpriteSheet('mario')
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14, 16);
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 10);

        var routeFrame = (mario) => {
            if (mario.go.direction !== 0) {
                return runAnimation(mario.go.distance);
            }
            return 'idle';
        };

        mario.draw = function drawMario(context) {
            sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
        };
        return mario;
    });
};