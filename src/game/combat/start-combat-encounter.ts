import { type RoomLike, Room } from '../engine/room';
import { Skills } from '../knowledge';
import { Player } from '../player';
import { Mood } from '../rooms/moods/mood';
import type { Enemy } from './enemy';
import { combatEncounter } from './combat-encounter';

export function startCombatEncounter(
    backTo: RoomLike,
    enemies: Enemy[],
    variants?: { nonLethal?: boolean; completeText?: string; onComplete?: (rm: RoomLike) => RoomLike; onFailure?: (rm: RoomLike) => RoomLike; }): Room {
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
            return Room.resolve(backTo);
        },
        enemies,
        variants
    ).withColor(Mood.battle);
}
