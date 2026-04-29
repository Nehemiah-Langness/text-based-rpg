import { Inventory, type InventoryKey } from '../inventory';
import { Names } from '../npcs/npc-names';
import { Player } from '../player';
import { Mood } from '../rooms/moods/mood';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { shopInventoryRoom } from '../rooms/utility-rooms/inventory-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import type { GenericNpc } from './npc';
import type { Room, RoomLike } from './room';
import type { Store } from './store';

export function shop(root: Room, leaveTo: RoomLike, store: Store, npc: GenericNpc) {
    const storeMenu = () => {
        return choiceRoom(
            () => store.getShopText(root),
            () => {
                const playerItemsToSell = store.getItemsPlayerCanSell();

                return [
                    npc.canConverse(root) && npc.inStore
                        ? {
                              code: 'talk',
                              text: `Talk to ${npc.getName(root)[Names.FullName]}${npc.hasSpecialRemark(root) ? ' (!)' : ''}`,
                          }
                        : null,
                    store.getItemsPlayerCanBuy().length
                        ? {
                              code: 'buy',
                              text: store.buyOptionText || 'Buy',
                          }
                        : null,
                    playerItemsToSell.length
                        ? {
                              code: 'sell',
                              text: store.sellOptionText || 'Sell',
                          }
                        : null,
                    playerItemsToSell.filter((x) => x.item.category === 'trinket').length
                        ? {
                              code: 'sell-trinkets',
                              text: 'Sell all your trinkets',
                          }
                        : null,
                    {
                        code: 'leave',
                        text: store.leaveStoreText,
                    },
                ];
            },
            (choice, mainShopScreen) => {
                if (choice === 'leave') {
                    return leaveTo;
                } else if (choice === 'talk') {
                    return npc.getConversation(mainShopScreen);
                } else if (choice === 'sell-trinkets') {
                    const trinkets = store.getItemsPlayerCanSell().filter((x) => x.item.category === 'trinket');
                    const totalGoldForTransaction = trinkets.reduce((c, n) => c + n.price * n.item.count, 0);

                    const message = `You sell:\n${trinkets.map(({ item }) => `${item.count} ${item.name}${item.count === 1 ? '' : (item.pluralSuffix ?? 's')}`).join('\n')}\n\nfor ${totalGoldForTransaction.toLocaleString()} coral shards.`;

                    const onRemove = trinkets
                        .map(({ itemKey, item }) => Inventory.add(itemKey as InventoryKey, -item.count, Player))
                        .filter((x) => x !== null)
                        .map((x) => (typeof x === 'string' ? [x] : x))
                        .flat();
                    Inventory.add('coralShard', totalGoldForTransaction, Player);

                    return resultRoom(
                        mainShopScreen,
                        [message, ...onRemove].filter((x) => x !== null),
                        undefined,
                        Mood.menu
                    );
                } else if (choice === 'buy' || choice === 'sell') {
                    return shopInventoryRoom(
                        mainShopScreen,
                        choice === 'buy' ? `The following items are available for purchase.` : `You can sell the following items.`,
                        store,
                        choice
                    );
                }

                return mainShopScreen;
            }
        );
    };

    if (store.firstEntrance) {
        return resultRoom(storeMenu, store.firstEntrance);
    }
    return storeMenu();
}
