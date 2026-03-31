import { Inventory } from './inventory';
import type { Item } from './types/item';

export function getInventory() {
    return Object.entries(Inventory)
        .filter(([, v]) => v.count > 0)
        .map(([name, state]) => {
            return { name: name as Item, ...state };
        });
}
