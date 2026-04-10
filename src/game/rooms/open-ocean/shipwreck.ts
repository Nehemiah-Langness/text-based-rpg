import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';
import { startSneakRoom } from '../../stealth/start-sneak-room';
import type { Enemy } from '../../combat/enemy';
import { startCombatEncounter } from '../../combat/start-combat-encounter';

function createShark(difficulty = 1): Enemy {
    return {
        level: 1,
        defense: Math.floor(difficulty * 2),
        speed: Math.floor(difficulty * 3),
        effects:
            difficulty > 1
                ? [
                      {
                          duration: 1,
                          effect: 'alert',
                      },
                  ]
                : [],
        genericName: 'a shark',
        specificName: 'The shark',
        health: Math.floor(difficulty * 10),
        stamina: 50,
        strength: difficulty - 1,
        moves: [
            {
                name: 'Chomp',
                actionDescription: 'chomps at you',
                attack: 4,
                coolDown: 0,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level: 1,
                stamina: 5,
            },
            {
                name: 'Ram',
                actionDescription: 'rams you',
                attack: 2,
                coolDown: 3,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level: 1,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 15,
            },
        ],
    };
}

export const Shipwreck = new Room(
    {},
    () => [
        ...VisitedDescription,
        Quests.getStage('fredsSupplyRun') === 'fight-or-sneak'
            ? `A supply crate rests on the sea floor by the shipwreck - partially buried in the sand.  Several sharks circle the crate curious about what contents might be inside.`
            : null,
    ],
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.getStage('fredsSupplyRun') === 'fight-or-sneak') {
            options.push(
                {
                    code: 'sneak-crate',
                    text: 'Attempt to sneak past the sharks to get the crate',
                },
                {
                    code: 'fight-for-crate',
                    text: 'Fight the sharks to get the crate (Valor)',
                }
            );
        }

        return {
            options,
            select: (code) => {
                const combat = (rm: RoomLike, difficulty?: number) =>
                    startCombatEncounter(rm, [createShark(difficulty), createShark(difficulty)], {
                        onComplete: (rm) =>
                            resultRoom(() => Quests.progress(rm, 'fredsSupplyRun', 'fight-or-sneak'), 'You have picked up the chest.'),
                    });

                if (code === 'sneak-crate') {
                    return startSneakRoom(rm, {
                        enemies: 2,
                        gridSize: 6,
                        enemyName: 'Shark',
                        playerStart: { x: 3, y: 5 },
                        target: { x: 2, y: 1 },
                        onComplete: (rm) =>
                            resultRoom(() => Quests.progress(rm, 'fredsSupplyRun', 'fight-or-sneak'), 'You have picked up the chest.'),
                        onFailure: (rm) => resultRoom(() => combat(rm, 1.2), 'You have been spotted.'),
                    });
                } else if (code === 'fight-for-crate') {
                    return combat(rm);
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-east',
                text: 'Go east to the sacred garden',
            },
            {
                code: 'travel-west',
                text: 'Go west to the kelp forest',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'B', 4)
    .withName(RoomNames.openOcean.shipwreck)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([
            ...(!rm.visited ? OnEnterDescription : []),
            Quests.getStage('fredsSupplyRun') === 'travel-shipwreck'
                ? (backTo) => Quests.progress(backTo, 'fredsSupplyRun', 'travel-shipwreck')
                : null,
        ]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The wreck emerges from the seafloor like the bones of some long-dead giant.

Its hull, once proud and whole, is now split open along its spine, jagged planks curling outward and swaying gently with the current. Faded wood is overgrown with coral and pale sea growth, giving the structure an eerie, half-living appearance. Tattered remnants of sails cling to broken masts above, stretching upward like ghostly hands toward the distant light.`,
    `Open gaps in the hull reveal dark interior chambers, where shadows shift and flicker with movement - small fish darting through collapsed corridors, or something larger watching from deeper within.

To the east, the water grows clearer and brighter, where soft light spills outward from the distant Sacred Gardens.

To the west, the ocean thickens into shadow, where towering strands of kelp sway slowly, marking the edge of the forest.

The wreck sits between them - caught between light and darkness, memory and decay.`,
];

const VisitedDescription = [
    'A shattered vessel rests between the Sacred Gardens to the east and the Kelp Forest to the west, its hollow interior dark and full of secrets.',
];
