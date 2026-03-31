import { getEquippedByCategory } from './get-equipped-by-category';
import { isCategory } from './is-category';
import { Categories } from './lists/categories';
import type { EquipmentCategory } from './types/equipment-category';
import type { Item } from './types/item';

export function shouldEquipByCategory<T extends EquipmentCategory>(category: T, code: Item) {
    if (!isCategory(category, code)) return false;
    const equipped = getEquippedByCategory(category);
    return !equipped || equipped.tier < (Categories[category] as readonly string[]).indexOf(code as string);
}
