import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

export const Arinel = new Npc('arinel', ['Arinel Wavebind', 'Arinel', 'Arinel']).move(Shops).hasStore(
    () =>
        new Store(Inventory, (x) => x.category === 'enchantment', {
            leaveStoreText: "Leave Arinel's Enchanting",
            openShopText: "Enter Arinel's Enchanting",
            priceModifier: 1.5,
            shopText: () => [
                `"You carry armor... but not yet power. Let us see what your armor could become."`,
                `"Come closer. I can feel the resonance around you."`,
                `"Some enchantments bite back. Choose carefully."`,
                `"The ocean flows through all things. I simply... guide it."`,
            ],
            conversations: (npc, rm) => [
                [
                    `"Unenchanted armor does one thing—it lessens the harm you take," ${npc.getName(rm)[Names.FirstName]} explains.
    
"It dulls the blow. Nothing more. But enchanted armor... changes the flow of battle."`,
                    `"It can strengthen your body, yes—but also your strikes," ${npc.getName(rm)[Names.FirstName]} continues.

"The right enchantment doesn't just keep you alive."`,
                    `"It makes you dangerous."

"Defense alone is survival. Power is control."`,
                ],
                [
                    `"Normal armor reduces incoming damage."

"Enchanted armor can increase your resilience... and your damage output."`,
                    `"You want to last longer? I can do that."

"You want to hit harder? I can do that too."`,
                ],
                `"Not every enchantment is gentle."`,
                `"The deeper the magic, the greater the cost."`
            ],
        })
);
