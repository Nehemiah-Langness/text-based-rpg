import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from '../open-ocean/map';
import { MermaidCityMap } from './map';

export const CityGates = new Room(
    {},
    () => [...VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: (code) => {
                if (code === 'travel-south-custom') {
                    return OpenOceanMap.entrance ?? rm;
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north to the main plaza',
            },
            {
                code: 'travel-south-custom',
                text: 'Leave the city',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'E', 3)
    .withName(RoomNames.mermaidCity.cityGates)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

MermaidCityMap.entrance = CityGates;

const OnEnterDescription = [
    `The city gates rise before you like a boundary between two worlds.

Towering arches of white stone and polished pearl curve upward in sweeping, elegant lines, their surfaces etched with ancient patterns of waves, currents, and guardian figures. Massive columns flank the entrance, each wrapped in sculpted reliefs of mermaid warriors standing against the chaos of the open sea. Soft light gathers along the carvings, giving them an almost living presence.`,
    `Inside the gates, the current is calm, guided, shaped by the city's design. Outside, it churns - darker, colder, and vast. The open ocean stretches endlessly, its depths swallowing light and certainty alike.

A pair of armored guards drift near the entrance, watchful but still, their presence more ceremonial than threatening... yet unmistakably resolute.`,
    `Crossing this boundary feels heavier than it should.

Like stepping out of safety - and into something that does not promise your return.

To the north, the path leads back into the heart of the city, where the main plaza opens in quiet contrast to the wild unknown beyond the gates.`,
];
const VisitedDescription = [
    `The city gates rise before you like a boundary between two worlds.

A pair of armored guards drift near the entrance, watchful but still, their presence more ceremonial than threatening... yet unmistakably resolute.

To the north, the path leads back into the heart of the city, where the main plaza opens in quiet contrast to the wild unknown beyond the gates.`,
];
