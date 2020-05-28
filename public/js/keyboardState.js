const KEY_STATES_HOLDER = {
    RELEASED: 0,
    PRESSED: 1
};
const EVENTS = ['keydown', 'keyup'];

export default class keyboardState {
    constructor() {
        // Holds The Current State of a given key
        this.keyStates = new Map();
        // Holds The callback function for a key code
        this.keyMap = new Map();
    }
    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }
    handelEvent(event) {
        const {
            keyCode
        } = event;
        if (!this.keyMap.has(keyCode)) {
            // Did Not have key mapped
            return;
        }
        event.preventDefault();
        const keyState = event.type === 'keydown' ? KEY_STATES_HOLDER.PRESSED : KEY_STATES_HOLDER.RELEASED;
        
        if (this.keyStates.get(keyCode) === keyState) {
            return;
        }
        this.keyStates.set(keyCode, keyState);
        console.log(this.keyStates);

        this.keyMap.get(keyCode)(keyState);
    }
    listenTo(eventProvider) {
        EVENTS.forEach(eventName => {
            eventProvider.addEventListener(eventName, event => {
                this.handelEvent(event);
            });
        });
    }
}