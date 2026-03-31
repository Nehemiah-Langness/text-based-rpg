import { attackRange, getDefense } from '../items/damage';
import { getDamageRating } from './get-damage-rating';
import { getDefenseRating } from './get-defense-rating';
import { isCategory } from './is-category';
import { HealthTable } from './tables/health-table';
import { StaminaTable } from './tables/stamina-table';
import type { Item } from './types/item';

export function getShopDescription(item: Item) {
    if (isCategory('consumables', item)) {
        return `${item} (${HealthTable[item]}hp)`;
    } else if (isCategory('food', item)) {
        return `${item} (${StaminaTable[item]}st)`;
    } else if (isCategory('armor', item)) {
        return `${item} (${isCategory('farmingBonus', item) ? '1 farming bonus' : `${getDefense(8, getDefenseRating(item))} defense`})`;
    } else if (isCategory('weapons', item)) {
        const tier = getDamageRating(item);
        const { maxAttack, minAttack } = attackRange(7 + tier, tier);
        return `${item} (${minAttack}-${maxAttack} ${isCategory('rangeWeapons', item) ? 'range' : 'melee'} attack)`;
    }
    return undefined;
}
