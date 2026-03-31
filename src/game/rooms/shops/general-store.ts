import { isCategory } from '../../inventory/is-category';
import { Room } from '../../engine/room';
import { shopRoom } from '../utility-rooms/shop-room';

export function generalStore(backTo: Room) {
    return shopRoom(
        backTo,
        {
            description: `The air of the shop smells of dried herbs, leather, and grain. Narrow shelves line the walls from floor to rafters, stocked with everyday necessities: sacks of barley, candles, needles, soap, lamp oil, and the occasional luxury like honey cakes or spiced tea.

Behind a broad oak counter stands the shopkeeper, who seems to know every villager's habits and debts by heart. A chalkboard lists recent arrivals from passing traders, while a barrel near the door serves as a gathering spot where locals linger to swap rumors, argue prices, and share news from beyond the palisade.`,
            name: 'the general store',
            product: 'goods',
        },
        (item) =>
            isCategory('ammo', item) ||
            isCategory('consumables', item) ||
            isCategory('tools', item) ||
            isCategory('farmingBonus', item) ||
            ['Large Stick'].includes(item),
        true
    );
}
