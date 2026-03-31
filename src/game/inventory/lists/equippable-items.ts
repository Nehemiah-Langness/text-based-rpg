import type { Item } from '../types/item';
import { Categories } from './categories';

export const EquippableItems: Item[] = [
    ...Categories.legArmor,
    ...Categories.chestArmor,
    ...Categories.headArmor,
    ...Categories.meleeWeapons,
    ...Categories.rangeWeapons,
];
