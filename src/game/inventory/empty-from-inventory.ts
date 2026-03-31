import { Inventory } from './inventory';
import { removeFromInventory } from './remove-from-inventory';
import type { Item } from './types/item';

export function emptyFromInventory(...items: Item[]) {
    items.forEach((item) => {
        removeFromInventory(item, Inventory[item].count);
    });
}
