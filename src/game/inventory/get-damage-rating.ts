import { isCategory } from './is-category';
import { Categories } from './lists/categories';
import type { Item } from './types/item';

export function getDamageRating(item: Item) {
    if (isCategory('meleeWeapons', item)) {
        return 1 + Categories.meleeWeapons.indexOf(item) + (isCategory('legendaryDrops', item) ? 1 : 0);
    }
    if (isCategory('rangeWeapons', item)) {
        return 1 + Categories.rangeWeapons.indexOf(item) + (isCategory('legendaryDrops', item) ? 1 : 0);
    }
    return 0;
}
