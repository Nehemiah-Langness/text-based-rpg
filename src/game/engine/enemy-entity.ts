import type { Skill, SkillSet } from './skill-set';
import { Entity } from './entity';

export class EnemyEntity<
    T extends {
        [key in keyof T]: Skill;
    } = Record<string, Skill>,
> extends Entity<T> {
    level: number;
    defense: number;
    specificName: string;
    genericName: string;

    constructor({
        level,
        defense,
        specificName,
        genericName,
        ...parent
    }: {
        health: number;
        stamina: number;
        moves: SkillSet<T>;
        speed?: number;
        strength?: number;
        level: number;
        defense: number;
        specificName: string;
        genericName: string;
    }) {
        super(parent);
        this.level = level;
        this.defense = defense;
        this.specificName = specificName;
        this.genericName = genericName;
    }

    getDefense() {
        return Math.floor(this.defense * this.level * (this.modifiers.find((m) => m.effect === 'defense') ? 1.5 : 1));
    }
}
