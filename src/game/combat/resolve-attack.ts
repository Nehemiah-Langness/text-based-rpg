import { multipleDiceRoll, rollDice } from '../dice';
import type { Skill } from '../knowledge';


export function resolveAttack(
    { level, strength, penalty }: { strength: number; level: number; penalty: number; },
    defense: { armor: number; dodge: number; }
) {
    const dodgedAttack = multipleDiceRoll(10, defense.dodge).some((x) => x === 1);
    if (dodgedAttack) {
        return {
            dodged: true,
            attack: 0,
            defense: 0,
            attackerModifiers: [],
        };
    }

    const critical = rollDice(Math.max(1, 20 - penalty));

    const effectiveLevel = Math.max(0, level - penalty);

    const attackRoll = critical === 1
        ? 0
        : critical === 20
            ? strength * level * 3
            : effectiveLevel > 0
                ? strength < 1
                    ? 0
                    : rollDice(strength) + strength * (effectiveLevel - 1)
                : 1;

    return {
        dodged: false,
        attack: attackRoll,
        defense: defense.armor,
        critical,
        attackerModifiers: (critical === 1
            ? [
                {
                    duration: 1,
                    effect: 'stun',
                },
            ]
            : []) as NonNullable<Skill['modifiers']>,
    };
}
