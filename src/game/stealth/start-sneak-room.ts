import { rollDice } from '../dice';
import type { RoomLike } from '../engine/room';
import { sneakRoom } from './sneak-room';

export function startSneakRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        enemies: number;
        enemyName: string;
        playerStart: { x: number; y: number };
        target: { x: number; y: number };
        onFailure?: (rm: RoomLike) => RoomLike;
        onComplete?: (rm: RoomLike) => RoomLike;
    }
) {
    const getSpawnLocation = () => {
        const maxTries = settings.gridSize * settings.gridSize;
        let tries = 0;
        let x = rollDice(settings.gridSize) - 1;
        let y = rollDice(settings.gridSize) - 1;

        while (Math.abs(x - settings.playerStart.x) < 2 || (x === settings.target.x && tries < maxTries)) {
            x = rollDice(settings.gridSize) - 1;
            tries += 1;
        }
        if (tries === maxTries) return null;
        tries = 0;

        while (Math.abs(y - settings.playerStart.y) < 2 || (y === settings.target.y && tries < maxTries)) {
            y = rollDice(settings.gridSize) - 1;
            tries += 1;
        }
        if (tries === maxTries) return null;

        return { x, y };
    };

    const enemies = new Array(settings.enemies)
        .fill(0)
        .map(getSpawnLocation)
        .filter((x) => x !== null);

    return sneakRoom(backTo, {
        enemies: enemies,
        gridSize: settings.gridSize,
        player: settings.playerStart,
        target: settings.target,
        enemyName: settings.enemyName,
        onComplete: settings.onComplete,
        onFailure: settings.onFailure,
    });
}
