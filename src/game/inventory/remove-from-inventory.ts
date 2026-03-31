import { Inventory } from './inventory';
import type { Item } from './types/item';

export function removeFromInventory(item: Item, count = 1) {
    Inventory[item].count = Math.max(0, Inventory[item].count - count);
    if (Inventory[item].equipped && Inventory[item].count === 0) {
        Inventory[item].equipped = false;
    }
}
