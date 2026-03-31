import { isCategory } from './is-category';
import { Categories } from './lists/categories';
import type { Item } from './types/item';

export function getDefenseRating(item: Item) {
    if (isCategory('chestArmor', item)) {
        return Categories.chestArmor.indexOf(item) + (isCategory('legendaryDrops', item) ? 1 : 0);
    }
    if (isCategory('headArmor', item)) {
        return Categories.headArmor.indexOf(item) + (isCategory('legendaryDrops', item) ? 1 : 0);
    }
    if (isCategory('legArmor', item)) {
        return Categories.legArmor.indexOf(item) + (isCategory('legendaryDrops', item) ? 1 : 0);
    }
    return 0;
}
