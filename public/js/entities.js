import Entity from './Entity.js';
import Go from './traits/Go.js';
import Jump from './traits/Jump.js';
import {
    loadSpriteSheet
} from './loaders.js';
import { createAnimation } from './animation.js';

const DRAG_SPEEDS = {
    SLOW: 1/1000,
    FAST:1/5000
};

export var createMario = () => {
    return loadSpriteSheet('mario')
    .then(sprite => {
        const mario = new Entity();
        mario.size.set(14, 16);
        mario.addTrait(new Go());
        mario.go.resistanceForce = DRAG_SPEEDS.SLOW;
        mario.addTrait(new Jump());
        mario.turbo = function setTurboState(turboOn) {
            this.go.resistanceForce = turboOn ? DRAG_SPEEDS.FAST : DRAG_SPEEDS.SLOW ;
        };
        const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 6);

        var routeFrame = (mario) => {
            if (mario.jump.falling) {
                return 'jump';
            }
            if (mario.go.distance > 0) {
                if ((mario.vel.x > 0 && mario.go.direction < 0 )|| (mario.vel.x < 0 && mario.go.direction > 0)) {
                    return 'break';
                }
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