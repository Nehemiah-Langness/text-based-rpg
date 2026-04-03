import { type RoomLike } from '../engine/room';
import { Skills } from '../knowledge';
import { Player } from '../player';
import type { Enemy } from './enemy';
import { combatEncounter } from './combat-encounter';

export function startCombatEncounter(
    backTo: RoomLike,
    enemies: Enemy[],
    variants?: {
        nonLethal?: boolean;
        completeText?: string;
        onComplete?: (rm: RoomLike) => RoomLike;
        onFailure?: (rm: RoomLike) => RoomLike;
    }
): RoomLike {
    const initialPlayerHealth = Player.health.current;
    if (variants?.nonLethal) {
        Player.health.current = Player.health.max;
    }
    return combatEncounter(
        () => {
            Player.coolDown(true);
            Skills.coolDown(true);
            if (variants?.nonLethal) {
                Player.health.current = initialPlayerHealth;
            }
            return backTo;
        },
        enemies,
        variants
    );
}
