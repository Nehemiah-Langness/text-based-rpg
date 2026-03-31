import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { Room } from '../engine/room';
import { armorShop } from './shops/armor-shop';
import { generalStore } from './shops/general-store';
import { weaponShop } from './shops/weapon-shop';

const RoomDescription = `You arrive at a row of sturdy wooden shops along the village road, their signs hanging above the doors and creaking softly in the breeze. The street smells of oiled leather, polished steel, and the mixed scents of goods from distant places.

Three merchants run their trade here. One shop displays suits of armor - leather vests, steel plate armor, and sturdy shields hanging along the walls. 

Another specializes in weapons, with blades, spears, and bows carefully arranged behind a heavy counter. 

The third is a general store, packed with everyday supplies, travel gear, and useful odds and ends for adventurers passing through the village.

To the west is a road leading to a welcoming inn and the village square.

To the south, smoke rises from the chimneys of many modest houses.`;

export const VillageShops = new Room(
    {
        bandageLooted: false,
    },
    (rm) => {
        return [
            RoomDescription,
            rm.investigated && !rm.state.bandageLooted ? 'An unused bandage lays on the ground, discarded by the shop walls.' : '',
        ];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else {
            if (!rm.state.bandageLooted) {
                options.push({
                    code: 'loot-bandage',
                    text: 'Pick up bandage',
                });
            }
        }

        options.push(
            {
                text: 'Enter armor shop',
                code: 'shop-armor',
            },
            {
                text: 'Enter weapon shop',
                code: 'shop-weapon',
            },
            {
                text: 'Enter general store',
                code: 'shop-general',
            },
            {
                text: 'Go west towards the inn',
                code: 'travel-west',
            },
            {
                text: 'Go south to the houses',
                code: 'travel-south',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate('You spot a (thankfully) unused bandage rolled up an discarded by one of the shop walls.');
            } else if (choice === 'loot-bandage') {
                rm.state.bandageLooted = true;
                return addToInventory('Bandage', rm);
            } else if (choice === 'shop-general') {
                return generalStore(rm);
            } else if (choice === 'shop-armor') {
                return armorShop(rm);
            } else if (choice === 'shop-weapon') {
                return weaponShop(rm);
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
    .atLocation('A', 6);
