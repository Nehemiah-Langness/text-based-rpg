import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { dialogueRoom } from '../utility-rooms/dialogue-room';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const Wastelands = new Room(
    {},
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: () => {
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north to the sacred garden',
            },
            {
                code: 'travel-south',
                text: 'Go south to the coral reef',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'C', 5)
    .withName(RoomNames.openOcean.wastelands)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        if (rm.visited && Quests.getStage('sirensSong') === null) {
            if (rollDice(5) === 3) {
                return sirensSongTrigger(rm);
            }
        }

        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The ocean opens into a vast, empty stretch of seafloor.

The sand here is pale and undisturbed, broken only by the occasional scatter of stone or the faint grooves left by long-passed currents. There is no coral, no kelp - no cover of any kind. The water is startlingly clear, allowing you to see far in every direction, the horizon stretching wide and uninterrupted.`,
    `To the west, the towering walls of the mermaid city rise like a distant barrier, smooth and unyielding, a reminder of safety kept just out of reach.
    
Out here, there is nowhere to hide.

Only distance.

And whatever might choose to cross it.`,
];

const VisitedDescription = `The ocean opens into a vast, empty stretch of seafloor.

To the north, soft light spills outward in gentle waves, marking the Sacred Gardens, their presence calm and distant.

To the south, color begins again as the coral reef rises back into view, vibrant and alive compared to the barren expanse around you.`;

function sirensSongTrigger(backTo: RoomLike) {
    return dialogueRoom(
        backTo,
        [
            `As you move through the barren wasteland, where the ocean feels empty and lifeless, something unexpected breaks the silence...`,
            `A voice.

Soft. Melodic. Beautiful.`,
            `It drifts through the water, weaving between the emptiness like it doesn't belong there.`,
        ],
        {
            'Follow the song': (next) =>
                dialogueRoom(
                    next,
                    [
                        `The melody grows clearer as you swim deeper into the wasteland. The emptiness gives way to a hidden hollow - a quiet basin untouched by the harsh terrain.`,
                        `At its center floats a siren, her presence almost glowing against the dull surroundings. Her voice stops as you approach, but the echo of it lingers in your mind.`,
                        `"So... you heard me," the siren says softly.`,
                    ],
                    {
                        '"Your song... it carried all the way out there."': (next) =>
                            dialogueRoom(
                                next,
                                [`The siren smiles faintly, "It always does. The question is... why did you follow it?`],
                                () => {
                                    const nextRoom = (next: RoomLike) =>
                                        dialogueRoom(
                                            next,
                                            [
                                                `"Most who hear it don't understand what they're seeking."

She slowly circles you, studying you.`,
                                                `"But you're different. You're already tangled in deeper currents."`,
                                            ],
                                            {
                                                '"What are you doing out here?"': (next) =>
                                                    dialogueRoom(
                                                        next,
                                                        [
                                                            `"Waiting... and remembering."

She looks off into the empty distance.`,
                                                            `"My voice isn't what it once was. Something important was taken from me... hidden where I cannot reach," she says trailing into somber silence.`,
                                                        ],
                                                        {
                                                            '"What was taken?"': (next) =>
                                                                resultRoom(
                                                                    () => resultRoom(next, Quests.start('sirensSong')),
                                                                    [
                                                                        `"A Resonant Pearl. It holds the core of my song - without it, I am only an echo."

"The Tidecallers managed to overpower me and took it into their territory to be a part of their relic collection."`,
                                                                        `"Bring it back to me... and I will teach you a song of your own."`,
                                                                    ]
                                                                ),
                                                        }
                                                    ),
                                            }
                                        );

                                    return {
                                        '"I was curious."': nextRoom,
                                        '"I wanted to find you."': nextRoom,
                                        '"I don\'t know... it pulled me in."': nextRoom,
                                    };
                                }
                            ),
                    }
                ),
            'Ignore it': (next) => next,
        }
    );
}
