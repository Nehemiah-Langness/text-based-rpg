import type { Category } from './category';
import type { InventoryItem, InventoryItemMeta } from '../inventory/types/inventory-item';
import { LootTable, type LootTableRolls } from '../inventory/loot-table';
import type { PlayerEntity } from './player-entity';
import { Prices } from '../prices';
import type { SkillModifier } from './skill-set';

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

    areEquippableConstraintsMet(item: InventoryItem<Category<TInventory>>) {
        if (!item.equippable) return false;
        const requirements = item.equippable.requirement;
        if (!requirements) return true;

        return this.list(
            (item) =>
                item.category === requirements.category &&
                (!requirements.subCategory || requirements.subCategory === item.equippable?.subCategory)
        ).some(({ item }) => item.count > 0 && (requirements.type === 'has' || item.equipped));
    }

    private validateEquipment(entity: PlayerEntity) {
        const unequippedItems: InventoryItem<Category<TInventory>>[] = [];
        this.list((item) => item.equipped).forEach(({ item, key }) => {
            if (!this.areEquippableConstraintsMet(item)) {
                unequippedItems.push(this.unEquip(key, entity));
            }
        });
        return unequippedItems;
    }

    equip(key: keyof TInventory, entity: PlayerEntity) {
        const item = this.get(key);
        if (this.areEquippableConstraintsMet(item)) {
            this.unEquipCategory(item.category, item.equippable?.subCategory, entity);
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

        this.validateEquipment(entity);

        return item;
    }

    consume(key: keyof TInventory, entity: PlayerEntity) {
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

    unEquip(key: keyof TInventory, entity: PlayerEntity) {
        const item = this.get(key);
        if (item.equipped) {
            item.equipped = false;

            if (item.equippable?.health) {
                entity.health.max -= item.equippable.health;
                entity.health.current = Math.max(0, entity.health.current - item.equippable.health);
            }
            if (item.equippable?.speed) {
                entity.speed -= item.equippable.speed;
            }
            if (item.equippable?.strength) {
                entity.strength -= item.equippable.strength;
            }
            if (item.equippable?.stamina) {
                entity.stamina.max -= item.equippable.stamina;
                entity.stamina.current = Math.max(0, entity.stamina.current - item.equippable.stamina);
            }
        }

        this.validateEquipment(entity);

        return item;
    }

    unEquipCategory(category: Category<TInventory>, subCategory: undefined | string, entity: PlayerEntity) {
        this.list()
            .filter(
                (x) => x.item.equippable && x.item.category === category && (!subCategory || x.item.equippable?.subCategory === subCategory)
            )
            .forEach((x) => {
                this.unEquip(x.key, entity);
            });
    }

    static createInventoryItem<T>(
        meta: Omit<InventoryItemMeta<T>, 'vendor'> & { vendor?: Partial<InventoryItemMeta<T>['vendor']> } & Partial<{
                count: number;
                equipped: boolean;
            }>
    ): InventoryItem<T> {
        return {
            count: 0,
            equipped: false,
            ...meta,
            vendor: meta.vendor
                ? {
                      ...meta.vendor,
                      value: meta.vendor.value ?? this.calculatePrice(meta),
                  }
                : undefined,
        };
    }

    private static calculatePrice<T>(item: Omit<InventoryItemMeta<T>, 'vendor'>) {
        return Prices.getCombination([
            item.category === 'enchantment'
                ? {
                      amount: 1,
                      category: 'enchantment' as const,
                  }
                : null,
            item.category === 'armor'
                ? {
                      amount: 1,
                      category: 'armor' as const,
                  }
                : null,
            item.consumable?.health
                ? {
                      amount: item.consumable.health,
                      category: 'health' as const,
                  }
                : null,
            item.consumable?.stamina
                ? {
                      amount: item.consumable.stamina,
                      category: 'stamina' as const,
                  }
                : null,
            ...(item.consumable?.effects?.flatMap((effect) => [
                {
                    amount: effect.duration,
                    category: (['health-regen-low', 'stamina-regen-low'] as SkillModifier[]).includes(effect.effect)
                        ? ('effectLow' as const)
                        : (
                                [
                                    'alert',
                                    'distract',
                                    'health-regen-med',
                                    'speed',
                                    'stamina-regen-med',
                                    'strength',
                                    'stun',
                                ] as SkillModifier[]
                            ).includes(effect.effect)
                          ? ('effectMed' as const)
                          : (['health-regen-high', 'stamina-regen-high'] as SkillModifier[]).includes(effect.effect)
                            ? ('effectHigh' as const)
                            : ('effectHigh' as const),
                },
                {
                    amount: ['health-regen-low', 'stamina-regen-low'].includes(effect.effect)
                        ? 5
                        : ['alert', 'distract', 'health-regen-med', 'speed', 'stamina-regen-med', 'strength', 'stun'].includes(
                                effect.effect
                            )
                          ? 10
                          : ['health-regen-high', 'stamina-regen-high'].includes(effect.effect)
                            ? 20
                            : 20,
                    category: (['health-regen-low', 'health-regen-med', 'health-regen-high'] as SkillModifier[]).includes(effect.effect)
                        ? ('health' as const)
                        : (['stamina-regen-low', 'stamina-regen-med', 'stamina-regen-high'] as SkillModifier[]).includes(effect.effect)
                          ? ('stamina' as const)
                          : (['alert', 'distract', 'stun'] as SkillModifier[]).includes(effect.effect)
                            ? ('combatAdvantage' as const)
                            : (['speed'] as SkillModifier[]).includes(effect.effect)
                              ? ('speed' as const)
                              : (['strength'] as SkillModifier[]).includes(effect.effect)
                                ? ('strength' as const)
                                : ('effectLow' as const),
                },
            ]) ?? []),
            item.equippable?.defense
                ? {
                      amount: item.equippable.defense,
                      category: 'defense',
                  }
                : null,
            item.equippable?.health
                ? {
                      amount: item.equippable.health,
                      category: 'maxHealth',
                  }
                : null,
            item.equippable?.speed
                ? {
                      amount: item.equippable.speed,
                      category: 'speed',
                  }
                : null,
            item.equippable?.stamina
                ? {
                      amount: item.equippable.stamina,
                      category: 'maxStamina',
                  }
                : null,
            item.equippable?.strength
                ? {
                      amount: item.equippable.strength,
                      category: 'strength',
                  }
                : null,
        ]);
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
