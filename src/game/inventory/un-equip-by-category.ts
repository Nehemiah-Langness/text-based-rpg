import { getInventory } from './get-inventory';
import { Inventory } from './inventory';
import { isCategory } from './is-category';
import type { EquipmentCategory } from './types/equipment-category';

export function unEquipByCategory(category: EquipmentCategory) {
    getInventory()
        .filter((x) => x.equipped && isCategory(category, x.name))
        .forEach((item) => {
            Inventory[item.name].equipped = false;
        });
}
