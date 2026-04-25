import { compare } from '../../../helpers/compare';
import { createStoneboundSentinel } from '../../combat/create-stonebound-sentinel';
import { lootRoom } from '../../combat/loot-room';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { stoneboundSentinelLootTable } from '../../combat/stonebound-sentinel-loot-table';
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

export const SealedCavern = new Room(
    {
        cavernSealed: true,
        requiresCombat: true,
    },
    (rm) => VisitedDescription(rm),
    (sealedCavern) => {
        const options: InputOption[] = [];

        if (sealedCavern.state.cavernSealed) {
            options.push({
                code: 'investigate-cavern',
                text: 'Investigate the sealed cavern',
            });
        } else {
            options.push({
                code: 'enter',
                text: 'Enter the cavern',
            });
        }

        return {
            options,
            select: (code) => {
                if (code === 'investigate-cavern') {
                    return resultRoom(
                        () =>
                            startPuzzle(
                                sealedCavern,
                                {
                                    turnTables: 3,
                                },
                                () => {
                                    sealedCavern.state.cavernSealed = false;
                                    return resultRoom(sealedCavern, [
                                        `A deep, resonant hum pulses through the stone.

The carvings begin to glow faintly, one by one, as if recognizing your solution. 

The wheels tremble, then sink slightly into the wall with a heavy click.`,
                                        `Cracks of soft blue light spread across the surface of the seal.

The entire barrier shudders.

Slowly, the stone begins to part, splitting down the center as ancient mechanisms awaken after ages of silence.`,
                                        `A low current rushes outward, brushing past you like a long-held breath finally released.

Beyond the opening, darkness waits - but no longer sealed.

The path forward is open.`,
                                    ]);
                                }
                            ),
                        [
                            `Drawing closer, you notice the seal is not solid - it's a mechanism.

Set into the stone are four massive wheels, stacked vertically, each one able to rotate independently.`,
                            `Their surfaces are etched with worn but recognizable carvings: sharks, crabs, starfish, mermaids, squids, dolphins, and octopus - all arranged in repeating patterns.`,
                            `As you gently turn one, it grinds against the others with a deep, echoing rumble. 

The symbols shift out of alignment, suggesting there's a specific order... a pattern meant to be solved.`,
                        ]
                    );
                } else if (code === 'enter') {
                    const combat = () => {
                        const enemies = 1 + rollDice(2);
                        return startCombatEncounter(
                            sealedCavern,
                            new Array(enemies).fill(0).map(() => createStoneboundSentinel(4)),
                            {
                                onComplete: (rm) => {
                                    sealedCavern.state.requiresCombat = false;
                                    const loot = stoneboundSentinelLootTable.roll(enemies);
                                    return lootRoom(
                                        () =>
                                            resultRoom(
                                                rm,
                                                Quests.getStage('mainQuest') === 'jewel-1-quest'
                                                    ? [
                                                          'You spot a hardened mineral shell, emitting faint pulses as you come near it.',
                                                          'You pick up the Sealed Relic Orb and put it in your pouch.',
                                                          ...(Quests.progress('mainQuest', 'jewel-1-quest') ?? []),
                                                      ]
                                                    : 'You see nothing else of value in the cavern at the moment.'
                                            ),
                                        `After scavenging the area, you find the following items:`,
                                        loot
                                    );
                                },
                            }
                        );
                    };
                    if (sealedCavern.state.requiresCombat) {
                        return resultRoom(
                            () => combat(),
                            [
                                'You enter the cavern slowly.  You do not make it very far in before massive humanoid stone figures emerge from the walls.',
                                'Their bodies are cracked with faint glowing lines, and the stand twice your height.',
                            ],
                            undefined,
                            Mood.battle
                        );
                    }
                }

                return sealedCavern;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north to the crab work yard',
            },
            {
                code: 'travel-east',
                text: 'Go east to the forgotten shrine',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 2)
    .withName(RoomNames.openOcean.sealedCavern)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You arrive at the Sealed Cavern, where the ocean seems to press inward, as if held back by something unseen. 
    
A massive stone barrier blocks the entrance, its surface smooth in some places and deeply carved in others. 

Faint grooves spiral across it, worn by time yet still pulsing with a quiet, ancient energy.`,
    `The water here is unnaturally still - no current, no drift - just a heavy silence that settles around you.

Whatever lies beyond, it has been kept hidden for a very long time.`,
];

const VisitedDescription = <T extends { cavernSealed: boolean }>(
    rm: Room<T>
) => `You are outside a${rm.state.cavernSealed ? ' sealed' : ' once-sealed'} cavern.

${rm.state.cavernSealed ? `A massive stone barrier blocks the entrance.` : `The cavern has been opened and accessible for exploration.`}

To the north, the water grows murkier, leading toward the Crab Work Yards, where shapes move against the seafloor in uneasy patterns.

To the east, the ocean darkens around a cluster of worn stone ruins - the Forgotten Shrine.`;

function startPuzzle(backTo: RoomLike, options: Parameters<typeof createPuzzle>[0], onComplete: RoomLike) {
    const puzzle = createPuzzle(options);
    const currentRotations = puzzle.turnTables.map((x) => x.starting);
    return choiceRoom(
        () =>
            `The stone wheels show the following creatures:\n\n${currentRotations.map((rotation) => puzzle.options[rotation]).join('  ')}`,
        () =>
            currentRotations
                .map((_v, i) => ({
                    code: i.toFixed(),
                    text: `Rotate the ${numberToEnglish(i + 1)} wheel`,
                }))
                .concat(
                    {
                        code: 'check',
                        text: 'Pull lever',
                    },
                    {
                        code: 'back',
                        text: 'Leave the puzzle alone',
                    }
                ),
        (choice, choiceRm) => {
            if (choice === 'back') {
                return backTo;
            } else if (choice === 'check') {
                const correctOptions = currentRotations.filter(
                    (value, index) => puzzle.options[value] === puzzle.turnTables[index].chosen
                ).length;
                return resultRoom(
                    () =>
                        correctOptions === options.turnTables
                            ? onComplete
                            : resultRoom(choiceRm, `You return the lever back to the original position to reset the puzzle.`),
                    [
                        `You pull the lever ${correctOptions === 0 ? `and nothing happens.  You do not seem to have a single wheel in the correct location.` : `and you hear ${correctOptions} ${correctOptions === 1 ? 'click as a single wheel locks' : 'clicks as wheels lock'} into place.`}`,
                    ]
                );
            } else {
                const index = isNaN(+choice) ? null : +choice;
                if (index !== null) {
                    let newRotation = currentRotations[index] + 1;
                    if (newRotation >= puzzle.options.length) {
                        newRotation -= puzzle.options.length;
                    }
                    currentRotations[index] = newRotation;
                }
            }

            return choiceRm;
        }
    );
}

function numberToEnglish(x: number) {
    if (x === 1) return 'first';
    if (x === 2) return 'second';
    if (x === 3) return 'third';
    if (x === 4) return 'fourth';
    if (x === 5) return 'fifth';
    if (x === 6) return 'sixth';
    if (x === 7) return 'seventh';
    if (x === 8) return 'eighth';
    if (x === 9) return 'ninth';
    if (x === 11) return 'tenth';

    if (x % 10 === 1) return x.toFixed() + 'st';
    if (x % 10 === 2) return x.toFixed() + 'nd';
    if (x % 10 === 3) return x.toFixed() + 'rd';
    return x.toFixed() + 'th';
}

function createPuzzle({ turnTables }: { turnTables: number }) {
    const totalOptions = ['Crab', 'Dolphin', 'Octopus', 'Shark', 'Squid', 'Fish', 'Mermaid', 'Starfish']
        .map((x) => ({
            item: x,
            order: rollDice(100),
        }))
        .sort(compare((x) => x.order))
        .map(({ item }) => item);

    const createTurntable = () => {
        const chosen = totalOptions[rollDice(totalOptions.length) - 1];
        const validStarting = totalOptions.filter((x) => x !== chosen);
        const starting = validStarting[rollDice(validStarting.length) - 1];

        return {
            chosen,
            starting: totalOptions.indexOf(starting),
        };
    };

    return {
        options: totalOptions,
        turnTables: new Array(turnTables).fill(null).map(() => createTurntable()),
    };
}
