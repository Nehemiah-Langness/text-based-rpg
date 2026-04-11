export type SkillModifier =
    | 'stun'
    | 'distract'
    | 'alert'
    | 'stamina-regen-low'
    | 'health-regen-low'
    | 'stamina-regen-med'
    | 'health-regen-med'
    | 'stamina-regen-high'
    | 'health-regen-high'
    | 'speed'
    | 'strength';
export type Skill = {
    name: string;
    actionDescription: string;
    attack: number;
    level: number;
    modifiers?: { effect: SkillModifier; duration: number }[];
    inCoolDown: number;
    coolDown: number;
    coolDownCompleteText: string;
    stamina?: number;
    xp: number;
};

export class SkillSet<
    TSkills extends {
        [key in keyof TSkills]: Skill;
    },
> {
    skills: TSkills;

    constructor(skills: TSkills) {
        this.skills = skills;
    }

    save() {
        return this.skills;
    }

    load(data: Partial<TSkills>) {
        Object.assign(this.skills, data);
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

    useSkill<T extends keyof TSkills>(skillName: T) {
        const skill = this.skills[skillName];
        if (skill.coolDown) skill.inCoolDown = skill.coolDown + 1;

        let leveledUp = false;
        skill.xp += 1;
        const nextLevel = Math.min(1, skill.level) * 25;
        if (skill.xp >= nextLevel) {
            skill.level += 1;
            skill.xp -= nextLevel;
            leveledUp = true;
        }

        return {
            skill,
            leveledUp,
        };
    }

    static createSkill(skill: Omit<Skill, 'coolDown' | 'inCoolDown' | 'coolDownCompleteText' | 'xp'> & Partial<Skill>): Skill {
        return {
            inCoolDown: 0,
            coolDown: 0,
            coolDownCompleteText: `You can ${skill.name} again.`,
            xp: 0,
            ...skill,
        };
    }
}
