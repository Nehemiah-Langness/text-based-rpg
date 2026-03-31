import { Inventory } from './inventory';
import type { Item } from './types/item';

export function getItemsEquipped(): Item[] {
    return Object.entries(Inventory)
        .filter(([, data]) => {
            return data.count > 0 && data.equipped;
        })
        .map(([item]) => item as Item);
}
