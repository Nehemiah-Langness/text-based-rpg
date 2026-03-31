import { progressQuest } from '../quests';
import { Room } from '../engine/room';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { equipItem } from './equip-item';
import { Inventory } from './inventory';
import { isCategory } from './is-category';
import { shouldEquip } from './should-equip';
import type { Item } from './types/item';

export function addToInventory(item: Item, backTo: Room | (() => Room), text?: string, count = 1) {
    const questProgressed = [
        isCategory('loot', item) ? progressQuest('lootIntroduction', 1, 0) : null,
        item === 'Fishing Pole' ? progressQuest('fish', 1, undefined, true) : null,
    ]
        .filter((x) => x !== null && typeof x !== 'undefined')
        .join('\n\n');

    Inventory[item].count += count;
    if (shouldEquip(item)) {
        return choiceRoom(
            (text ?? `You have picked up the ${item}${count > 1 ? (Inventory[item].plural ?? 's') : ''}.`) +
                `  Would you like to equip it?`,
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
                    return resultRoom(backTo, `You have equipped the ${item}${count > 1 ? (Inventory[item].plural ?? 's') : ''}.`);
                }
                return typeof backTo === 'function' ? backTo() : backTo;
            }
        );
    }
    return resultRoom(
        questProgressed ? resultRoom(backTo, questProgressed) : backTo,
        text ?? `You have picked up the ${item}${count > 1 ? (Inventory[item].plural ?? 's') : ''}.`
    );
}
