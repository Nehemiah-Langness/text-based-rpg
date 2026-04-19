import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

const shopDescription = ``;

const openingDescription = [
    `Ollo's Many Finds spills outward in every direction, its curved Atlantean walls barely visible beneath layers of hanging trinkets, dangling chains, polished shells, and objects you can't immediately identify.

Nothing is arranged the way it should be.`,
    `Stacks lean precariously. The entire shop feels like a collection of stories - half-lost, half-remembered, and waiting to be sold.

Ollo clings to the far wall - an octopus, his many arms each occupied with something different: polishing a coin, sorting trinkets, adjusting a display that doesn't need adjusting.`,
    `His eyes turn towards you. He perks up instantly.`,
];

export const Velmora = new Npc(
    'ollo',
    ['Ollo the Gatherer', 'Ollo', 'Ollo'],
    [
        (npc, rm) => [`"If it glows, hums, or whispers - I'm interested," ${npc.getName(rm)[Names.FirstName]} quips cheerfully.`],
        () => [`"If it's broken, I'll still take it. Sometimes especially if it's broken."`],
        (npc, rm) => [`"I deal in value, not sentiment. Try to remember that," states ${npc.getName(rm)[Names.FirstName]}.`],
        () => [`"You'd be amazed what people lose in the ocean."`],
    ]
)
    .move(Shops)
    .hasStore(
        () =>
            new Store(Inventory, (item) => item.category === 'trinket', {
                leaveStoreText: 'Leave',
                openShopText: "Enter Ollo's Many Finds",
                priceModifier: 1.5,
                firstEntrance: openingDescription,
                shopText: () => [
                    `${shopDescription}"Come in, come in. The ocean always brings something interesting through that door."`,
                    `${shopDescription}"Looking to sell, buy, or just admire what you can't afford yet?"`,
                    `${shopDescription}"Careful where you swim - some of these pieces have stories attached."`,
                    `${shopDescription}"Ooooh... what have you brought me today?"`,
                    `${shopDescription}"I can always tell when someone's been somewhere... unusual."`,
                    `${shopDescription}"Don't worry - I only overcharge a little."`,
                ],
            }),
        true
    );
