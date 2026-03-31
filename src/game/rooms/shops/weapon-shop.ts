import { isCategory } from '../../inventory/is-category';
import { Room } from '../../engine/room';
import { shopRoom } from '../utility-rooms/shop-room';

export function weaponShop(backTo: Room) {
    return shopRoom(
        backTo,
        {
            description: `Weapon racks line the walls of the shop in careful rows. Simple copper and iron swords hang nearest the door - serviceable blades meant for farmers, caravan guards, or anyone expecting trouble on the road. Farther along are better-forged steel swords, their edges kept keen and their grips wrapped in worn leather. A sturdy barrel holds spare spear shafts and practice staves.

Opposite the blades, a rack of bows stretches from short hunting bows to tall, polished longbows nearly as high as a man. Bundles of arrows rest in wicker baskets below. The shop smells of oiled wood and metal filings, and the owner insists every weapon be properly balanced before it leaves the counter.`,
            name: 'the weapon shop',
            product: 'weapons',
        },
        (item) =>
            (isCategory('meleeWeapons', item) || isCategory('rangeWeapons', item) || isCategory('ammo', item)) &&
            !['Large Stick', 'Rock'].includes(item)
    );
}
