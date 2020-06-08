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

export const makePlayer = (entity, name) => {
    const player = new Player();
    player.name = name;
    entity.addTrait(player);
};

export function* findPlayers(entities) {
    for (const entity of entities) {
        if (entity.traits.has(Player)) {
            yield entity;
        }
    }
}