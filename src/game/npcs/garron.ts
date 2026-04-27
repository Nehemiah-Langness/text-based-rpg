import { DialogueTree } from '../engine/dialogue-tree';
import { Npc, type SpecialRemark } from '../engine/npc';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { Quests } from '../quests';
import { Shops } from '../rooms/mermaid-city/shops';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { dialogueRoom } from '../rooms/utility-rooms/dialogue-room';
import { Names } from './npc-names';
import { Player } from '../player';
import { calculateDefense } from '../utility-functions/calculate-defense';

const firstEntrance = [
    `The steady clang of metal echoes softly through Reefguard Armory, the sound carrying with a weight that feels grounded and real.

Racks of armor line the walls, neatly arranged by type: sharkskin hide, reinforced shell guards, woven coral plating.`,
    `Near the back, a large grindstone turns slowly, its rhythmic motion the only movement in the otherwise disciplined space. 

Garron Reefguard stands beside it, inspecting a piece of armor with a critical eye.`,
];

const shopDescription = `The steady clang of metal echoes softly through Reefguard Armory.

Garron Reefguard stands beside a large grindstone in the back.

`;

export const Garron = new Npc(
    'garron',
    ['Garron Reefguard', 'Garron', 'Garron'],
    [
        (npc, rm) => `${npc.getName(rm)[Names.FirstName]} leans over the counter, "You planning to fight sharks... or survive them?"`,
        () => `"Scars mean your armor failed. Keep that in mind."`,
        (npc, rm) => `"Even basic protection is better than none," ${npc.getName(rm)[Names.FirstName]} reassures.`,
    ],
    (npc, room) => {
        if (Quests.getStage('mainQuest') === 'fix-crown-attempt') {
            return turnInCrown(npc, room);
        } else if (Quests.getStage('mainQuest') === 'fix-crown') {
            return turnInRing(npc, room);
        }

        return null;
    }
)
    .move(Shops)
    .hasStore(
        () =>
            new Store(
                Inventory,
                (item) => {
                    const playerLevel = Player.getLevel().attack;
                    const maxLevels: Record<string, number> = {
                        head: calculateDefense(playerLevel, 'head'),
                        arm: calculateDefense(playerLevel, 'arm'),
                        chest: calculateDefense(playerLevel, 'chest'),
                    };
                    return (
                        item.category === 'armor' &&
                        !!item.equippable?.defense &&
                        item.equippable.defense <= maxLevels[item.equippable.subCategory ?? 'head']
                    );
                },
                {
                    leaveStoreText: 'Leave',
                    openShopText: 'Enter Reefguard Armory',
                    priceModifier: 1.5,
                    firstEntrance: firstEntrance,
                    shopText: () => [
                        `${shopDescription}"Let's see what you're working with... and what you're lacking."`,
                        `${shopDescription}"If Thalor sent you, I'll make sure you're properly equipped."`,
                        `${shopDescription}"Every piece here is made to last. Or at least outlast you."`,
                        `${shopDescription}"Coral, shell, hide - pick what suits your style."`,
                    ],
                }
            ),
        true
    );

const turnInCrown: SpecialRemark = (npc, root) => () => {
    return [
        (backTo) =>
            dialogueRoom(
                backTo,
                `${npc.getName(root)[Names.FullName]} glances up, narrowing his eyes.

"That energy... what are you carrying?"`,
                {
                    [`"I found the Abyssal crown, but it's been broken. Can you repair it?"`]: (rm) =>
                        dialogueRoom(
                            rm,
                            [
                                `${npc.getName(root)[Names.FirstName]} sets his hammer down, stepping closer.
                    
"Let me see it."`,
                                `You hand over the Abyssal Crown. It emits a low, vibrating pulse as ${npc.getName(root)[Names.FirstName]} studies the fractured seams.

"I think I can fix this for you. But I'm not touching it like this. That energy could tear through me before I even start the repair."`,
                                `"Bring me a Ring of Protection. It should have a strong enough enchantment that can keep that energy from frying me alive while I work.`,
                            ],
                            {
                                [Inventory.items.ringOfProtection.count > 0 ? '"I actually already have one!"' : '"Where do I find one?"']:
                                    (rm) =>
                                        Inventory.items.ringOfProtection.count > 0
                                            ? resultRoom(
                                                  () => new DialogueTree(turnInRing(npc, root)()).getRoom(rm),
                                                  Quests.progress('mainQuest', 'fix-crown-attempt')
                                              )
                                            : resultRoom(
                                                  () => resultRoom(rm, Quests.progress('mainQuest', 'fix-crown-attempt')),
                                                  `"There's only one place in the city I'd trust for that."
                                
"Go see Arinel Wavebind. Her shop - Arinel's Enchanting. If anyone has a ring strong enough to handle this... it's her."`
                                              ),
                            }
                        ),
                }
            ),
    ];
};

const turnInRing: SpecialRemark = (npc, root) => () => {
    return [
        `${npc.getName(root)[Names.FirstName]} looks up as you approach, his sharp eyes immediately drawn to the ring. He sets his tools aside, giving a firm nod as if he already knows.

"You found one," he says, stepping forward.

The tension in the room shifts. For the first time since you recovered the crown, it feels like progress - like something broken might finally be made whole.`,
        `${npc.getName(root)[Names.FirstName]} takes the ring from you and disappears in the back room with it and the crown fragments.  

The steady rhythm of hammer against metal fills the armory as burst of colors in every hue light the walls with every pound.`,
        `After what felt like an eternity, ${npc.getName(root)[Names.FirstName]} returns to you, crown in hand.

"I was able to fuse the pieces together, however, the crown is not complete."`,
        `"Look here," ${npc.getName(root)[Names.FirstName]} gestures to five empty gem settings on the crown.

"These look to have held some kind of gemstone.  Likely something that would have channeled the energy of the crown."`,
        `"You will need to find all five gems to fully restore the crown"

${npc.getName(root)[Names.FirstName]} hands you the Abyssal Crown and the Ring of Protection.`,
        `You feel a strong vibration coming from your pouch as you hold the crown. You pull out your compass, which is spinning increasingly faster before it abruptly stops and settles, likely pointing to the next piece of your puzzle.`,
        (rm) => resultRoom(rm, [...(Quests.progress('mainQuest', 'fix-crown') ?? []), Player.addValor(1)]),
    ];
};
