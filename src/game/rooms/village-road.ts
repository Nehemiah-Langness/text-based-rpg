import type { InputOption } from '../input-option';
import { Nothing } from '../items/nothing';
import { Room } from '../engine/room';

const RoomDescription = `You follow the road north of the village square, where the dirt path widens into a modest marketplace street. Wooden signboards sway overhead, and the sound of conversation and trade fills the air.

To the west, a sturdy roadside inn offers warmth, food, and a place for weary travelers to rest. 

To the east, a row of shops displays tools, supplies, and other goods useful to anyone passing through the village. 

To the south, the road leads back to the village square.`;

export const VillageRoad = new Room(
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
                text: 'Enter the inn',
                code: 'travel-west',
            },
            {
                text: 'Go east to the shops',
                code: 'travel-east',
            },
            {
                text: 'Go south to the village square',
                code: 'travel-south',
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
    .atLocation('A', 5);
