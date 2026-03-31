import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { LargeStick } from '../items/large-stick';
import { Knowledge } from '../knowledge';
import { Room } from '../engine/room';

const RoomDescription =
    () => `You stand on a narrow dirt path winding through a quiet forest. Tall trees crowd close together, their branches forming a green canopy overhead. Shafts of light break through the leaves, dappling the ground with shifting patterns. The air smells of moss and damp earth.

The path bends here${Knowledge.pathToPond ? ' but you can spot broken branches and stomped foliage suggesting someone regularly pushes through to the west there.' : ''}.

To the east, the trail widens slightly as it leads toward what appears to be a small village on a hill.

To the south, the ground slopes gently downward, bending between thick clusters of ferns and low shrubs and leading into a clearing.`;

export const ThickForest = new Room(
    {
        stickLooted: false,
    },
    (rm) => {
        return [RoomDescription(), rm.investigated && !rm.state.stickLooted ? LargeStick.investigationLanguage : null];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.stickLooted) {
            options.push({
                code: 'loot-stick',
                text: 'Pick up stick',
            });
        }

        options.push(
            {
                text: 'Go east towards the village',
                code: 'travel-east',
            },
            {
                text: 'Go south to the clearing',
                code: 'travel-south',
            }
        );

        if (Knowledge.pathToPond) {
            options.push({
                text: 'Push the the forest towards the west',
                code: 'travel-west',
            });
        }

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(LargeStick.investigationLanguage);
            } else if (choice === 'loot-stick') {
                rm.state.stickLooted = true;
                return addToInventory('Large Stick', rm);
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
    .atLocation('D', 4);
