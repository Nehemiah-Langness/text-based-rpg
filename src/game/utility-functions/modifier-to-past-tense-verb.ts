import type { SkillModifier } from '../engine/skill-set';

export function modifierToPastTenseVerb(modifier: SkillModifier) {
    switch (modifier) {
        case 'stun': {
            return 'stunned';
        }
        case 'alert': {
            return 'prepared to defend an attack';
        }
        case 'speed': {
            return 'energized with excess speed';
        }
        case 'strength': {
            return 'invigorated with extra strength';
        }
        case 'stamina-regen-low': {
            return 'imbued with a small amount of regenerating stamina';
        }
        case 'stamina-regen-med': {
            return 'imbued with a moderate amount of regenerating stamina';
        }
        case 'stamina-regen-high': {
            return 'imbued with a large amount of regenerating stamina';
        }
        case 'health-regen-low': {
            return 'imbued with a small amount of regenerating health';
        }
        case 'health-regen-med': {
            return 'imbued with a moderate amount of regenerating health';
        }
        case 'health-regen-high': {
            return 'imbued with a large amount of regenerating health';
        }
        case 'distract':
        default:
            return modifier + 'ed';
    }
}
