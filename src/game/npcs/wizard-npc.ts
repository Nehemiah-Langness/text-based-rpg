import { Knowledge } from '../knowledge';
import { Npc } from '../engine/npc';
import { Names, NpcNames } from './npc-names';

export const WizardNpc = new Npc(
    'Wizard',
    () => (Knowledge.wizardName ? NpcNames['Wizard'] : ['The wizard', 'The wizard', 'The wizard']),
    [
        () => [
            `The wizard folds his hands within his sleeves, studying you with quiet intensity.

"Survival, as you will soon learn, is rarely a matter of strength alone. It is... advantage. The smallest edge can decide whether you walk away - or fall where you stand."

A faint shimmer gathers around him as he speaks.

"The auras I offer are not mere trinkets of magic. They are the unseen hand that tilts fate in your favor... the difference between life and death."`,
        ],
        (npc, rm) => [
            `${npc.getName(rm)[Names.FirstName]} gestures lightly, and a flicker of light pulses in the air.

"The Healing Aura will mend your wounds as battle rages, keeping you standing when others would falter."`,
        ],
        () => `"The Energizing Aura will restore your strength, feeding you the power to press on when exhaustion should claim you."`,
        (npc, rm) => [
            `A light dances unpredictable around ${npc.getName(rm)[Names.FirstName]}.
        
"The Luck Aura, that is for those who prefer fate to smile upon them - guiding their strikes to land just a little harder, just a little truer."`,
        ],
    ],
    {
        introduction: (npc, room) => {
            Knowledge.wizardName = true;
            return [
                `"Ah... a new arrival. How fortunate for you."

He inclines his head slightly.

"I am ${npc.getName(room)[Names.FullName]} - keeper of forgotten arts, weaver of forces best left undisturbed. Power, you see, is not beyond your reach... not while I yet draw breath."`,
                `A faint, knowing smile curls across his lips.

"But understand this: magic is never given freely. Every spell, every boon, every whisper of power I grant you... comes at a price."

He leans closer, voice dropping to a quiet murmur.

"And I assure you - my prices are never... insignificant."`,
            ];
        },
    },
    (npc) => {
        if (!npc.met) return 'introduction';
        return null;
    }
);
