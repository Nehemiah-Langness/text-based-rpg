import { rollDice } from '../dice';
import type { Skill } from '../engine/skill-set';

export function resolveAttack(
    { level, strength, penalty }: { strength: number; level: number; penalty: number },
    defense: { armor: number; dodge: number }
) {
    const critical = rollDice(Math.max(1, 20 - penalty));

    const stunned: NonNullable<Skill['modifiers']> =
        critical === 1
            ? [
                  {
                      duration: 1,
                      effect: 'stun',
                  },
              ]
            : [];

    const effectiveLevel = Math.max(0, level - penalty);
    const levelScaling = strength * (effectiveLevel - 1);

    const maxAttack = strength + levelScaling;
    const attackRolled = rollDice(strength) + levelScaling;

    const attackRoll =
        critical === 1
            ? 0
            : critical === 20
              ? Math.max(Math.ceil(maxAttack / 2), attackRolled) * 3
              : effectiveLevel > 0
                ? strength < 1
                    ? 0
                    : attackRolled
                : 1;

    const dodgedAttack = rollDice(100) <= defense.dodge;

    return {
        dodged: dodgedAttack,
        attack: attackRoll,
        defense: defense.armor,
        damage: dodgedAttack ? 0 : Math.max(0, attackRoll - defense.armor),
        critical: critical === 1 ? ('fail' as const) : critical === 20 ? ('success' as const) : null,
        attackerModifiers: stunned,
    };
}
