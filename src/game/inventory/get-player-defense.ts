import { getDefense } from '../items/damage';
import { getEquippedByCategory } from './get-equipped-by-category';
import { isCategory } from './is-category';

export function getPlayerDefense() {
    return [getEquippedByCategory('chestArmor'), getEquippedByCategory('headArmor'), getEquippedByCategory('legArmor')]
        .filter((x) => x !== null && typeof x !== 'undefined')
        .reduce((c, n) => c + getDefense(8, n.tier + (isCategory('legendaryDrops', n.item) ? 1 : 0)), 0);
}
