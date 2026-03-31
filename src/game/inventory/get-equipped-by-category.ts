import { getInventory } from './get-inventory';
import { Categories } from './lists/categories';
import type { EquipmentCategories } from './types/equipment-categories';
import type { EquipmentCategory } from './types/equipment-category';

export function getEquippedByCategory<T extends EquipmentCategory>(category: T) {
    return getInventory()
        .map((weapon) => ({
            tier: (Categories[category] as readonly string[]).indexOf(weapon.name),
            equipped: weapon.equipped,
            item: weapon.name as EquipmentCategories[T][number],
        }))
        .filter((x) => x.equipped && x.tier >= 0)
        .reduce(
            (c, n) => (c === null || n.tier > c.tier ? n : c),
            null as { tier: number; equipped: boolean; item: EquipmentCategories[T][number] } | null
        );
}
