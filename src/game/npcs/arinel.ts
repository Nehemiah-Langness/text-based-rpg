import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

const shopDescription = ``;

export const Arinel = new Npc(
    'arinel',
    ['Arinel Wavebind', 'Arinel', 'Arinel'],
    [
        (npc, rm) => [
            `"Unenchanted armor does one thing - it lessens the harm you take," ${npc.getName(rm)[Names.FirstName]} explains.
    
"It dulls the blow. Nothing more. But enchanted armor... changes the flow of battle."`,
            `"It can strengthen your body, yes - but also your strikes," ${npc.getName(rm)[Names.FirstName]} continues.`,
            `"The right enchantment doesn't just keep you alive.  It makes you dangerous."

"Defense alone is survival. Power is control."`,
        ],
        () => `"Normal armor reduces incoming damage."

"Enchanted armor can increase your resilience... and your damage output."`,
        (npc, rm) => `"You want to last longer? I can do that," ${npc.getName(rm)[Names.FirstName]} brags.

"You want to hit harder? I can do that too."`,
        () => `"Not every enchantment is gentle."
        
"The deeper the magic, the greater the cost."`,
    ]
)
    .move(Shops)
    .hasStore(
        () =>
            new Store(Inventory, (x) => x.category === 'enchantment' || x.category === 'potion' || x.category === 'enchanted-armor', {
                leaveStoreText: 'Leave',
                openShopText: "Enter Arinel's Enchanting",
                priceModifier: 1.5,
                shopText: () => [
                    `${shopDescription}"Come closer. I can feel the resonance around you."`,
                    `${shopDescription}"Some enchantments bite back. Choose carefully."`,
                    `${shopDescription}"The ocean flows through all things. I simply... guide it."`,
                    `${shopDescription}"You carry armor... but not yet power. Let us see what your armor could become."`,
                ],
                firstEntrance: [
                    `Soft light ripples through the chamber of Arinel's Enchanting. The walls curve inward in smooth Atlantean arcs, but here they are etched with intricate symbols that shimmer faintly, shifting as currents pass over them.`,
                    `At the center of the room stands Arinel Wavebind, hands hovering over a piece of armor as currents spiral gently around her fingers.

She pauses.

Then looks up.`,
                ],
            }),
        true
    );
