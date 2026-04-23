import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { TravelOption } from '../../engine/travel-options';
import type { InputOption } from '../../input-option';
import { Velrix } from '../../npcs/velrix';
import { Quests } from '../../quests';
import { Mood } from '../moods/mood';
import { RoomNames } from '../names';
import { choiceRoom } from '../utility-rooms/choice-room';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

function generateMaze(length: number, onComplete: RoomLike, back: RoomLike) {
    const validDirections: TravelOption[] = ['travel-north', 'travel-east', 'travel-south', 'travel-west'];
    const opposites: Record<TravelOption, TravelOption> = {
        'travel-east': 'travel-west',
        'travel-west': 'travel-east',
        'travel-north': 'travel-south',
        'travel-south': 'travel-north',
    };
    let currentDirection: TravelOption = 'travel-north';
    const path = new Array(length).fill(null).map(() => {
        const currentDirections = validDirections.filter((option) => option !== opposites[currentDirection]);
        const nextDirection = currentDirections[rollDice(currentDirections.length) - 1];
        currentDirection = nextDirection;
        return {
            correct: nextDirection,
            options: currentDirections,
        };
    });
    console.log(path);

    function getRoom(index: number): Room {
        const currentPathOptions = path[index];
        return choiceRoom(
            `Murky water surrounds you in all directions.`,
            currentPathOptions.options
                .map((option) => ({
                    code: option as string,
                    text: `Go ${option.split('-')[1]}`,
                }))
                .concat({
                    code: 'leave',
                    text: 'Escape the murky depths',
                }),
            (choice) => {
                if (choice === 'leave') {
                    return back;
                } else if (choice === currentPathOptions.correct) {
                    if (index + 1 === length) {
                        return onComplete;
                    } else {
                        return resultRoom(
                            getRoom(index + 1),
                            `You swim forward into the depths, hopefully towards some unseen safety.`,
                            undefined,
                            Mood.miniGame
                        );
                    }
                }
                return resultRoom(
                    getRoom(0),
                    `You seem to have gone in circles and ended up right back to where you ended up.`,
                    undefined,
                    Mood.miniGame
                );
            }
        ).withColor(Mood.miniGame);
    }

    return getRoom(0);
}

export const DarkWaters = new Room(
    {
        velrixDiscovered: false,
    },
    (rm) => [VisitedDescription(rm)],
    (rm) => {
        const options: InputOption[] = [];

        if (!rm.state.velrixDiscovered && Quests.getStage('mainQuest') === 'find-jewel-1') {
            options.push({
                code: 'go-deeper',
                text: 'Go deeper into the dark waters',
            });
        }

        return {
            options,
            select: (code) => {
                if (code === 'go-deeper') {
                    return generateMaze(
                        5,
                        () => {
                            rm.state.velrixDiscovered = true;
                            Velrix.move(rm);
                            return resultRoom(rm, [
                                `A faint glow begins breaking through the grim depths.  You follow the glow and find a hidden cavern pocket, untouched by the dark currents of the surrounding ocean.`,
                                `Inside, are many piles of relics, bones, tools, and trinkets.
                            
A deep-sea octopus sits at the center, surrounded by his treasures.`,
                            ]);
                        },
                        rm
                    );
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-south',
                text: 'Go south to the forgotten shrine',
            },
            {
                code: 'travel-west',
                text: 'Go west to crab work yards',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'C', 3)
    .withName(RoomNames.openOcean.darkWaters)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You slip into the dark waters, and the ocean seems to swallow you whole. 
    
Light fades rapidly, replaced by a dim, shifting gloom where shadows stretch farther than they should.`,
    `The water feels heavier here, colder - each movement slowed as if the depths themselves are resisting you.

Faint glimmers flicker in the distance, bioluminescent life or something... else.`,
    `The silence is deep, broken only by the distant creak of unseen currents and the subtle sense that you are no longer alone.

Something hidden waits in these depths.`,
];

const VisitedDescription = (
    rm: Room<{ velrixDiscovered: boolean }>
) => `${rm.state.velrixDiscovered ? `You are sheltered from the murky depths of the dark waters by the small, lit cavern filled with curios.` : `You are in the dark waters. Faint glimmers flicker in the distance, but otherwise there is only dim, shifting gloom around you.`}

To the south, a faint, familiar glow marks the direction of the Forgotten Shrine.

To the west, the water grows murkier, leading toward the Crab Work Yards, where shapes move against the seafloor in uneasy patterns.${Quests.getStage('mainQuest') === 'find-jewel-1' && !rm.state.velrixDiscovered ? '\n\nYour compass points deeper into the murky waters.' : ''}`;
