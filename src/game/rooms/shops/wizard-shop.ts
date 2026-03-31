import { isCategory } from '../../inventory/is-category';
import { Room } from '../../engine/room';
import { shopRoom } from '../utility-rooms/shop-room';

export function wizardShop(backTo: Room) {
    return shopRoom(
        backTo,
        {
            description: `You step deeper into the wizard's dimly lit shop, the air thick with the scent of dust and something faintly arcane. Shelves of strange artifacts line the walls, each humming softly with restrained power.

Ahead, a glass display case catches your eye.

Inside, carefully arranged upon dark velvet, rest a collection of enchanted trinkets - rings that glimmer with inner light, small vials swirling with luminous liquid, and charms etched with symbols you don't quite understand.

A faint pulse of magic seeps from the case, subtle but unmistakable, as if each item is quietly calling out to be chosen.

Behind you, the wizard's voice drifts through the room.

"Go on... take a closer look. Everything you see is for sale... should you be willing to pay the price."`,
            name: 'the display case',
            product: 'magic',
        },
        (item) => isCategory('auras', item)
    );
}
