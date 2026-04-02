import { Room } from '../engine/room';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { equipItem } from './equip-item';
import { Inventory } from './inventory';
import { shouldEquip } from './should-equip';
import type { Item } from './types/item';

export function addToInventory(item: Item, backTo: Room | (() => Room), text?: string, count = 1) {
    Inventory[item].count += count;
    if (shouldEquip(item)) {
        return choiceRoom(
            (text ?? `You have picked up the ${item}${count > 1 ? Inventory[item].plural ?? 's' : ''}.`) + `  Would you like to equip it?`,
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
                    equipItem(item);
                    return resultRoom(backTo, `You have equipped the ${item}${count > 1 ? Inventory[item].plural ?? 's' : ''}.`);
                }
                return Room.resolve(backTo);
            }
        );
    }
    return resultRoom(backTo, text ?? `You have picked up the ${item}${count > 1 ? Inventory[item].plural ?? 's' : ''}.`);
}
