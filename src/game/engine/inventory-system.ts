import type { Category } from './category';
import type { InventoryItem, InventoryItemMeta } from '../inventory/types/inventory-item';
import type { Entity } from './entity';
import { LootTable, type LootTableRolls } from '../inventory/loot-table';
import type { PlayerEntity } from './player-entity';

export type InventoryConstraint<TInventory> = {
    [key in keyof TInventory]: InventoryItem<Category<TInventory>>;
};

export class InventorySystem<TInventory extends InventoryConstraint<TInventory>> {
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

    getCategory(category: Category<TInventory>) {
        return this.list((item) => item.category === category);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    equip(key: keyof TInventory, entity: PlayerEntity<any>) {
        const item = this.get(key);
        if (item.equippable) {
            this.unEquipCategory(item.category, item.equippable.subCategory, entity);
            if (!item.equipped) {
                item.equipped = true;

                if (item.equippable?.health) {
                    entity.health.max += item.equippable.health;
                    entity.health.current += item.equippable.health;
                }
                if (item.equippable?.speed) {
                    entity.speed += item.equippable.speed;
                }
                if (item.equippable?.strength) {
                    entity.strength += item.equippable.strength;
                }
                if (item.equippable?.stamina) {
                    entity.stamina.max += item.equippable.stamina;
                    entity.stamina.current += item.equippable.stamina;
                }
            }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unEquipCategory(category: Category<TInventory>, subCategory: undefined | string, entity: PlayerEntity<any>) {
        this.list()
            .filter(
                (x) => x.item.equippable && x.item.category === category && (!subCategory || x.item.equippable?.subCategory === subCategory)
            )
            .forEach((x) => {
                if (x.item.equipped) {
                    x.item.equipped = false;

                    if (x.item.equippable?.health) {
                        entity.health.max -= x.item.equippable.health;
                        entity.health.current = Math.max(0, entity.health.current - x.item.equippable.health);
                    }
                    if (x.item.equippable?.speed) {
                        entity.speed -= x.item.equippable.speed;
                    }
                    if (x.item.equippable?.strength) {
                        entity.strength -= x.item.equippable.strength;
                    }
                    if (x.item.equippable?.stamina) {
                        entity.stamina.max -= x.item.equippable.stamina;
                        entity.stamina.current = Math.max(0, entity.stamina.current - x.item.equippable.stamina);
                    }
                }
            });
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
