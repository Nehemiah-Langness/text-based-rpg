import type { SkillModifier } from "../knowledge";

export function modifierToPastTenseVerb(modifier: SkillModifier) {
    switch (modifier) {
        case 'stun': {
            return 'stunned';
        }
        case 'alert': {
            return 'prepared to defend an attack';
        }
        default:
            return modifier + 'ed';
    }
}
