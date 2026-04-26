import { type RoomLike } from '../engine/room';
import { Player } from '../player';
import { EnemyEntity } from '../engine/enemy-entity';
import type { Enemy } from './enemy';
import { combatEncounter } from './combat-encounter';
import { type Skill } from '../engine/skill-set';
import { SkillSet } from '../engine/skill-set';

export function startCombatEncounter(
    backTo: RoomLike,
    enemies: Enemy[],
    variants?: {
        nonLethal?: boolean;
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
            if (variants?.nonLethal) {
                Player.health.current = initialPlayerHealth;
            }
            return backTo;
        },
        enemies.map(
            (e) =>
                new EnemyEntity({
                    defense: e.defense,
                    genericName: e.genericName,
                    health: e.health,
                    level: e.level,
                    moves: new SkillSet(
                        e.moves.reduce(
                            (c, n) =>
                                Object.assign(c, {
                                    [n.name]: n,
                                }),
                            {} as Record<string, Skill>
                        )
                    ),
                    specificName: e.specificName,
                    stamina: e.stamina,
                    speed: e.speed,
                    strength: e.strength ?? 0,
                })
        ),
        {
            ...variants,
            damageDealt: 0,
            damageReceived: 0,
            valorDamageThreshold: Player.health.max,
        }
    );
}
