import { Inventory } from './inventory';
import { isCategory } from './is-category';
import { removeFromInventory } from './remove-from-inventory';
import { AmmoTable } from './tables/ammo-table';
import type { Item } from './types/item';

export function shootRangeWeapon(item: Item) {
    if (!isCategory('rangeWeapons', item)) return false;

    const ammo = AmmoTable[item];
    if (Inventory[ammo].count > 0) {
        removeFromInventory(ammo);
        return ammo;
    }

    return false;
}
