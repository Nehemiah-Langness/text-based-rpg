import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';

const shopDescription = `Chef Seraphine Tideveil stands by you ready to take your order.\n\n`;

export const Seraphine = new Npc('seraphine', ['Chef Seraphine Tideveil', 'Chef Seraphine', 'Seraphine']).move(Shops).hasStore(
    () =>
        new Store(Inventory, (item) => item.category === 'food-fine', {
            leaveStoreText: 'Leave',
            openShopText: 'Enter Tideveil Terrace',
            priceModifier: 1.5,
            shopText: () => [
                `${shopDescription}"I don't serve indecision. Tell me what you want."`,
                `${shopDescription}"Tonight's selections are... precise. Choose accordingly."`,
                `${shopDescription}"You look like you've come from somewhere demanding. Good. I serve those who've earned it."`,
                `${shopDescription}"If you're expecting something simple, you're in the wrong place."`,
                `${shopDescription}"Every dish I prepare has purpose. Decide which one you need."`,
                `${shopDescription}"Take your time - but not too much. Perfection doesn't wait."`,
            ],
            firstEntrance: [
                `You are guided to a curved table set along the outer edge of Tideveil Terrace, where the city opens into a breathtaking view of the ocean beyond. 
                
The stone beneath you is polished to a mirror sheen, reflecting the soft gold and blue glow of suspended lanterns drifting overhead. Delicate coral arrangements frame the table, their faint light pulsing in slow, calming rhythms.`,
                `From here, the water feels endless - currents flowing gently past, carrying distant glimmers of life through the darkening blue. 
                
The quiet murmur of other patrons blends with the subtle clink of fine dishware, creating an atmosphere that feels... intentional. 
                
Every detail placed with care.`,
                `A moment later, Chef Seraphine Tideveil approaches, her presence composed and unmistakably in control.`,
            ],
        }),
    true
);
