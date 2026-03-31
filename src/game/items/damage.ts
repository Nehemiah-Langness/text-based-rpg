import { rollDice } from '../dice';

export function getDamage(attack: number, level: number) {
    const sides = Math.ceil(attack / level);
    const rolls = level * level;

    return rollDice(sides, rolls);
}

export function getDefense(attack: number, level: number) {
    if (level === 0) return 0;

    const { maxAttack, minAttack } = attackRange(attack, level);

    const targetDefense = Math.ceil(((maxAttack - minAttack) / 3) * 2) + minAttack;

    return Math.ceil(targetDefense / 4);
}

export function attackRange(attack: number, level: number) {
    const sides = Math.ceil(attack / level);
    const rolls = level * level;
    return {
        minAttack: rolls,
        maxAttack: sides * rolls,
    };
}
