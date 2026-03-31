import { Inventory } from './inventory';
import { isCategory } from './is-category';
import { EquippableCategories } from './lists/equippable-categories';
import type { Item } from './types/item';
import { unEquipByCategory } from './un-equip-by-category';

export function equipItem(item: Item) {
    if (Inventory[item].count < 1) return false;

    EquippableCategories.concat('weapons').forEach((category) => {
        if (isCategory(category, item)) {
            unEquipByCategory(category);
        }
    });

    Inventory[item].equipped = true;
    return true;
}
