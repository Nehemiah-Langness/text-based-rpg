import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { startSearchRoom } from '../../search/start-search-room';
import { Mood } from '../moods/mood';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const DeepCoralReef = new Room(
    {},
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.getStage('seaCucumber') === 'find-sea-cucumber') {
            options.push({
                code: 'search-cucumber',
                text: 'Search for striped reef cucumber',
            });
        }

        return {
            options,
            select: (code) => {
                if (code === 'search-cucumber') {
                    return startSearchRoom(rm, {
                        gridSize: 5,
                        maxAttempts: 8,
                        playerStart: { x: 2, y: 2 },
                        onComplete: (rm) =>
                            resultRoom(
                                () => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber'),
                                `You found a striped reef cucumber.`,
                                undefined,
                                Mood.miniGame
                            ),
                        onFailure: (rm) => resultRoom(rm, `You were unable to find the special sea cucumber.`, undefined, Mood.miniGame),
                    });
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-west',
                text: 'Ascend west into the coral reef',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 6)
    .withName(RoomNames.openOcean.deepCoralReef)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The reef tightens around you as you descend deeper, its beauty sharpening into something more intense… and more dangerous.

The coral here grows taller, denser—massive structures twisting upward like spires and jagged crowns, their colors deepening into rich crimsons, dark violets, and glowing blues that pulse faintly in the dim light. The water feels heavier, the currents slower, as if the ocean itself is pressing in.`,
    `Passages narrow into winding corridors between towering formations, forcing you to move carefully. Light struggles to reach this far down, breaking into thin, scattered beams that flicker across the reef in shifting patterns. Shadows cling longer here, stretching between the coral like something alive.

In places, the reef is violently warped—collapsed arches, fused layers of coral, and sudden drops where the seafloor has fallen away. The signs of ancient upheaval are stronger here, as though this was the heart of whatever force once shattered the region.`,
    `Movement catches your eye—then disappears. Something watching. Waiting.

The vibrant life of the upper reef feels distant now.

Down here, the coral still glows…

But it no longer feels welcoming.`,
];

const VisitedDescription = `Tall, dense coral surrounds you in the coral reef.  

High to your west the bright colors of the coral reef shine through the water.`;
