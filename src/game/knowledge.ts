export const Knowledge = {
    guardName: false,
    farmerName: false,
    innKeeperName: false,
    innKeeperWifeName: false,
    generalStoreOwnerName: false,
    armorStoreOwnerName: false,
    weaponStoreOwnerName: false,
    guildMasterName: false,
    wizardName: false,
    hunterName: false,
    pathToPond: false,
};

export type SkillModifier = 'stun' | 'distract' | 'alert';
export type Skill = {
    name: string;
    attack: number;
    level: number;
    modifiers?: { effect: SkillModifier; duration: number }[];
    inCoolDown: number;
    coolDown: number;
    coolDownCompleteText: string;
    stamina?: number;
};

export class SkillSet<TSkills extends { [key in keyof TSkills]: Skill }> {
    skills: TSkills;

    constructor(skills: TSkills) {
        this.skills = skills;
    }

    private skillList(): [keyof TSkills, Skill][] {
        return Object.entries(this.skills) as [keyof TSkills, Skill][];
    }

    levelSkill<T extends keyof TSkills>(skill: T) {
        this.skills[skill].level += 1;
        if (this.skills[skill].level === 1) {
            return `You have learned how to ${this.skills[skill].name}.`;
        }
        return `Your skill when you ${this.skills[skill].name} has increased.`;
    }

    getSkills() {
        return this.skillList()
            .filter(([, skill]) => skill.level > 0 && skill.inCoolDown === 0)
            .map(([name, skill]) => {
                return {
                    name,
                    skill,
                };
            });
    }

    coolDown(all = false) {
        return this.skillList()
            .map(([, skill]) => {
                if (skill.inCoolDown > 0) {
                    if (all) {
                        skill.coolDown = 0;
                    } else {
                        skill.inCoolDown -= 1;
                    }
                    if (skill.inCoolDown === 0) {
                        return skill.coolDownCompleteText;
                    }
                }
                return '';
            })
            .filter((x) => x);
    }

    useSkill<T extends keyof TSkills>(skill: T): Skill {
        if (this.skills[skill].coolDown) this.skills[skill].inCoolDown = this.skills[skill].coolDown + 1;
        return this.skills[skill];
    }

    static createSkill(skill: Omit<Skill, 'coolDown' | 'inCoolDown' | 'coolDownCompleteText'> & Partial<Skill>): Skill {
        return {
            inCoolDown: 0,
            coolDown: 0,
            coolDownCompleteText: `You can ${skill.name} again.`,
            ...skill,
        };
    }
}

export type SkillName = keyof typeof Skills.skills;
export const Skills = new SkillSet({
    starfishThrow: SkillSet.createSkill({
        name: 'Throw Starfish Friend',
        attack: 6,
        level: 0,
        coolDown: 2,
        modifiers: [
            {
                effect: 'distract',
                duration: 2,
            },
        ],
        stamina: 2
    }),

    tailKick: SkillSet.createSkill({
        name: 'Tail Kick',
        attack: 4,
        level: 0,
        stamina: 4
    }),
    bubbleBlast: SkillSet.createSkill({
        name: 'Bubble Blast',
        attack: 6,
        level: 0,
        coolDown: 1,
        stamina: 5
    }),
    kineticWave: SkillSet.createSkill({
        name: 'Create Kinetic Wave',
        attack: 8,
        level: 0,
        coolDown: 2,
        stamina: 10
    }),
    oceanTwister: SkillSet.createSkill({
        name: 'Summon Ocean Twister',
        attack: 12,
        level: 0,
        coolDown: 3,
        stamina: 20
    }),
    sirensCall: SkillSet.createSkill({
        name: "Sing the Siren's Call",
        attack: 0,
        level: 0,
        modifiers: [
            {
                duration: 1,
                effect: 'stun',
            },
        ],
        coolDown: 2,
    }),
});
