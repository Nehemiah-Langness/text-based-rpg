import { Inventory } from './inventory';
import { Categories } from './lists/categories';
import type { EquipmentCategory } from './types/equipment-category';

export function hasItemInCategory<T extends EquipmentCategory>(category: T) {
    return Categories[category].some((item) => Inventory[item].count > 0);
}
