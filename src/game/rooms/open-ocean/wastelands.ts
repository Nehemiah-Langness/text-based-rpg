import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
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
                code: 'travel-east',
                text: 'Go south to shark territory',
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

To the east, the emptiness shifts subtly - dark shapes in the distance, slow-moving and deliberate. Shark territory.

To the south, color begins again as the coral reef rises back into view, vibrant and alive compared to the barren expanse around you.
`;
