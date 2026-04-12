import { rollDice } from '../dice';
import type { RoomLike } from '../engine/room';
import { searchRoom } from './search-room';

export function startSearchRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        maxAttempts?: number;
        playerStart: { x: number; y: number };
        target?: { x: number; y: number };
        onFailure?: (rm: RoomLike) => RoomLike;
        onComplete?: (rm: RoomLike) => RoomLike;
    }
) {
    const getSpawnLocation = () => {
        let x = rollDice(settings.gridSize) - 1;
        let y = rollDice(settings.gridSize) - 1;
        return { x, y };
    };

    const target = settings.target ?? getSpawnLocation();

    return searchRoom(backTo, {
        maxAttempts: settings.maxAttempts ?? null,
        tries: [],
        gridSize: settings.gridSize,
        player: settings.playerStart,
        target: target,
        onComplete: settings.onComplete,
        onFailure: settings.onFailure,
    });
}
