import { type RoomLike } from '../engine/room';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Inventory, type InventoryKey } from './inventory';

export function addToInventory(itemName: InventoryKey, backTo: RoomLike, text?: string, count = 1) {
    const item = Inventory.get(itemName);
    item.count += count;
    if (item.equippable) {
        return choiceRoom(
            (text ?? `You have picked up the ${item}${count > 1 ? (item.pluralSuffix ?? 's') : ''}.`) + `  Would you like to equip it?`,
            [
                {
                    text: `Equip the ${item}`,
                    code: 'equip',
                },
                {
                    text: `Put the ${item} in pack`,
                    code: 'pack',
                },
            ],
            (choice) => {
                if (choice === 'equip') {
                    Inventory.equip(itemName);
                    return resultRoom(backTo, `You have equipped the ${item}${count > 1 ? (item.pluralSuffix ?? 's') : ''}.`);
                }
                return backTo;
            }
        );
    }
    return resultRoom(backTo, text ?? `You have picked up the ${item}${count > 1 ? (item.pluralSuffix ?? 's') : ''}.`);
}
