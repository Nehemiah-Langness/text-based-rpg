import { rollDice } from '../dice';
import type { InventoryKey } from '../engine/category';

export type LootTableRolls<TInventory> = {
    item: InventoryKey<TInventory>;
    chance: number;
    number: number | { min: number; max: number };
}[][];

export class LootTable<TInventory> {
    private rolls: { item: InventoryKey<TInventory>; number: { min: number; max: number } }[][];

    constructor(items: LootTableRolls<TInventory>) {
        this.rolls = items.map((rolls) => {
            return rolls
                .flatMap((roll) => {
                    return new Array(roll.chance).fill({
                        item: roll.item,
                        number:
                            typeof roll.number === 'number'
                                ? {
                                      min: roll.number,
                                      max: roll.number,
                                  }
                                : roll.number,
                    });
                })
                .sort(() => (rollDice(20) <= 10 ? -1 : 1));
        });
    }

    roll(times = 1) {
        return Object.entries(
            new Array(times)
                .fill(0)
                .flatMap(() =>
                    this.rolls.map((roll) => {
                        const rolledItem = roll[rollDice(roll.length) - 1];
                        if (!rolledItem) return null;
                        const count = Math.min(
                            rolledItem.number.max,
                            rollDice(rolledItem.number.max - rolledItem.number.min) + rolledItem.number.min
                        );
                        return {
                            item: rolledItem.item,
                            count,
                        };
                    })
                )
                .filter((x) => x !== null)
                .reduce(
                    (c, n) => ({
                        ...c,
                        [n.item]: (c[n.item] ?? 0) + n.count,
                    }),
                    {} as Record<InventoryKey<TInventory>, number>
                )
        ).map(([key, count]) => ({
            item: key as InventoryKey<TInventory>,
            count: count as number,
        }));
    }
}
