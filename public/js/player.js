import PlayerController from './traits/PlayerController.js';
import Entity from './Entity.js';
import Player from './traits/Player.js';

export const createPlayerEnvironment = (PlayerEntity) => {
    const playerEnvironment = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(PlayerEntity);
    playerEnvironment.addTrait(playerControl);
    return playerEnvironment;
};

export const createPlayer = (entity) => {
    entity.addTrait(new Player());
    return entity;
};

export function* findPlayers(level) {
    for (const entity of level.entities) {
        if (entity.player) {
            yield entity;
        }
    }
}