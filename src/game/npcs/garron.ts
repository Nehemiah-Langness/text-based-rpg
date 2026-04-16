import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

export const Velmora = new Npc('garron', ['Garron Reefguard', 'Garron', 'Garron']).move(Shops).hasStore(
    () =>
        new Store(Inventory, (item) => item.category === 'armor', {
            leaveStoreText: 'Leave Reefguard Armory',
            openShopText: 'Enter Reefguard Armory',
            priceModifier: 1.5,
            shopText: () => [
                `"If Thalor sent you, I'll make sure you're properly equipped."`,
                `"Let's see what you're working with... and what you're lacking."`,
                `"Every piece here is made to last. Or at least outlast you."`,
                `"Coral, shell, reinforced plating—pick what suits your style."`,
            ],
            conversations: (npc, rm) => [
                `${npc.getName(rm)[Names.FirstName]} leans over the counter, "You planning to fight sharks... or survive them?"`,
                `"Scars mean your armor failed. Keep that in mind."`,
                `"Even basic protection is better than none," ${npc.getName(rm)[Names.FirstName]} reassures.`,
            ],
        })
);
