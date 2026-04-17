import { lootRoom } from '../combat/loot-room';
import { Npc, type GenericNpc } from '../engine/npc';
import type { Room, RoomLike } from '../engine/room';
import { Store } from '../engine/store';
import { Inventory } from '../inventory';
import { addToInventory } from '../inventory/add-to-inventory';
import { Player } from '../player';
import { Prices } from '../prices';
import { Quests } from '../quests';
import { FredsFish } from '../rooms/mermaid-city/freds-fish';
import { RoomNames } from '../rooms/names';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Names } from './npc-names';

export const Fred = new Npc(
    'fred',
    ['Fred', 'Fred', 'Fred'],
    [
        `"If you've got time to stand around, you've got time to work."`,
        `"You look like you wrestled a shark. If you didn't, you probably should've."`,
        () => [`"City picked you, huh? Guess they finally ran out of better options."`, `"Doesn't change your shift schedule."`],
        `"You don't have to prove anything to anyone. Just come back alive."`,
        `"Table by the window's been waiting. Try not to scare them off."`,
        `"Customers don't feed themselves. Well... most of them don't."`,
        `"Don't knock over the tables this time. Still fixing the last one."`,
        `"Heroes still need coin. Don't forget that."`,
        `"Ocean takes enough from us already. No need to rush it."`,
        `"Orders are simple. Don't make them complicated."`,
        `"Try smiling. Or don't. Food's good enough they'll stay anyway."`,
        `"If anyone asks, you're my best employee. Don't make me a liar."`,
        `"You come back in one piece, I might even say I expected it."`,
        `"If things get bad out there... you remember where to find this place."`,
        `"You drop it, you clean it. That's always been the rule."`,
        `"You keep showing up, I'll keep paying you. That's the deal."`,
        `"Not everyone gets chosen. Means something... whether you like it or not."`,
        `"Shift's not over just because the ocean's ending."`,
    ],
    (npc, rm, remark?: 'supplyCrateStart' | 'supplyCrateTurnIn') => {
        if (remark === 'supplyCrateStart' || Quests.getStage('fredsSupplyRun') === null) return supplyCrateStart();
        else if (remark === 'supplyCrateTurnIn' || Quests.getStage('fredsSupplyRun') === 'return-crate') return supplyCrateTurnIn(npc, rm);
        return null;
    }
)
    .meet()
    .move(FredsFish)
    .hasStore((rm) =>
        rm.name === RoomNames.mermaidCity.freds
            ? new Store(Inventory, (item) => item.category === 'food', {
                  leaveStoreText: 'Get up from your table',
                  openShopText: 'Sit down and order some food',
                  priceModifier: 1.15,
                  shopText: () => `Fred swims up to your table, "What can I get for you?" he says with an impatient grunt.`,
              })
            : null
    );

const supplyCrateStart = () => () => [
    `"Had a supply crate go missing a few days back... drifted north, I think."
                
"Last I heard, it sank somewhere near that old wreck by the Sacred Gardens."

"If it's still intact, it's worth something. If it's not... still worth checking."

"You head that way, keep an eye out. I don't like losing inventory."`,
    (rm: RoomLike) =>
        Quests.progress(rm, 'fredsSupplyRun', 'travel-shipwreck', {
            shouldStartQuest: true,
        }),
];

const supplyCrateTurnIn = (npc: GenericNpc, room: Room) => () => [
    (rm: RoomLike) =>
        choiceRoom(
            `"I see you have my crate.  I hope it wasn't too much trouble.`,
            [
                {
                    code: 'truth',
                    text: 'Return all items with the crate (Honesty)',
                },
                {
                    code: 'lie',
                    text: 'Keep some items for yourself (Lie)',
                },
            ],
            (code, choiceRoom) => {
                const reward = Prices.get('quest', 1);

                const questCompletion = () =>
                    resultRoom(
                        () =>
                            addToInventory(
                                'coralShard',
                                Quests.finish(rm, 'fredsSupplyRun'),
                                `You receive ${reward} coral shards.`,
                                reward
                            ),
                        'Fred hands you a handful of coral shards.'
                    );

                if (code === 'truth') {
                    return resultRoom(questCompletion, [
                        `"It looks like everything is accounted for," Fred states with a little more enthusiasm than his normal.
                                    
"Here's a little something for your trouble."`,
                        Player.addTruth(5),
                    ]);
                } else if (code === 'lie') {
                    const lootTable = Inventory.createLootTable([
                        [
                            {
                                item: 'spicedFishPlatter',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'kelpNoodleBowl',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'coralFruitMedley',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'herbalBroth',
                                chance: 1,
                                number: 2,
                            },
                        ],
                        [
                            {
                                item: 'spicedFishPlatter',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'kelpNoodleBowl',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'coralFruitMedley',
                                chance: 1,
                                number: 2,
                            },
                            {
                                item: 'herbalBroth',
                                chance: 1,
                                number: 2,
                            },
                        ],
                        [
                            {
                                item: 'deepCurrentElixir',
                                chance: 2,
                                number: 1,
                            },
                            {
                                item: 'grilledSharkFillet',
                                chance: 1,
                                number: 1,
                            },
                            {
                                item: 'bloomTonic',
                                chance: 2,
                                number: 1,
                            },
                        ],
                    ]);

                    const loot = lootTable.roll();

                    return lootRoom(
                        () =>
                            resultRoom(questCompletion, [
                                `\n\n${loot.map(({ item, count }) => `${Inventory.get(item).name} (x${count})`).join('\n')}`,
                                Player.addTruth(-10),
                                `"Figures", says ${npc.getName(room)[Names.FirstName]}, "several things are missing from the crate.  Must have gotten picked off by the sharks while it sat out by the shipwreck."
                                    
"Still, Here's a little something for your trouble."`,
                            ]),
                        `You quickly stash away several items from the top of the crate before returning it to Fred.  You pocket:`,
                        loot
                    );
                }

                return choiceRoom;
            }
        ),
];
