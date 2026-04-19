import { Names } from '../npcs/npc-names';
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
            () => [
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
                store.getItemsPlayerCanSell().length
                    ? {
                          code: 'sell',
                          text: store.sellOptionText || 'Sell',
                      }
                    : null,
                {
                    code: 'leave',
                    text: store.leaveStoreText,
                },
            ],
            (choice, mainShopScreen) => {
                if (choice === 'leave') {
                    return leaveTo;
                } else if (choice === 'talk') {
                    return npc.getConversation(mainShopScreen);
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
