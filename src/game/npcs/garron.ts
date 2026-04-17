import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

const shopDescription = `The steady clang of metal echoes softly through Reefguard Armory, the sound carrying with a weight that feels grounded and real.

Racks of armor line the walls, neatly arranged by type: sharkskin hide, reinforced shell guards, woven coral plating.

Near the back, a large grindstone turns slowly, its rhythmic motion the only movement in the otherwise disciplined space. Garron Reefguard stands beside it, inspecting a piece of armor with a critical eye.

He doesn't look up immediately.

Then, without turning - `;

export const Garron = new Npc(
    'garron',
    ['Garron Reefguard', 'Garron', 'Garron'],
    [
        (npc, rm) => `${npc.getName(rm)[Names.FirstName]} leans over the counter, "You planning to fight sharks... or survive them?"`,
        () => `"Scars mean your armor failed. Keep that in mind."`,
        (npc, rm) => `"Even basic protection is better than none," ${npc.getName(rm)[Names.FirstName]} reassures.`,
    ]
)
    .move(Shops)
    .hasStore(
        () =>
            new Store(Inventory, (item) => item.category === 'armor', {
                leaveStoreText: 'Leave',
                openShopText: 'Enter Reefguard Armory',
                priceModifier: 1.5,
                shopText: () => [
                    `${shopDescription}"Let's see what you're working with... and what you're lacking."`,
                    `${shopDescription}"If Thalor sent you, I'll make sure you're properly equipped."`,
                    `${shopDescription}"Every piece here is made to last. Or at least outlast you."`,
                    `${shopDescription}"Coral, shell, hide - pick what suits your style."`,
                ],
            }),
        true
    );
