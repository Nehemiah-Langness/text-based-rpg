import { hasCategoryEquipped } from './has-category-equipped';

export function fullyClothed() {
    return hasCategoryEquipped('legArmor') && hasCategoryEquipped('chestArmor');
}
