import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const Shops = new Room(
    {},
    () => [...VisitedDescription],
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
                text: "Go north to Fred's Fish Fry",
            },
            {
                code: 'travel-east',
                text: 'Go east to the main plaza',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'D', 2)
    .withName(RoomNames.mermaidCity.shops)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The water brightens as you drift into the shopping district, the steady quiet of the city giving way to a lively, flowing bustle.

Curved walkways of pale stone weave between open-front shops carved into the surrounding structures, their entrances framed with colorful coral and hanging strands of sea silk. Lanterns of soft gold and blue light sway gently overhead, reflecting off polished shells and glass displays filled with trinkets, tools, and shimmering fabrics that ripple with every passing current.`,
    `Merchants call out to passersby, their voices blending into a constant, rhythmic murmur. A jeweler carefully sets a pearl into a delicate band. Nearby, a vendor arranges bundles of dried kelp and rare sea herbs. Schools of tiny fish dart between stalls, flashing like living decorations.

To the north, the warm, familiar glow of Fred's Fish Fry cuts through the cooler tones of the district, its worn exterior standing apart from the more refined shops.

To the east, the space opens back into the grand expanse of the main plaza, where the city's towers rise and the crowd thins into something quieter, more watchful.

Here, the city feels alive - busy, colorful, and just a little chaotic.`,
];

const VisitedDescription = [
    `The water brightens as you drift into the shopping district.`,
    `To the north, the warm, familiar glow of Fred's Fish Fry cuts through the cooler tones of the district`,
    `To the east, the space opens back into the grand expanse of the main plaza`,
];
