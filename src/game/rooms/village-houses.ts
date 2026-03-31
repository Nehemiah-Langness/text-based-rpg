import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { Rock } from '../items/rock';
import { Knowledge } from '../knowledge';
import { Names, NpcNames } from '../npcs/npc-names';
import { Room } from '../engine/room';
import { WizardHouse } from './wizard-house';

const RoomDescription = `You wander into a quiet stretch of the village where small wooden houses stand close together along narrow dirt paths. Gardens and stacked firewood line the walls, and the smell of cooking drifts softly through open windows. A few villagers go about their daily routines, casting curious glances at passing travelers.

${WizardHouse.visited ? (Knowledge.wizardName ? `${NpcNames['Wizard'][Names.FirstName]}'s` : "The wizard's") : 'One'} house stands slightly apart from the other village homes, its tall, narrow structure patched with mismatched stone and timber, as though expanded many times without a plan. The roof is crowned with thin metal rods and spinning vanes that catch the wind even on still days. Above the door hangs a weathered wooden sign, painted with a symbol of a gear encircling a star, gently creaking as it sways.

To the north, the path leads toward the village shops where merchants call out to customers. 

To the west, the road returns to the busy village square, the heart of the settlement.`;

export const VillageHouses = new Room(
    {
        rockLooted: false,
    },
    (rm) => {
        return [RoomDescription, rm.investigated && !rm.state.rockLooted ? Rock.investigationLanguage : null];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                text: `Enter ${WizardHouse.visited ? (Knowledge.wizardName ? `${NpcNames['Wizard'][Names.FirstName]}'s` : "The wizard's") : 'the odd'} house`,
                code: 'travel-east',
            },
        ];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.rockLooted) {
            options.push({
                code: 'loot-rock',
                text: 'Pick up rock',
            });
        }

        options.push(
            {
                text: 'Go north to the shops',
                code: 'travel-north',
            },
            {
                text: 'Go west to the village square',
                code: 'travel-west',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Rock.investigationLanguage);
            } else if (choice === 'loot-rock') {
                rm.state.rockLooted = true;
                return addToInventory('Rock', rm);
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
    .atLocation('B', 6);
