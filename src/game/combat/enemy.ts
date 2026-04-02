import type { Skill } from '../knowledge';


export interface Enemy {
    level: number;
    defense: number;
    dodge: number;
    health: {
        current: number;
        max: number;
    };
    specificName: string;
    genericName: string;
    moves: Skill[];
    effects: NonNullable<Skill['modifiers']>[number][];
}
