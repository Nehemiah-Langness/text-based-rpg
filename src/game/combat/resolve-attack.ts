import { rollDice } from '../dice';
import type { Skill } from '../engine/skill-set';

export function resolveAttackRoll({ level, strength, penalty }: { strength: number; level: number; penalty: number }) {
    const effectiveLevel = Math.max(1, level - penalty);
    const effectiveStrength = Math.max(0, strength - penalty * 2);
    const levelScaling = effectiveStrength * (effectiveLevel - 1);

    const maxAttack = strength === 0 ? 0 : Math.max(1, effectiveStrength + levelScaling);
    const minAttack = strength === 0 ? 0 : 1 + levelScaling;
    const attackRolled = strength === 0 ? 0 : rollDice(effectiveStrength) + levelScaling;

    return {
        effectiveLevel,
        maxAttack,
        minAttack,
        attackRolled,
    };
}

export function resolveAttack(
    { level, strength, penalty }: { strength: number; level: number; penalty: number },
    defense: { armor: number; dodge: number }
) {
    const criticalFail = 1 + penalty;
    const criticalSuccess = 20 + penalty;
    const critical = rollDice(Math.max(1, Math.floor(20 / (penalty + 1))));

    const stunned: NonNullable<Skill['modifiers']> =
        critical === criticalFail
            ? [
                  {
                      duration: 1,
                      effect: 'stun',
                  },
              ]
            : [];

    const { attackRolled, maxAttack, effectiveLevel } = resolveAttackRoll({
        level,
        penalty,
        strength,
    });

    const attackRoll =
        critical === criticalFail
            ? 0
            : critical === criticalSuccess
              ? Math.max(Math.ceil(maxAttack * 2 / 3), attackRolled) * 3
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
        critical: critical === criticalFail ? ('fail' as const) : critical === criticalSuccess ? ('success' as const) : null,
        attackerModifiers: stunned,
    };
}
