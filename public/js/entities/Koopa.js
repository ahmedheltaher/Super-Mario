import Entity, {
    Trait
} from '../Entity.js';
import {
    loadSpriteSheet
} from '../loaders.js';
import PendulumMove from "../traits/PendulumMove.js";
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

export var loadKoopa = () => {
    return loadSpriteSheet('koopa')
        .then(createKoopaFactory);
};

const STATES = {
    WALKING: Symbol('walking'),
    HIDING: Symbol('hiding'),
    PANIC: Symbol('panic')
};
class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.hideTime = 0;
        this.hideDuration = 5;
        this.walkSpeed = null;
        this.panicSpeed = 300;
        this.state = STATES.WALKING;
    }
    collides(us, them) {
        if (us.killable.dead) {
            return;
        }
        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
        }
    }
    handleNudge(us, them) {
        if (this.state === STATES.WALKING) {
            them.killable.kill();
        } else if (this.state === STATES.HIDING) {
            this.panic(us, them);
        } else if (this.state === STATES.PANIC) {
            const travelDirection = Math.sign(us.vel.x);
            const impactDirection = Math.sign(us.pos.x - them.pos.x);
            if (travelDirection !== 0 && travelDirection !== impactDirection) {
                them.killable.kill();
            }
        }

    }
    handleStomp(us, them) {
        if (this.state === STATES.WALKING) {
            this.hide(us);
        } else if (this.state === STATES.HIDING) {
            us.killable.kill();
            us.vel.set(100, -200);
            us.solid.obstructs = false;
        } else if (this.state === STATES.PANIC) {
            this.hide(us, them);
        }
    }
    hide(us) {
        us.vel.x = 0;
        us.pendulumMove.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.pendulumMove.speed;
        }
        this.hideTime = 0;
        this.state = STATES.HIDING;
    }
    unhide(us) {
        us.pendulumMove.enabled = true;
        us.pendulumMove.speed = this.walkSpeed;
        this.state = STATES.WALKING;
    }
    panic(us, them) {
        us.pendulumMove.enabled = true;
        us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATES.PANIC;
    }
    update(us, deltaTime) {
        if (this.state === STATES.HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

var createKoopaFactory = (sprite) => {
    const walkAnimation = sprite.animations.get('walk');
    const wakeAnimation = sprite.animations.get('wake');

    const routAnimation = (koopa) => {
        if (koopa.behavior.state === STATES.HIDING) {
            if (koopa.behavior.hideTime > 3) {
                return wakeAnimation(koopa.behavior.hideTime);
            }
            return 'hiding';
        }
        if (koopa.behavior.state === STATES.PANIC) {
            return 'hiding';
        }
        return walkAnimation(koopa.lifetime);
    };

    function drawKoopa(context) {
        sprite.draw(routAnimation(this), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new Solid());
        koopa.addTrait(new Physics());
        koopa.addTrait(new PendulumMove());
        koopa.addTrait(new Behavior());
        koopa.addTrait(new Killable());

        koopa.draw = drawKoopa;
        return koopa;
    };
};