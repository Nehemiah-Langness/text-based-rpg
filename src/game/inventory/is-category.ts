import { Categories } from './lists/categories';
import type { EquipmentCategory } from './types/equipment-category';
import type { Item } from './types/item';

export function isCategory<T extends EquipmentCategory>(category: T, item: Item): item is (typeof Categories)[T][number] {
    return (Categories[category] as readonly string[]).includes(item);
}
