import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Jump from '../traits/Jump.js';
import {
    loadSpriteSheet
} from "../loaders/sprite.js";
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import {
    loadAudioBoard
} from '../loaders/audio.js';

const RESISTANCE_FORCES = {
    LOW: 1 / 1000,
    HIGH: 1 / 5000
};

export var loadMario = (audioContext) => {
    return Promise.all([
        loadSpriteSheet('mario'),
        loadAudioBoard('mario', audioContext)
    ]).then(([sprite, audioBoard]) => {
        return createMarioFactory(sprite, audioBoard);
    });

};

var createMarioFactory = (sprite, audioBoard) => {
    const runAnimation = sprite.animations.get('run');

    var routeFrame = (mario) => {
        if (mario.jump.falling) {
            return 'jump';
        }
        if (mario.go.distance > 0) {
            if ((mario.vel.x > 0 && mario.go.direction < 0) || (mario.vel.x < 0 && mario.go.direction > 0)) {
                return 'break';
            }
            return runAnimation(mario.go.distance);
        }
        return 'idle';
    };

    function setTurboState(turboOn) {
        this.go.resistanceForce = turboOn ? RESISTANCE_FORCES.HIGH : RESISTANCE_FORCES.LOW;
    }

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    }
    return function createMario() {
        const mario = new Entity();
        mario.audio = audioBoard;
        mario.size.set(14, 16);
        mario.addTrait(new Solid());
        mario.addTrait(new Physics());
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Killable());
        mario.addTrait(new Stomper());
        mario.killable.removeAfter = 0;
        mario.turbo = setTurboState;
        mario.draw = drawMario;
        mario.turbo(false);
        return mario;
    };
};