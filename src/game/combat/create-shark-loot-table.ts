import { Inventory } from '../inventory';
import { Prices } from '../prices';
import { withValueInRange } from '../utility-functions/with-value-in-range';

export function createSharkLootTable(level: number) {
    const maxLevel = 10;
    const overflow = Math.max(0, level - maxLevel);
    const getCount = (tier: number) => Math.floor((maxLevel - Math.max(0, tier * 2 - level)) / 2)

    return Inventory.createLootTable([
        ...new Array(getCount(0)).fill(null).map(() =>
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
                    number: 1,
                }))
        ),
        ...new Array(getCount(1)).fill(null).map(() =>
            Inventory.getCategory('trinket')
                .filter(
                    withValueInRange({
                        min: Prices.get('trinketBase', 0.5),
                        max: Prices.get('trinketBase', 2),
                    })
                )
                .map(({ key }) => ({
                    chance: 1,
                    item: key,
                    number: 1,
                }))
        ),
        ...new Array(getCount(2)).fill(null).map(() =>
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
                    number: 1,
                }))
        ),
        ...new Array(getCount(3)).fill(null).map(() =>
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
                }))
        ),
        ...new Array(getCount(4)).fill(null).map(() =>
            Inventory.getCategory('trinket')
                .filter(
                    withValueInRange({
                        min: Prices.get('trinketBase', 3),
                        max: Prices.get('trinketBase', 5),
                    })
                )
                .map(({ key }) => ({
                    chance: 1,
                    item: key,
                    number: 1 + overflow,
                }))
        ),
        ...new Array(getCount(5)).fill(null).map(() =>
            Inventory.getCategory('food-fine')
                .map(({ key }) => ({
                    chance: 1,
                    item: key,
                    number: 1,
                }))
        ),
    ]);
}
