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
        return (Object.entries(this.skills) as [keyof TSkills, Skill][]).reduce(
            (current, next) => {
                return Object.assign(current, {
                    [next[0]]: {
                        level: next[1].level,
                        xp: next[1].xp,
                    },
                });
            },
            {} as Record<keyof TSkills, { level: number; xp: number }>
        );
    }

    load(data: Partial<ReturnType<typeof this.save>>) {
        (Object.entries(data) as [keyof TSkills, { level: number; xp: number }][]).forEach(([item, value]) => {
            if (this.skills[item]) {
                this.skills[item].level = value.level ?? this.skills[item].level;
                this.skills[item].xp = value.xp ?? this.skills[item].xp;
            }
        });
    }

    private skillList(): [keyof TSkills, Skill][] {
        return Object.entries(this.skills) as [keyof TSkills, Skill][];
    }

    levelSkill<T extends keyof TSkills>(skill: T, value: number | null = null) {
        const currentSkill = this.skills[skill];
        if (value === null || currentSkill.level < value) {
            currentSkill.level = value === null ? currentSkill.level + 1 : value;
            if (currentSkill.level === 1) {
                return `You have learned how to ${currentSkill.name}.`;
            }
            return `Your skill when you ${currentSkill.actionDescription} has increased.`;
        }
        return null;
    }

    getSkills(all = false) {
        return this.skillList()
            .filter(([, skill]) => skill.level > 0 && (all || skill.inCoolDown === 0))
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
                        skill.inCoolDown = 0;
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

    nextLevelXpRequirement(level: number) {
        return Math.max(1, level) * 25;
    }

    useSkill<T extends keyof TSkills>(skillName: T) {
        const skill = this.skills[skillName];
        if (skill.coolDown) skill.inCoolDown = skill.coolDown + 1;

        let leveledUp = false;
        skill.xp += 1;
        const nextLevel = this.nextLevelXpRequirement(skill.level);
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
