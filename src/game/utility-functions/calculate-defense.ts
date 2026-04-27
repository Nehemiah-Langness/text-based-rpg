import { AverageDamagePerLevel } from '../leveling';

export function calculateDefense(level: number, type: 'arm' | 'head' | 'chest') {
    const targetDamage = AverageDamagePerLevel * level;
    const damageEffectiveness = [
        'arm',
        'arm',
        'arm',
        'head',
        'head',
        'head',
        'head',
        'chest',
        'chest',
        'chest',
        'chest',
        'chest',
        'chest',
    ] as (typeof type)[];
    return Math.max(1, Math.floor((targetDamage * damageEffectiveness.filter((x) => x === type).length) / damageEffectiveness.length));
}
