import { Names } from '../npcs/npc-names';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { shopInventoryRoom } from '../rooms/utility-rooms/inventory-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import type { GenericNpc } from './npc';
import type { Room, RoomLike } from './room';
import type { Store } from './store';

export function shop(root: Room, backTo: RoomLike, store: Store, npc: GenericNpc) {
    const storeMenu = () => {
        const shopText = store.getShopText(root);

        return choiceRoom(
            shopText,
            [
                npc.canConverse() && npc.inStore
                    ? {
                          code: 'talk',
                          text: `Talk to ${npc.getName(root)[Names.FullName]}`,
                      }
                    : null,
                store.getItemsToSell().length
                    ? {
                          code: 'buy',
                          text: 'Buy',
                      }
                    : null,
                store.getItemsToBuy().length
                    ? {
                          code: 'sell',
                          text: 'Sell',
                      }
                    : null,
                {
                    code: 'leave',
                    text: store.leaveStoreText,
                },
            ],
            (choice, rm) => {
                if (choice === 'leave') {
                    return backTo;
                } else if (choice === 'talk') {
                    return npc.getConversation(rm);
                } else if (choice === 'buy' || choice === 'sell') {
                    return shopInventoryRoom(
                        rm,
                        choice === 'buy' ? `The following items are available for purchase.` : `You can sell the following items.`,
                        store,
                        choice
                    );
                }

                return rm;
            }
        );
    };

    if (store.firstEntrance) {
        return resultRoom(storeMenu, store.firstEntrance);
    }
    return storeMenu();
}
