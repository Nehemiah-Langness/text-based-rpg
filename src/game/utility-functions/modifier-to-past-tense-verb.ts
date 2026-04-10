import type { SkillModifier } from "../engine/skill-set";

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
