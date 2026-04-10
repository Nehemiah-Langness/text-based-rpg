import type { Skill } from '../engine/skill-set';

export interface Enemy {
    level: number;
    defense: number;
    strength: number;
    speed: number;
    health: number;
    stamina: number;
    specificName: string;
    genericName: string;
    moves: Skill[];
    effects: NonNullable<Skill['modifiers']>[number][];
}
