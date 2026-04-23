import { Inventory } from '../inventory';
import { Prices } from '../prices';
import { withValueInRange } from '../utility-functions/with-value-in-range';

export const tidecallerLootTable = Inventory.createLootTable([
    ...new Array(2).fill(0).map(() =>
        Inventory.getCategory('trinket')
            .filter(
                withValueInRange({
                    min: Prices.get('trinketBase', 0),
                    max: Prices.get('trinketBase', 2),
                })
            )
            .map(({ key }) => ({
                chance: 1,
                item: key,
                number: 1,
            }))
    ),
    ...new Array(3).fill(0).map(() =>
        Inventory.getCategory('trinket')
            .filter(
                withValueInRange({
                    min: Prices.get('trinketBase', 1),
                    max: Prices.get('trinketBase', 3),
                })
            )
            .map(({ key }) => ({
                chance: 1,
                item: key,
                number: 1,
            }))
    ),
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
            number: 1,
        })),
    ...new Array(2).fill(0).map(() =>
        Inventory.getCategory('food').map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        }))
    ),
    ...new Array(3).fill(0).map(() =>
        Inventory.getCategory('food-fine').map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        }))
    ),
]);
