import type { InputOption } from '../input-option';
import { Nothing } from '../items/nothing';
import { Room } from '../engine/room';

const RoomDescription = `You step into the village square, where packed earth and worn cobblestones meet at the heart of the settlement. Villagers pass through carrying bundles, leading carts, or pausing to talk beside a small well at the center of the square.

A road leads north toward a row of shops and a welcoming inn, their signs creaking gently in the breeze. 

To the east, narrow paths wind between modest houses where the villagers live. 

The sturdy timber building of the guild hall stands to the west, its doors marked with the symbols of local trades. 

To the south, the heavy wooden gates lead back out to the wilds beyond the village walls.`;

export const VillageSquare = new Room(
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
                text: 'Enter guild hall',
                code: 'travel-west',
            },
            {
                text: 'Go north towards the inn and shops',
                code: 'travel-north',
            },
            {
                text: 'Go east to the houses',
                code: 'travel-east',
            },
            {
                text: 'Leave the village',
                code: 'travel-south',
            }
        );

        const select = (choice: string) => {
            rm.visited = true;
            rm.changeIndicator += 1;

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
    .atLocation('B', 5);
