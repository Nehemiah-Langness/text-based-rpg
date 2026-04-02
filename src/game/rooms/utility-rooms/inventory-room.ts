import { equipItem } from '../../inventory/equip-item';
import { getInventory } from '../../inventory/get-inventory';
import { Inventory } from '../../inventory/inventory';
import { isCategory } from '../../inventory/is-category';
import { EquippableItems } from '../../inventory/lists/equippable-items';
import { removeFromInventory } from '../../inventory/remove-from-inventory';
import { HealthTable } from '../../inventory/tables/health-table';
import { LuckTable } from '../../inventory/tables/luck-table';
import { StaminaTable } from '../../inventory/tables/stamina-table';
import type { Item } from '../../inventory/types/item';
import { energize, heal } from '../../player';
import { Stats } from '../../stats';
import { Room, type RoomLike } from '../../engine/room';
import { resultRoom } from './result-room';
import { Mood } from '../moods/mood';

export function shopInventoryRoom(
    inventory: { item: Item; gold: number; description?: string }[],
    onSelect: (selectedItem: Item | 'back', currentRoom: Room) => Room,
    continueText = 'Continue'
) {
    return new Room(
        null,
        () =>
            inventory.length
                ? `You browse the shop and find the following wares available.  You have ${Inventory['Gold Coin'].count} gold coins in your pouch.`
                : 'The shop is empty',
        (rm) => {
            return {
                options: [
                    ...inventory.map((item) => {
                        return {
                            text: `Buy ${item.description ?? item.item} for ${item.gold}g`,
                            code: item.item,
                        };
                    }),
                    {
                        code: 'back',
                        text: continueText,
                    },
                ],
                select: (code) => onSelect(code as Item | 'back', rm),
            };
        }
    );
}

export function inventoryRoom(
    onSelect: (selectedItem: Item | 'back', currentRoom: Room) => Room,
    continueText = 'Continue',
    action = 'Use',
    filter?: (item: Item) => boolean
) {
    const getItems = () => getInventory().filter((item) => filter?.(item.name) ?? true);

    return new Room(
        null,
        () => {
            return getItems().length
                ? `You rummage through your pack and find the following items:`
                : filter
                ? 'Nothing in your pack is useful at this time.'
                : 'Your pack is empty';
        },
        (rm) => {
            return {
                options: [
                    ...getItems().map((item) => {
                        return {
                            text: `${action} ${item.name}${item.equipped ? ' (Equipped)' : ''} ${item.count > 1 ? `(x${item.count})` : ''}`,
                            code: item.name,
                        };
                    }),
                    {
                        code: 'back',
                        text: continueText,
                    },
                ],
                select: (code) => onSelect(code as Item | 'back', rm),
            };
        }
    );
}

export function openInventoryRoom(backTo: RoomLike, itemLimit: number | null = null): Room {
    const equip = (code: keyof typeof Inventory) => {
        let success = true;
        if (Inventory[code].equipped) {
            Inventory[code].equipped = false;
        } else {
            success = equipItem(code);
        }

        if (success) {
            return resultRoom(
                itemLimit === 1 ? backTo : openInventoryRoom(backTo, itemLimit === null ? null : itemLimit - 1),
                `You ${Inventory[code].equipped ? 'equip' : 'unequip'} your ${code}`
            ).withColor(Mood.menu);
        }
        return null;
    };

    return inventoryRoom((code, rm) => {
        if (code === 'back') {
            return Room.resolve(backTo);
        }
        if (EquippableItems.includes(code)) {
            const success = equip(code);
            if (success) return success.withColor(Mood.menu);
        } else if (isCategory('consumables', code)) {
            const healthRecovery = HealthTable[code];
            removeFromInventory(code);

            if (!Stats.consumedItems[code]) {
                Stats.consumedItems[code] = 0;
            }
            Stats.consumedItems[code] += 1;

            return heal(itemLimit === 1 ? backTo : openInventoryRoom(backTo, itemLimit === null ? null : itemLimit - 1), healthRecovery).withColor(Mood.menu);
        } else if (isCategory('food', code)) {
            const staminaRecovery = StaminaTable[code];
            const criticalChanceBonus = LuckTable[code];
            removeFromInventory(code);

            if (!Stats.consumedItems[code]) {
                Stats.consumedItems[code] = 0;
            }
            Stats.consumedItems[code] += 1;

            return energize(
                itemLimit === 1 ? backTo : openInventoryRoom(backTo, itemLimit === null ? null : itemLimit - 1),
                staminaRecovery,
                criticalChanceBonus
            ).withColor(Mood.menu);
        } 

        return resultRoom(rm, `You cannot use your ${code} right now.`).withColor(Mood.menu);
    }, 'Close pack').withColor(Mood.menu);
}
