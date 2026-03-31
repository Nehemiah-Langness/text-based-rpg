import type { EquipmentCategories } from '../types/equipment-categories';

export const LuckTable: Record<EquipmentCategories['food'][number], number> = {
    'Pickled Vegetables Jar': 1,
    'Dried Fruit Mix': 1,
    'Honeyed Biscuit': 2,
    'Dried Meat Jerky': 2,
    'Fried Fish': 2,
    'Small Meat Pie': 3,
    'Smoked Sausage': 3,
    'Trail Cheese & Meat Pack': 3,
};
