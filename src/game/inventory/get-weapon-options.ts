import { compare } from '../../helpers/compare';
import { getInventory } from './get-inventory';
import { Inventory } from './inventory';
import { isCategory } from './is-category';
import { AmmoTable } from './tables/ammo-table';

export function getWeaponOptions() {
    return getInventory()
        .filter((x) => x.equipped && isCategory('weapons', x.name))
        .sort(compare((x) => x.name))
        .map((x, i) => ({
            option: i + 1,
            text: `Use your ${x.name}${isCategory('rangeWeapons', x.name) ? ` (x${Inventory[AmmoTable[x.name]].count} ${AmmoTable[x.name]}${Inventory[AmmoTable[x.name]].count === 1 ? '' : (Inventory[AmmoTable[x.name]].pluralSuffix ?? 's')})` : ''}`,
            code: x.name,
        }));
}
