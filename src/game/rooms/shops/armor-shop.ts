import { isCategory } from '../../inventory/is-category';
import { Room } from '../../engine/room';
import { shopRoom } from '../utility-rooms/shop-room';

export function armorShop(backTo: Room) {
    return shopRoom(
        backTo,
        {
            description: `The shop smells of coal smoke and hot iron. Racks along the walls display practical pieces of armor - leather tunics reinforced with studs, dented kettle helms, round shields rimmed in iron, and a few carefully polished chain shirts reserved for those with deeper purses. Hooks from the rafters hold spare gauntlets and pauldrons, while a heavy workbench near the forge is scattered with rivets, straps, and half-finished repairs.

The smith who runs the place spends as much time mending battered gear as crafting new pieces, and most villagers come here not for shining knightly plate, but for something sturdy enough to keep them safe beyond the village walls.`,
            name: 'the armor shop',
            product: 'armor',
        },
        (item) => isCategory('armor', item) && !isCategory('farmingBonus', item)
    );
}
