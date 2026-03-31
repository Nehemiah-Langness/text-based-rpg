import { compare } from '../../../helpers/compare';
import { rollDice } from '../../dice';
import type { InputOption } from '../../input-option';
import { addToInventory } from '../../inventory/add-to-inventory';
import { emptyFromInventory } from '../../inventory/empty-from-inventory';
import { getItemsByCategory } from '../../inventory/get-items-by-category';
import { getShopDescription } from '../../inventory/get-shop-description';
import { hasItemInCategory } from '../../inventory/has-item-in-category';
import { Inventory } from '../../inventory/inventory';
import { isCategory } from '../../inventory/is-category';
import { isVendorItem } from '../../inventory/is-vendor-item';
import { Categories } from '../../inventory/lists/categories';
import { Items } from '../../inventory/lists/items';
import { removeFromInventory } from '../../inventory/remove-from-inventory';
import { PriceTable } from '../../inventory/tables/price-table';
import type { Item } from '../../inventory/types/item';
import type { VendorItem } from '../../inventory/types/vendor-item';
import { finishQuest } from '../../quests';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { choiceRoom } from './choice-room';
import { inventoryRoom, shopInventoryRoom } from './inventory-room';
import { resultRoom } from './result-room';

export function shopRoom(
    backTo: Room,
    shop: {
        description: string;
        name: string;
        product: string;
    },
    filter: (item: Item) => boolean,
    buysLoot = false,
    additionalOptions?: () => InputOption[],
    handleAdditionalOptions?: (choice: string, room: Room) => Room | null
) {
    return new Room(
        {
            lastTransaction: '',
        },
        (rm) => {
            return [shop.description, rm.state.lastTransaction].filter((x) => x).join('\n\n');
        },
        (rm) => {
            const hasLoot = hasItemInCategory('loot');

            const options: InputOption[] = [
                {
                    code: 'buy',
                    text: 'Buy ' + shop.product,
                },
                {
                    code: 'sell',
                    text: 'Sell ' + shop.product,
                },
            ];

            if (buysLoot && hasLoot) {
                options.push({
                    code: 'sell-loot',
                    text: 'Sell loot',
                });
            }

            if (additionalOptions) {
                options.push(...additionalOptions());
            }

            options.push({
                code: 'leave',
                text: 'Leave ' + shop.name,
            });

            return {
                options: options,
                select: (choice) => {
                    if (choice === 'leave') {
                        return resultRoom(backTo, `You leave ${shop.name}.`);
                    }

                    if (choice === 'sell-loot') {
                        const total = new Array(Inventory['Loot (4-7g)'].count)
                            .fill(0)
                            .map(() => 3 + rollDice(4))
                            .concat(new Array(Inventory['Loot (21-43g)'].count).fill(0).map(() => 20 + rollDice(23)))
                            .concat(new Array(Inventory['Loot (201-404g)'].count).fill(0).map(() => 200 + rollDice(204)))
                            .reduce((c, n) => c + n, 0);

                        emptyFromInventory(...Categories.loot);
                        Inventory['Gold Coin'].count += total;
                        Stats.goldEarned = (Stats.goldEarned ?? 0) + total;

                        rm.state.lastTransaction = `You have just sold all your loot for ${total} gold.`;

                        return resultRoom(
                            rm,
                            [`You have sold all your loot for ${total} gold.`, finishQuest('lootIntroduction')].filter((x) => x !== null && typeof x !== 'undefined')
                        );
                    }

                    if (choice === 'buy') {
                        const items = (
                            Items.filter(filter).filter((item) => isVendorItem(item) && !isCategory('legendaryDrops', item)) as VendorItem[]
                        )
                            .map((x) => ({
                                item: x,
                                gold: PriceTable[x].buy,
                                description: getShopDescription(x),
                            }))
                            .filter((x) => x.gold > 0)
                            .sort(compare<{ gold: number; item: Item }>((x) => x.gold).thenBy((x) => x.item));

                        return shopInventoryRoom(
                            items,
                            (choice, shopRoom) => {
                                if (choice === 'back') {
                                    return rm;
                                }

                                const item = items.find((x) => x.item === choice);
                                if (!item) {
                                    return resultRoom(
                                        shopRoom,
                                        `It appears the ${choice} was not actually for sale, and was displayed by mistake.`
                                    );
                                }

                                if (Inventory['Gold Coin'].count >= item.gold) {
                                    Inventory['Gold Coin'].count -= item.gold;
                                    Stats.goldSpent = (Stats.goldSpent ?? 0) + item.gold;

                                    rm.state.lastTransaction = `You have just purchased the ${choice} for ${item.gold} gold.`;

                                    return addToInventory(choice, shopRoom, `You have purchased the ${choice} for ${item.gold} gold.`);
                                }
                                return resultRoom(shopRoom, `You do not have enough gold to by the ${choice}.`);
                            },
                            'Done'
                        );
                    }

                    if (choice === 'sell') {
                        const items = (Items.filter(filter).filter((item) => isVendorItem(item)) as VendorItem[])
                            .map((x) => ({
                                item: x,
                                gold: PriceTable[x].sell,
                            }))
                            .filter((x) => x.gold > 0);

                        return inventoryRoom(
                            (choice, shopRoom) => {
                                if (choice === 'back') {
                                    return rm;
                                }

                                const item = items.find((x) => x.item === choice);
                                if (!item) {
                                    return resultRoom(shopRoom, `The shop owner does not want to buy your ${choice}.`);
                                }

                                if (Inventory[choice].count < 1) {
                                    return resultRoom(shopRoom, `You do not have a ${choice} to sell.`);
                                }

                                if (isCategory('chestArmor', choice)) {
                                    if (getItemsByCategory('chestArmor').reduce((c, n) => c + Inventory[n].count, 0) < 2) {
                                        return resultRoom(
                                            shopRoom,
                                            `The shop owner does not want to buy your ${choice}, as it would cause you to be indecent.`
                                        );
                                    }
                                } else if (isCategory('legArmor', choice)) {
                                    if (getItemsByCategory('legArmor').reduce((c, n) => c + Inventory[n].count, 0) < 2) {
                                        return resultRoom(
                                            shopRoom,
                                            `The shop owner does not want to buy your ${choice}, as it would cause you to be indecent.`
                                        );
                                    }
                                }

                                const sellItem = () => {
                                    Inventory['Gold Coin'].count += item.gold;
                                    Stats.goldEarned = (Stats.goldEarned ?? 0) + item.gold;

                                    removeFromInventory(choice);

                                    rm.state.lastTransaction = `You have just sold your ${choice} for ${item.gold} gold.`;
                                    return resultRoom(shopRoom, `You sell your ${choice} for ${item.gold} gold.`);
                                };

                                if (Inventory[choice].equipped && Inventory[choice].count === 1) {
                                    return choiceRoom(
                                        `You have your ${choice} equipped.  Do you still want to sell your ${choice}?`,
                                        [
                                            {
                                                code: 'yes',
                                                text: 'Sell your ' + choice,
                                            },
                                            {
                                                code: 'no',
                                                text: 'Cancel',
                                            },
                                        ],
                                        (confirmation, confirmationRoom) => {
                                            if (confirmation === 'yes') {
                                                return sellItem();
                                            } else if (confirmation === 'no') {
                                                return shopRoom;
                                            }
                                            return confirmationRoom;
                                        }
                                    );
                                }
                                return sellItem();
                            },
                            'Done',
                            'Sell',
                            (item) => items.some((x) => x.item === item)
                        );
                    }

                    if (handleAdditionalOptions) {
                        const handled = handleAdditionalOptions(choice, rm);
                        if (handled) return handled;
                    }

                    return rm;
                },
            };
        }
    );
}
