import type { Skill, SkillSet, SkillModifier } from './skill-set';

export class Entity<
    T extends {
        [key in keyof T]: Skill;
    } = Record<string, Skill>,
> {
    health: {
        current: number;
        max: number;
    };
    stamina: {
        current: number;
        max: number;
    };

    speed: number;
    strength: number;

    modifiers: NonNullable<Skill['modifiers']> = [];
    skillSet: SkillSet<T>;

    constructor({
        health,
        stamina,
        speed,
        strength,
        moves,
    }: {
        health: number;
        stamina: number;
        moves: SkillSet<T>;
        speed?: number;
        strength?: number;
    }) {
        this.health = {
            current: health,
            max: health,
        };
        this.stamina = {
            current: stamina,
            max: stamina,
        };
        this.strength = strength ?? 0;
        this.speed = speed ?? 0;
        this.skillSet = moves;
    }

    useSkill(skill: keyof T) {
        const staminaCost = this.skillSet.skills[skill].stamina ?? 0;
        if (this.stamina.current > staminaCost) {
            this.stamina.current -= staminaCost;
            return this.skillSet.useSkill(skill);
        }
        return { skill: null, leveledUp: false };
    }

    getModifiers() {
        return this.modifiers.reduce(
            (c, n) =>
                Object.assign(c, {
                    [n.effect]: true,
                }),
            {} as Record<SkillModifier, boolean | undefined>
        );
    }

    getDodge() {
        const isAlert = !!this.modifiers.find((e) => e.effect === 'alert');
        const bonusSpeed = this.modifiers.find((e) => e.effect === 'speed') ? 10 : 0;
        return Math.min(45, this.speed) + (isAlert ? 30 : 0) + bonusSpeed;
    }

    coolDown(all = false) {
        const lostEffects = this.modifiers.filter((x) => (all ? true : x.duration === 0)).map((x) => x.effect);
        this.modifiers.forEach((modifier) => {
            modifier.duration -= 1;
        });
        this.modifiers = all ? [] : this.modifiers.filter((x) => x.duration >= 0);

        return {
            effects: lostEffects,
            skills: this.skillSet.coolDown(all),
        };
    }

    prepareForAttack() {
        this.addModifier({ duration: 0, effect: 'alert' });
        const staminaGained = this.energize(10);
        return {
            effect: 'alert' as const,
            staminaGained,
        };
    }

    addModifier(...modifiers: NonNullable<Skill['modifiers']>[number][]) {
        modifiers.forEach((modifier) => {
            const existing = this.modifiers.find((x) => x.effect === modifier.effect);
            if (existing) {
                existing.duration += modifier.duration;
            } else {
                this.modifiers.push({ ...modifier });
            }
        });
    }

    heal(amount: number) {
        const amountHealed = Math.max(0, Math.min(amount, this.health.max - this.health.current));
        this.health.current += amountHealed;
        return amountHealed;
    }

    energize(amount: number) {
        const amountEnergized = Math.max(0, Math.min(amount, this.stamina.max - this.stamina.current));
        this.stamina.current += amountEnergized;
        return amountEnergized;
    }
}
