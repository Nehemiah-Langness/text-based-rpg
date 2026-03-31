import type { InputOption } from '../input-option';
import { Nothing } from '../items/nothing';
import { progressQuest } from '../quests';
import { Room } from '../engine/room';
import { foragingRoom } from './utility-rooms/foraging-room';

const RoomDescription = `You stand within a stretch of light woodland where thin-trunked trees grow with enough space between them for sunlight to reach the forest floor. Patches of grass and low shrubs break through the fallen leaves, and the air carries the faint scent of sap and soil. 

Through the trees to the north, the woods thin further, revealing the open farmlands beyond. 

In every other direction, the forest quickly thickens, the trees crowding closer together until the undergrowth becomes dense and shadowed.`;

export const Woodlands = new Room(
    {
        timesForaged: 0,
    },
    () => {
        return [RoomDescription, progressQuest('forage', 1)];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'forage',
                text: 'Forage',
            },
        ];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        }

        options.push({
            text: 'Go north to the farmlands',
            code: 'travel-north',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Nothing.investigationLanguage);
            } else if (choice === 'forage') {
                return foragingRoom(rm);
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
    .atLocation('E', 6);
