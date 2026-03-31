import type { EquipmentCategories } from '../types/equipment-categories';
import type { Item } from '../types/item';

export const AmmoTable: Record<EquipmentCategories['rangeWeapons'][number], Item> = {
    'Long Bow': 'Arrow',
    'Wooden Bow': 'Arrow',
    'Bow of the Ancient Warrior': 'Arrow',
    Rock: 'Rock',
    Spear: 'Spear',
};
