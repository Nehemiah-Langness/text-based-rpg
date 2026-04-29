import type { Enemy } from './enemy';

export function createStoneboundSentinel(level: number): Enemy {
    return {
        level,
        defense: 2,
        speed: 0,
        effects: [],
        genericName: 'a Stonebound sentinel',
        specificName: 'the sentinel',
        health: 10 + level * 15,
        stamina: 40 + level * 10,
        moves: [
            {
                name: 'Granite Slam',
                actionDescription: "performs a heavy, crushing slam with it's fists",
                attack: 10,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 20,
                xp: -100000,
            },
            {
                name: 'Guarding Stance',
                actionDescription: "readies it's stance for oncoming damage",
                attack: 0,
                coolDown: 3,
                coolDownCompleteText: '',
                inCoolDown: 0,
                perks: [
                    {
                        duration: 2,
                        effect: 'defense',
                    },
                ],
                level,
                stamina: 0,
                xp: -100000,
            },
            {
                name: 'Seismic Pulse',
                actionDescription: 'creates a seismic pulse in the water',
                attack: 4,
                coolDown: 1,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 16,
                xp: -100000,
            },
        ],
    };
}
