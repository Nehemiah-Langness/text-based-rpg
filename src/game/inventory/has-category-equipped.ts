import { Inventory } from './inventory';
import { Categories } from './lists/categories';
import type { EquipmentCategory } from './types/equipment-category';

export function hasCategoryEquipped<T extends EquipmentCategory>(category: T) {
    return Categories[category].some((item) => Inventory[item].count > 0 && Inventory[item].equipped);
}
