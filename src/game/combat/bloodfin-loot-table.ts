import { Inventory } from '../inventory';
import { Prices } from '../prices';
import { withValueInRange } from '../utility-functions/with-value-in-range';

export const bloodFinLootTable = Inventory.createLootTable([
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: Prices.get('trinketBase', 0),
                max: Prices.get('trinketBase', 1.5),
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 3,
        })),
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: Prices.get('trinketBase', 1),
                max: Prices.get('trinketBase', 2.5),
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 2,
        })),
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: Prices.get('trinketBase', 2),
                max: Prices.get('trinketBase', 3.5),
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        })),
    Inventory.getCategory('food').map(({ key }) => ({
        chance: 1,
        item: key,
        number: 1,
    })),
    Inventory.getCategory('food').map(({ key }) => ({
        chance: 1,
        item: key,
        number: 1,
    })),
    Inventory.getCategory('food').map(({ key }) => ({
        chance: 1,
        item: key,
        number: 1,
    })),
]);
