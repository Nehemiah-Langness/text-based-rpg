import { SkillSet } from './engine/skill-set';

export type SkillName = keyof typeof Skills.skills;
export const Skills = new SkillSet({
    starfishThrow: SkillSet.createSkill({
        name: 'Throw Starfish Friend',
        actionDescription: 'throw starfish friend',
        attack: 6,
        level: 0,
        coolDown: 2,
        modifiers: [
            {
                effect: 'distract',
                duration: 2,
            },
        ],
        stamina: 2,
    }),
    tailKick: SkillSet.createSkill({
        name: 'Tail Kick',
        actionDescription: 'do a tail kick',
        attack: 4,
        level: 0,
        stamina: 4,
    }),
    bubbleBlast: SkillSet.createSkill({
        name: 'Bubble Blast',
        actionDescription: 'make a blast of bubbles',
        attack: 6,
        level: 0,
        coolDown: 1,
        stamina: 5,
    }),
    kineticWave: SkillSet.createSkill({
        name: 'Kinetic Wave',
        actionDescription: 'create a kinetic wave',
        attack: 8,
        level: 0,
        coolDown: 2,
        stamina: 10,
    }),
    oceanTwister: SkillSet.createSkill({
        name: 'Ocean Twister',
        actionDescription: 'summon an ocean twister',
        attack: 12,
        level: 0,
        coolDown: 3,
        stamina: 20,
    }),
    sirensCall: SkillSet.createSkill({
        name: "Siren's Call",
        actionDescription: "sing the Siren's Call",
        attack: 0,
        level: 0,
        modifiers: [
            {
                duration: 2,
                effect: 'stun',
            },
        ],
        coolDown: 4,
    }),
});
