import { SkillSet } from './engine/skill-set';

export type SkillName = keyof typeof Skills.skills;
export const Skills = new SkillSet({
    starfishThrow: SkillSet.createSkill({
        name: 'Throw Wiggles',
        actionDescription: 'throw Wiggles, your best starfish friend in the whole world,',
        attack: 8,
        level: 0,
        coolDown: 2,
        coolDownCompleteText: 'Wiggles has swam back to you.',
        modifiers: [
            {
                effect: 'distract',
                duration: 2,
            },
        ],
        stamina: 4,
    }),
    starfishThrowDiminished: SkillSet.createSkill({
        name: 'Throw Wiggles',
        actionDescription: 'throw Wiggles, your best starfish friend in the whole world,',
        attack: 6,
        level: 0,
        coolDown: 2,
        coolDownCompleteText: 'Wiggles has swam back to you.',
        modifiers: [
            {
                effect: 'distract',
                duration: 1,
            },
        ],
        stamina: 4,
    }),
    tailKick: SkillSet.createSkill({
        name: 'Tail Kick',
        actionDescription: 'do a tail kick',
        attack: 4,
        level: 0,
        stamina: 8,
    }),
    bubbleBlast: SkillSet.createSkill({
        name: 'Bubble Blast',
        actionDescription: 'make a blast of bubbles',
        attack: 6,
        level: 0,
        coolDown: 1,
        stamina: 12,
    }),
    kineticWave: SkillSet.createSkill({
        name: 'Kinetic Wave',
        actionDescription: 'create a kinetic wave',
        attack: 12,
        level: 0,
        coolDown: 2,
        stamina: 20,
    }),
    oceanTwister: SkillSet.createSkill({
        name: 'Ocean Twister',
        actionDescription: 'summon an ocean twister',
        attack: 16,
        level: 0,
        coolDown: 3,
        stamina: 30,
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
