import type { Enemy } from './enemy';

export function createBloodfin(level: number): Enemy {
    return {
        level,
        defense: 2,
        speed: 10 + level,
        effects: [],
        genericName: 'a Bloodfin Clan shark',
        specificName: 'the Bloodfin shark',
        health: 10 + level * 10,
        stamina: 40 + level * 10,
        moves: [
            {
                name: 'Fin Slash',
                actionDescription: 'quickly swipes his sharpened fins',
                attack: 3,
                coolDown: 0,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 10,
                xp: -100000,
            },
            {
                name: 'Rending Charge',
                actionDescription: 'surges forward in a straight-line attack',
                attack: 6,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 20,
                xp: -100000,
            },
            {
                name: 'Savage Bite',
                actionDescription: 'does a direct, brutal bite',
                attack: 10,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 35,
                xp: -100000,
            },

            {
                name: 'Disorienting Feint',
                actionDescription: 'makes a fake-out movement, followed by a quick strike',
                attack: 1,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'distract',
                    },
                ],
                stamina: 10,
                xp: -100000,
            },
            {
                name: 'Tail Whip',
                actionDescription: 'sweeps his tail',
                attack: 1,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'distract',
                    },
                ],
                stamina: 10,
                xp: -100000,
            },
            {
                name: 'Crushing Lunge',
                actionDescription: 'lunges into a heavy-bodied slam',
                attack: 2,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 14,
                xp: -100000,
            },
            {
                name: 'Jaw Clamp',
                actionDescription: 'locks his teeth into you and throws you away',
                attack: 4,
                coolDown: 4,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 19,
                xp: -100000,
            },
        ],
    };
}
