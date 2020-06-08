import Trait from "../Trait.js";

export default class LevelTimer extends Trait {
    static EVENT_TIME_HURRY = Symbol('timer harry'); // jshint ignore:line
    static EVENT_TIME_NORMAL = Symbol('timer normal'); // jshint ignore:line

    constructor() {
        super();
        this.totalTime = 300;
        this.currentTime = this.totalTime;
        this.hurryTime = 100;
        this.hurryEmitted = null;
    }
    update(entity, {
        deltaTime
    }, level) {
        this.currentTime -= deltaTime * 2;
        if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIME_HURRY);
            this.hurryEmitted = true;
        }
        if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
            level.events.emit(LevelTimer.EVENT_TIME_NORMAL);
            this.hurryEmitted = false;
        }
    }
}