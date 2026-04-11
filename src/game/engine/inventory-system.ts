import type { Category } from './category';
import type { InventoryItem, InventoryItemMeta } from '../inventory/types/inventory-item';
import type { Entity } from './entity';
import { LootTable, type LootTableRolls } from '../inventory/loot-table';

export class InventorySystem<
    TInventory extends {
        [key in keyof TInventory]: InventoryItem<Category<TInventory>>;
    },
> {
    items: TInventory;

    constructor(items: TInventory) {
        this.items = items;
    }

    save() {
        return this.items;
    }

    load(data: Partial<TInventory>) {
        Object.assign(this.items, data);
    }

    add(key: keyof TInventory, amount: number) {
        const item = this.get(key);
        item.count += amount;
    }

    get(key: keyof TInventory) {
        return this.items[key];
    }

    equip(key: keyof TInventory) {
        const item = this.get(key);
        if (item.equippable) {
            this.unEquipCategory(item.category, item.equippable.subCategory);
            item.equipped = true;
        }

        return item;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    consume(key: keyof TInventory, entity: Entity<any>) {
        const item = this.get(key);
        if (item.consumable) {
            if (item.count > 0) {
                item.count -= 1;
                const healed = item.consumable.health ? entity.heal(item.consumable.health) : 0;
                const energized = item.consumable.stamina ? entity.energize(item.consumable.stamina) : 0;
                if (item.consumable.effects) {
                    entity.addModifier(...item.consumable.effects);
                }
                const effects = item.consumable.effects ?? [];

                return {
                    healed,
                    energized,
                    effects,
                    text: item.consumable.text,
                };
            }
        }

        return {};
    }

    unEquipCategory(category: Category<TInventory>, subCategory?: string) {
        this.list()
            .filter(
                (x) => x.item.equippable && x.item.category === category && (!subCategory || x.item.equippable?.subCategory === subCategory)
            )
            .forEach((x) => (x.item.equipped = false));
    }

    static createInventoryItem<T>(meta: InventoryItemMeta<T> & Partial<InventoryItem<T>>): InventoryItem<T> {
        return {
            count: 0,
            equipped: false,
            ...meta,
        };
    }

    list(filter?: (item: InventoryItem<Category<TInventory>>) => boolean) {
        return (Object.entries(this.items) as [keyof TInventory, InventoryItem<Category<TInventory>>][])
            .map((x) => ({
                key: x[0],
                item: x[1],
            }))
            .filter((x) => filter?.(x.item) ?? true);
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

    createLootTable(items: LootTableRolls<InventorySystem<TInventory>>) {
        return new LootTable<InventorySystem<TInventory>>(items);
    }
}
