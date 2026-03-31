import type { EquipmentCategories } from './equipment-categories';

export type VendorItem = EquipmentCategories[
    | 'ammo' // base = 2g
    | 'chestArmor' // base = 16g
    | 'headArmor' // base = 8g
    | 'legArmor' // base = 12g
    | 'meleeWeapons' // base = 26g
    | 'rangeWeapons' // base = 18g
    | 'tools' // base 55g
    | 'food' // base = depends
    | 'auras' // base = 50000g
    | 'consumables'][number]; // base = depends
