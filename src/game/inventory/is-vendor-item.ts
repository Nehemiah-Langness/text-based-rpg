import { isCategory } from './is-category';
import type { Item } from './types/item';
import type { VendorItem } from './types/vendor-item';

export function isVendorItem(item: Item): item is VendorItem {
    return (
        isCategory('ammo', item) ||
        isCategory('armor', item) ||
        isCategory('weapons', item) ||
        isCategory('tools', item) ||
        isCategory('consumables', item) ||
        isCategory('auras', item) ||
        isCategory('food', item)
    );
}
