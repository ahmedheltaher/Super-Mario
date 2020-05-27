export default class Timer {
    constructor(deltaTime = 1/60) {
        let accumulatedTime = 0;
        let lastAnimationTime = 0;
        this.updateProxy = (time) => {
            accumulatedTime += (time - lastAnimationTime) / 1000;
            while (accumulatedTime > deltaTime) {
                this.update(deltaTime);
                accumulatedTime -= deltaTime;
            }
            lastAnimationTime = time;
            this.endQueue();
        };
    }
    endQueue() {
        requestAnimationFrame(this.updateProxy);

    }
    start() {
        this.endQueue();
    }
}