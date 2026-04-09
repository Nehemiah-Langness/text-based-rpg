import { rollDice } from '../dice';
import type { InventoryItem, InventoryItemMeta } from './types/inventory-item';

type Category<T> = T extends Record<string, InventoryItem<infer U>> ? U : never;

export class InventorySystem<TInventory extends { [key in keyof TInventory]: InventoryItem<Category<TInventory>> }> {
    items: TInventory;

    constructor(items: TInventory) {
        this.items = items;
    }

    static createInventoryItem<T>(meta: InventoryItemMeta<T> & Partial<InventoryItem<T>>): InventoryItem<T> {
        return {
            count: 0,
            equipped: false,
            ...meta,
        };
    }

    find(item: InventoryItemMeta<Category<TInventory>>) {
        const allItems = Object.entries(this.items) as [keyof TInventory, InventoryItem<Category<TInventory>>][];

        const found = allItems.find(([, inventoryItem]) => inventoryItem === item);
        if (found) {
            return found[0];
        }
        const nameMatch = allItems.filter(([, inventoryItem]) => inventoryItem.name === item.name);
        if (nameMatch.length === 1) {
            return nameMatch[0][0];
        }

        return null;
    }
}

export const Inventory = new InventorySystem({
    polishedShellFragment: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Polished Shell Fragment',
        description: 'A smooth, decorative shell piece',
        vendor: {
            value: 5,
        },
    }),
    crackedPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Cracked Pearl',
        description: 'Slightly flawed but still valuable',
        vendor: {
            value: 7,
        },
    }),
    coralCharm: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Coral Charm',
        description: 'Simple carved coral pendant',
        vendor: {
            value: 10,
        },
    }),
    barnacleCoveredCoin: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Barnacle-Covered Coin',
        description: 'Currency from a lost surface ship',
        vendor: {
            value: 13,
        },
    }),
    wornFinRing: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Worn Fin Ring',
        description: 'Old jewelry with faded engravings',
        vendor: {
            value: 16,
        },
    }),
    luminousPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Luminous Pearl',
        description: 'Emits a soft glow',
        vendor: {
            value: 53,
        },
    }),
    glassBottleMessage: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Glass Bottle Message',
        description: 'Contains partial, cryptic writing',
        vendor: {
            value: 57,
        },
    }),
    engravedCoralIdol: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Engraved Coral Idol',
        description: 'Depicts an unknown ocean figure',
        vendor: {
            value: 62,
        },
    }),
    silverTideBracelet: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Silver Tide Bracelet',
        description: 'Atlantean-crafted jewelry',
        vendor: {
            value: 65,
        },
    }),
    oldNavigationCompass: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Old Navigation Compass',
        description: 'Rusted, but intriguing',
        vendor: {
            value: 72,
        },
    }),
    sharkToothTotem: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Shark Tooth Totem',
        description: 'Tribal artifact, valued by collectors',
        vendor: {
            value: 127,
        },
    }),
    dolphinCrestMedallion: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Dolphin Crest Medallion',
        description: 'Symbol of high rank',
        vendor: {
            value: 142,
        },
    }),
    ancientAtlanteanSigil: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Ancient Atlantean Sigil',
        description: 'Mark of old authority',
        vendor: {
            value: 164,
        },
    }),
    tridentFragment: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Trident Fragment',
        description: 'Broken shard from a ceremonial weapon',
        vendor: {
            value: 173,
        },
    }),
    velmorasInkVial: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: "Velmora's Ink Vial",
        description: 'Still faintly swirling with dark energy',
        vendor: {
            value: 192,
        },
    }),

    sealedOrderRelic: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Silent Order Relic',
        description: 'Marked with symbols of the Silent Order',
        vendor: {
            value: 463,
        },
    }),
    echoPearl: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Echo Pearl',
        description: 'Replays faint voices when held',
        vendor: {
            value: 485,
        },
    }),
    abyssalCoreShard: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Abyssal Core Shard',
        description: 'Pulses with deep-sea energy',
        vendor: {
            value: 489,
        },
    }),
    forgottenCrownPiece: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: 'Forgotten Crown Piece',
        description: 'Fragment of a lost ruler’s crown',
        vendor: {
            value: 512,
        },
    }),
    inkSeersBrokenLens: InventorySystem.createInventoryItem<'trinket'>({
        category: 'trinket',
        name: "Ink-Seer's Broken Lens",
        description: 'Once used by Velmora to "see truth"',
        vendor: {
            value: 531,
        },
    }),
});

class LootTable<TCategory> {
    rolls: { item: InventoryItemMeta<TCategory>; number: { min: number; max: number } }[][];

    constructor(items: { item: InventoryItemMeta<TCategory>; chance: number; number: number | { min: number; max: number } }[][]) {
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

    roll() {
        return this.rolls
            .map((roll) => {
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
            .filter((x) => x !== null);
    }
}

console.log(
    Inventory.find(
        new LootTable([
            [
                {
                    item: Inventory.items.abyssalCoreShard,
                    chance: 3,
                    number: 1,
                },
                {
                    item: Inventory.items.polishedShellFragment,
                    chance: 4,
                    number: 3,
                },
                {
                    item: Inventory.items.forgottenCrownPiece,
                    chance: 1,
                    number: {
                        max: 3,
                        min: 1,
                    },
                },
            ],
        ]).roll()[0].item
    )
);
