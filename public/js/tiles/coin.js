import Player from "../traits/Player.js";

function handle({
    entity,
    match,
    resolver
}) {
    if (entity.traits.has(Player)) {
        entity.traits.get(Player).addCoins();
        const grid = resolver.matrix;
        grid.delete(match.indexX, match.indexY);
    }
}

export const coin = [handle, handle];