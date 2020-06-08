import Entity from '../Entity.js';
import Trait from "../Trait.js";
import {
    loadSpriteSheet
} from "../loaders/sprite.js";
import PendulumMove from "../traits/PendulumMove.js";
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import Stomper from '../traits/Stomper.js';

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
        super();
        this.hideTime = 0;
        this.hideDuration = 5;
        this.walkSpeed = null;
        this.panicSpeed = 300;
        this.state = STATES.WALKING;
    }
    collides(us, them) {
        if (us.traits.get(Killable).dead) {
            return;
        }
        if (them.traits.has(Stomper)) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
        }
    }
    handleNudge(us, them) {
        if (this.state === STATES.WALKING) {
            them.traits.get(Killable).kill();
        } else if (this.state === STATES.HIDING) {
            this.panic(us, them);
        } else if (this.state === STATES.PANIC) {
            const travelDirection = Math.sign(us.vel.x);
            const impactDirection = Math.sign(us.pos.x - them.pos.x);
            if (travelDirection !== 0 && travelDirection !== impactDirection) {
                them.traits.get(Killable).kill();
            }
        }

    }
    handleStomp(us, them) {
        if (this.state === STATES.WALKING) {
            this.hide(us);
        } else if (this.state === STATES.HIDING) {
            us.traits.get(Killable).kill();
            us.vel.set(100, -200);
            us.traits.get(Solid).obstructs = false;
        } else if (this.state === STATES.PANIC) {
            this.hide(us, them);
        }
    }
    hide(us) {
        us.vel.x = 0;
        us.traits.get(PendulumMove).enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.traits.get(PendulumMove).speed;
        }
        this.hideTime = 0;
        this.state = STATES.HIDING;
    }
    unhide(us) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.walkSpeed;
        this.state = STATES.WALKING;
    }
    panic(us, them) {
        us.traits.get(PendulumMove).enabled = true;
        us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATES.PANIC;
    }
    update(us, gameContext) {
        const {
            deltaTime
        } = gameContext;
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
        if (koopa.traits.get(Behavior).state === STATES.HIDING) {
            if (koopa.traits.get(Behavior).hideTime > 3) {
                return wakeAnimation(koopa.traits.get(Behavior).hideTime);
            }
            return 'hiding';
        }
        if (koopa.traits.get(Behavior).state === STATES.PANIC) {
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