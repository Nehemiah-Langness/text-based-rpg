import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { MermaidCityMap } from '../mermaid-city/map';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const CityOutskirts = new Room(
    {},
    () => VisitedDescription,
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: (code) => {
                if (code === 'travel-north-custom') {
                    return MermaidCityMap.entrance ?? rm;
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north-custom',
                text: 'Enter the city',
            },
            {
                code: 'travel-east',
                text: 'Go east to the coral reef',
            },
            {
                code: 'travel-west',
                text: 'Go west to the forgotten shrine',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 4)
    .withName(RoomNames.openOcean.cityOutskirts)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

OpenOceanMap.entrance = CityOutskirts;

const OnEnterDescription = [
    `The water changes the moment you pass beyond the city gates.

The structured calm of the city gives way to something looser, more unpredictable. Currents shift without warning, carrying faint debris and distant sounds through the open expanse. The light here is dimmer, filtered and uneven, as if the ocean itself is less willing to reveal what lies ahead.`,
    `Behind you, the city stands tall and radiant - its pale towers glowing softly in the distance, a clear line between safety and the unknown.

Out here, there are no walls.`,
    `To the east, color begins to return to the water as the Coral Reef rises in layered formations, alive with movement and subtle light.

To the west, the ocean darkens around a cluster of worn stone ruins - the Forgotten Shrine. Its shape is barely visible through the shifting water, old and still, like something waiting to be remembered.

Between them, you hover in open ocean.

Exposed.

And for the first time, truly alone.`,
];

const VisitedDescription = `You are outside the city gates in the open ocean.

To the east, the Coral Reef rises in layered formations, alive with movement and subtle light.

To the west, the ocean darkens around a cluster of worn stone ruins - the Forgotten Shrine.`;
