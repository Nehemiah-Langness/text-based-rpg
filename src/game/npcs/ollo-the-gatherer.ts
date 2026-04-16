import { Npc } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Shops } from '../rooms/mermaid-city/shops';
import { Names } from './npc-names';

export const Velmora = new Npc('ollo', ['Ollo the Gatherer', 'Ollo', 'Ollo']).move(Shops).hasStore(
    () =>
        new Store(Inventory, (item) => item.category === 'trinket', {
            leaveStoreText: 'Leave Ollo\'s Many Finds',
            openShopText: 'Enter Ollo\'s Many Finds',
            priceModifier: 1.5,
            shopText: () => [
                `"Come in, come in. The ocean always brings something interesting through that door."`,
                `"Looking to sell, buy, or just admire what you can't afford yet?"`,
                `"Careful where you swim - some of these pieces have stories attached."`,
                `"Ooooh... what have you brought me today?"`,
                `"I can always tell when someone's been somewhere... unusual."`,
                `"Don't worry - I only overcharge a little."`
            ],
            conversations: (npc, rm) => [
                `"If it glows, hums, or whispers - I'm interested," ${npc.getName(rm)[Names.FirstName]} quips cheerfully.`,
                `"If it's broken, I'll still take it. Sometimes especially if it's broken."`,
                `"I deal in value, not sentiment. Try to remember that," states ${npc.getName(rm)[Names.FirstName]}.`,
                `"You'd be amazed what people lose in the ocean."`
            ],
        })
);;
