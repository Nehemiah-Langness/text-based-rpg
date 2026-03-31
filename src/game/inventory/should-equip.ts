import { isCategory } from './is-category';
import { EquippableCategories } from './lists/equippable-categories';
import { shouldEquipByCategory } from './should-equip-by-category';
import type { Item } from './types/item';

export function shouldEquip(item: Item) {
    return EquippableCategories.filter((category) => isCategory(category, item)).some((category) => shouldEquipByCategory(category, item));
}
