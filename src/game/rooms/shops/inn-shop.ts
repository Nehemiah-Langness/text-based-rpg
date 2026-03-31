import { addToInventory } from '../../inventory/add-to-inventory';
import { Inventory } from '../../inventory/inventory';
import { isCategory } from '../../inventory/is-category';
import { Knowledge } from '../../knowledge';
import { Names, NpcNames } from '../../npcs/npc-names';
import { finishQuest } from '../../quests';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { resultRoom } from '../utility-rooms/result-room';
import { shopRoom } from '../utility-rooms/shop-room';

export function innShop(backTo: Room) {
    return shopRoom(
        backTo,
        {
            description: `Seated in an open chair by the hearth, you watch the firelight dance across the wooden floor, the warmth easing the weariness from your shoulders.

A cheerful voice draws your attention - ${Knowledge.innKeeperWifeName ? `${NpcNames['Inn Keeper Wife'][0]}, the innkeeper's wife, approaches with her familiar, welcoming smile` : 'A barmaid approaches with a welcoming smile'}.

"What can I get for you today?" she asks, leaning slightly on the edge of your table. "Something to warm you up, or a hearty meal to keep you going on your travels?"`,
            name: 'your table',
            product: 'food',
        },
        (item) => isCategory('food', item),
        false,
        () => {
            return [
                Inventory['Raw Fish'].count > 0
                    ? {
                          code: 'cook-fish',
                          text: `Ask ${Knowledge.innKeeperWifeName ? NpcNames['Inn Keeper Wife'][Names.FirstName] : 'the barmaid'} to cook your fish (3g)`,
                      }
                    : null,
                Inventory['Medicinal Herbs'].count > 0
                    ? {
                          code: 'craft-herbal-medicine',
                          text: `Ask ${Knowledge.innKeeperWifeName ? NpcNames['Inn Keeper Wife'][Names.FirstName] : 'the barmaid'} to mix your medicinal herbs (15g)`,
                      }
                    : null,
            ].filter((x) => x !== null && typeof x !== 'undefined');
        },
        (subChoice, subRoom) => {
            if (subChoice === 'cook-fish') {
                if (Inventory['Gold Coin'].count < 3) {
                    return resultRoom(subRoom, 'You do not have enough gold to cook your fish');
                }
                Inventory['Gold Coin'].count -= 3;
                Stats.goldSpent = (Stats.goldSpent ?? 0) + 3;

                Inventory['Raw Fish'].count -= 1;

                const questProgress = finishQuest('fish');

                return addToInventory(
                    'Fried Fish',
                    questProgress ? resultRoom(subRoom, questProgress) : subRoom,
                    `You have cooked Fried Fish.`
                );
            } else if (subChoice === 'craft-herbal-medicine') {
                if (Inventory['Gold Coin'].count < 15) {
                    return resultRoom(subRoom, 'You do not have enough gold to cook your fish.');
                }
                if (Inventory['Medicinal Herbs'].count < 3) {
                    return resultRoom(subRoom, 'You need at least 3 Medicinal Herbs to make Herbal Medicine.');
                }
                Inventory['Gold Coin'].count -= 15;
                Stats.goldSpent = (Stats.goldSpent ?? 0) + 15;

                Inventory['Medicinal Herbs'].count -= 3;

                const questProgress = finishQuest('forage');

                return addToInventory(
                    'Herbal Medicine',
                    questProgress ? resultRoom(subRoom, questProgress) : subRoom,
                    `You have made Herbal Medicine.`
                );
            }

            return null;
        }
    );
}
