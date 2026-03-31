import type { InputOption } from '../input-option';
import { Nothing } from '../items/nothing';
import { Room } from '../engine/room';

const RoomDescription = `You stand in a grassy clearing atop a gentle hill, the wind whispering through tall blades and scattered wildflowers. The land opens in every direction from here.

To the north, the road slopes toward a small village, where rooftops and chimneys peek above a wooden palisade.

To the east, patchwork fields and a handful of farms stretch across the countryside, their barns and fences glowing warm in the sun.

To the south, the hill drops sharply into a steep descent, where an older, darker forest waits below - its tangled canopy swallowing the light.

To the west, a thick forest rises like a dark wall of trunks and leaves, its shadows deep and quiet.
`;

export const OpenHill = new Room(
    null,
    () => {
        return [RoomDescription];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        }

        options.push(
            {
                text: 'Go north towards the small village',
                code: 'travel-north',
            },
            {
                text: 'Go east to the farms',
                code: 'travel-east',
            },
            {
                text: 'Go south down a steep descent into the dark forest',
                code: 'travel-south',
            },
            {
                text: 'Go west into the thick forest',
                code: 'travel-west',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Nothing.investigationLanguage);
            }
            const traveled = rm.travel(choice);
            if (traveled) return traveled;

            return rm;
        };

        return {
            options: options,
            select: select,
        };
    }
)
    .withInventoryAccess()
    .atLocation('D', 5);
