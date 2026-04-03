import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { Mood } from '../moods/mood';
import { RoomNames } from '../names';
import { choiceRoom } from '../utility-rooms/choice-room';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

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
                    text: 'Attempt to sneak past the sharks to get the crate.',
                },
                {
                    code: 'fight-for-crate',
                    text: 'Fight the sharks to get the crate',
                }
            );
        }

        return {
            options,
            select: (code) => {
                if (code === 'sneak-crate') {
                    return startSneakRoom(rm, {
                        enemies: 2,
                        gridSize: 6,
                        enemyName: 'Shark',
                        playerStart: { x: 3, y: 5 },
                        target: { x: 2, y: 3 },
                        onComplete: (rm) =>
                            resultRoom(
                                () => Room.resolve(Quests.progress(rm, 'fredsSupplyRun', 'fight-or-sneak')),
                                'You have picked up the chest.'
                            ),
                    });
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

function startSneakRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        enemies: number;
        enemyName: string;
        playerStart: { x: number; y: number };
        target: { x: number; y: number };
        onFailure?: (rm: RoomLike) => RoomLike;
        onComplete?: (rm: RoomLike) => RoomLike;
    }
) {
    const getSpawnLocation = () => {
        const maxTries = settings.gridSize * settings.gridSize;
        let tries = 0;
        let x = rollDice(settings.gridSize) - 1;
        let y = rollDice(settings.gridSize) - 1;

        while (Math.abs(x - settings.playerStart.x) < 2 || (x === settings.target.x && tries < maxTries)) {
            x = rollDice(settings.gridSize) - 1;
            tries += 1;
        }
        if (tries === maxTries) return null;
        tries = 0;

        while (Math.abs(y - settings.playerStart.y) < 2 || (y === settings.target.y && tries < maxTries)) {
            y = rollDice(settings.gridSize) - 1;
            tries += 1;
        }
        if (tries === maxTries) return null;

        return { x, y };
    };

    const enemies = new Array(settings.enemies)
        .fill(0)
        .map(getSpawnLocation)
        .filter((x) => x !== null);

    return sneakRoom(backTo, {
        enemies: enemies,
        gridSize: settings.gridSize,
        player: settings.playerStart,
        target: settings.target,
        enemyName: settings.enemyName,
        onComplete: settings.onComplete,
        onFailure: settings.onFailure,
    });
}

function sneakRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        enemies: { x: number; y: number }[];
        enemyName: string;
        player: { x: number; y: number };
        target: { x: number; y: number };
        onComplete?: (rm: RoomLike) => RoomLike;
        onFailure?: (rm: RoomLike) => RoomLike;
    }
) {
    const entities = settings.enemies
        .map((enemy) => ({
            coordinates: enemy,
            icon: '!',
        }))
        .concat({
            coordinates: settings.player,
            icon: '*',
        })
        .concat({
            coordinates: settings.target,
            icon: 'X',
        });

    const drawGrid = () => {
        const lines: string[] = [];
        for (let y = 0; y < settings.gridSize; y++) {
            for (let row = 0; row < 3; row++) {
                let currentLine = '';
                for (let x = 0; x < settings.gridSize; x++) {
                    if (row === 0 || (row === 2 && y === settings.gridSize - 1)) {
                        currentLine += `----${x === settings.gridSize - 1 ? '-' : ''}`;
                    } else if (row === 1) {
                        currentLine += `| ${entities.find((e) => e.coordinates.x === x && e.coordinates.y === y)?.icon ?? ' '} ${
                            x === settings.gridSize - 1 ? '|' : ''
                        }`;
                    }
                }
                if (currentLine) {
                    lines.push(currentLine);
                }
            }
        }
        return lines.join('\n');
    };

    return choiceRoom(
        drawGrid() + `\n\n! = ${settings.enemyName}\nX = Target\n* = You`,
        [
            settings.player.y > 1
                ? {
                      code: 'north',
                      text: 'Move north',
                  }
                : null,
            settings.player.x < settings.gridSize - 1
                ? {
                      code: 'east',
                      text: 'Move east',
                  }
                : null,
            settings.player.y < settings.gridSize - 1
                ? {
                      code: 'south',
                      text: 'Move south',
                  }
                : null,
            settings.player.y > 1
                ? {
                      code: 'west',
                      text: 'Move west',
                  }
                : null,
            {
                code: 'leave',
                text: 'Abandon',
            },
        ].filter((x) => x !== null),
        (code, rm) => {
            const nextRoom = () => {
                if (settings.player.x === settings.target.x && settings.player.y === settings.target.y) {
                    return settings.onComplete?.(backTo) ?? backTo;
                }

                return sneakRoom(backTo, settings);
            };

            if (code === 'leave') {
                return backTo;
            } else if (code === 'north') {
                settings.player.y = Math.max(0, settings.player.y - 1);
                return nextRoom;
            } else if (code === 'east') {
                settings.player.x = Math.max(0, settings.player.x - 1);
                return nextRoom;
            } else if (code === 'south') {
                settings.player.y = Math.min(settings.gridSize - 1, settings.player.y - 1);
                return nextRoom;
            } else if (code === 'west') {
                settings.player.x = Math.min(settings.gridSize - 1, settings.player.x - 1);
                return nextRoom;
            }

            return rm;
        }
    )
        .withColor(Mood.miniGame)
        .withFastPrint();
}
