import type { Skill } from '../engine/skill-set';

export interface Enemy {
    level: number;
    defense: number;
    speed: number;
    health: number;
    stamina: number;
    specificName: string;
    genericName: string;
    moves: Skill[];
    strength?: number;
    effects: NonNullable<Skill['modifiers']>[number][];
}
