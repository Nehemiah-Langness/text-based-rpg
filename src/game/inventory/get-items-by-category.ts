import { Inventory } from './inventory';
import { isCategory } from './is-category';
import type { EquipmentCategories } from './types/equipment-categories';
import type { EquipmentCategory } from './types/equipment-category';
import type { Item } from './types/item';

export function getItemsByCategory<T extends EquipmentCategory>(category: T): Item[] {
    return Object.entries(Inventory)
        .filter(([item, data]) => {
            return data.count > 0 && isCategory(category, item as Item);
        })
        .map(([item]) => item as EquipmentCategories[T][number]);
}
