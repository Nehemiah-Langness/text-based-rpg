import { fullRest } from '../full-rest';
import type { InputOption } from '../input-option';
import { Inventory } from '../inventory/inventory';
import { Knowledge } from '../knowledge';
import { HunterNpc } from '../npcs/hunter-npc';
import { InnKeeperNpc } from '../npcs/inn-keeper-npc';
import { Names, NpcNames } from '../npcs/npc-names';
import { energize, heal, Player } from '../player';
import { finishQuest, progressQuest } from '../quests';
import { Stats } from '../stats';
import { Room } from '../engine/room';
import { innShop } from './shops/inn-shop';
import { resultRoom } from './utility-rooms/result-room';

const RoomDescription = () => {
    return `You are inside the village inn, greeted by the warmth of a crackling hearth and the comforting smell of fresh stew and baked bread. Rough wooden tables fill the common room, where travelers and villagers sit talking quietly over mugs of ale.

Behind the counter, ${Knowledge.innKeeperName ? NpcNames['Inn Keeper'][Names.NickName] : 'the innkeeper'} watches the room with a practiced eye, ready to serve a meal, share a bit of local gossip, or arrange a room for the night. It's a welcoming place - good for food, information about the village, or a warm bed after a long day on the road.

${Knowledge.innKeeperWifeName ? `His wife, ${NpcNames['Inn Keeper Wife'][Names.FirstName]},` : 'A barmaid'} keeps busy servicing tables and keeping the inn tidy.

${Knowledge.hunterName ? NpcNames['Hunter'][Names.NickName] : 'A lone hunter'} sits at a small table near the wall, quietly working through a simple supper of bread and roasted meat. His cloak, still dusted with bits of forest leaf and bark, hangs over the back of his chair.`;
};

export const VillageInn = new Room(
    {
        goldLooted: false,
    },
    (rm) => {
        return [
            RoomDescription(),
            rm.investigated && !rm.state.goldLooted ? 'Under an empty table, a few gold coins shimmer on the floor.' : null,
            progressQuest('stayAtInn', 1, 0),
        ];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'talk-innkeeper',
                text: 'Talk to ' + (Knowledge.innKeeperName ? InnKeeperNpc.getName(rm)[Names.FirstName] : 'the innkeeper'),
            },
            {
                code: 'talk-hunter',
                text: 'Talk to ' + (Knowledge.hunterName ? HunterNpc.getName(rm)[Names.FirstName] : 'the hunter'),
            },
            {
                code: 'rent-room',
                text: 'Rent a room for the night (5g)',
            },
            {
                code: 'shop',
                text: 'Sit down at the hearth',
            },
        ];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.goldLooted) {
            options.push({
                code: 'loot-gold',
                text: 'Pick up gold coins',
            });
        }

        options.push({
            text: 'Leave the inn',
            code: 'travel-east',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate('You notice a few gold coins shimmer on the floor under a nearby empty table.');
            } else if (choice === 'loot-gold') {
                rm.state.goldLooted = true;
                Inventory['Gold Coin'].count += 3;
                Stats.goldEarned = (Stats.goldEarned ?? 0) + 3;

                return resultRoom(rm, `You have picked up 3 gold coins`);
            } else if (choice === 'shop') {
                return innShop(rm);
            } else if (choice === 'rent-room') {
                if (Inventory['Gold Coin'].count < 5) {
                    return resultRoom(
                        rm,
                        "You do not have enough gold to rent the room.  If you cannot find a way to get more gold, you'll be setting up camp in the clearing tonight."
                    );
                }

                Inventory['Gold Coin'].count -= 5;
                Stats.goldSpent = (Stats.goldSpent ?? 0) + 5;
                const questComplete = finishQuest('stayAtInn');

                Player.criticalChance = 0;

                return resultRoom(
                    heal(energize(questComplete ? resultRoom(() => fullRest(rm), questComplete) : () => fullRest(rm), 100, 4), 100),
                    `After a long day, you hand a 5 coins to the innkeeper and secure a small room for the night. The chamber is simple but comfortable - a narrow bed with a wool blanket, a wooden chair by the wall, and a small candle flickering beside the window. From below, the low murmur of tavern voices and the occasional burst of laughter drift up through the floorboards.

You can finally rest. Your armor loosens, your boots come off, and the quiet warmth of the room begins to chase away the fatigue of the journey. Outside, the village settles into the calm of night, while inside you allow yourself a rare moment of peace before sleep finally takes you.`
                );
            } else if (choice === 'talk-innkeeper') {
                return InnKeeperNpc.getConversation(rm);
            } else if (choice === 'talk-hunter') {
                return HunterNpc.getConversation(rm);
            }
            const traveled = rm.travel(choice);
            if (traveled) return traveled;

            return rm;
        };

        return {
            options: options,
            select: select,
        };
    }
)
    .withInventoryAccess()
    .atLocation('A', 4);
