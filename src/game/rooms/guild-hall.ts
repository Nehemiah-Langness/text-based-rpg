import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { emptyFromInventory } from '../inventory/empty-from-inventory';
import { Inventory } from '../inventory/inventory';
import { Knowledge } from '../knowledge';
import { GuildMasterNpc } from '../npcs/guild-master-npc';
import { finishQuest, progressQuest, Quests, startQuest } from '../quests';
import { Stats } from '../stats';
import { Room } from '../engine/room';
import { resultRoom } from './utility-rooms/result-room';

const IntroDescription = (
    rm: Room
) => `The heavy doors of the guild hall creak open and a sharp-eyed man sites behind a polished oak desk${Knowledge.guildMasterName ? `, presumably this would be ${GuildMasterNpc.getName(rm)[1]}, the guild master` : ''}. He gives you a sly grin.

The warm glow of lanterns bouncing off the polished wooden floor. The air carries the faint scent of parchment and ink, mingled with the tang of well-worn leather and a hint of pine from the timbered beams overhead. Along the walls, sturdy oak shelves are lined with neatly organized ledgers.`;

const RoomDescription = (
    rm: Room
) => `The warm glow of lanterns bouncing off the polished wooden floor of the guild hall. The air carries the faint scent of parchment and ink, mingled with the tang of well-worn leather and a hint of pine from the timbered beams overhead. Along the walls, sturdy oak shelves are lined with neatly organized ledgers.

${Knowledge.guildMasterName ? `${GuildMasterNpc.getName(rm)[0]}, the guild master,` : 'A man'} sits behind a polished oak desk by the door. Piles of work requests and neatly stacked scrolls surround him, while a small bronze bell rests within reach, ready to summon assistance.
`;

export const GuildHall = new Room(
    {
        lootLooted: false,
        guildKeeperConversation: 0,
    },
    (rm) => {
        const questProgressed = progressQuest('guildIntroduction', 1);

        if (!rm.visited) {
            return [IntroDescription(rm), questProgressed];
        }
        return [
            RoomDescription(rm),
            rm.investigated && !rm.state.lootLooted ? 'A small bag of loot sits abandoned on the floor amongst some clutter.' : null,
            questProgressed,
        ];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'talk-guild-master',
                text: 'Talk to ' + (Knowledge.guildMasterName ? GuildMasterNpc.getName(rm)[1] : 'the man behind the desk'),
            },
        ];

        if (Quests.killTierOneEnemy.active || Quests.killTierOneEnemy.completed) {
            options.push({
                code: 'turn-in-kills',
                text: 'Turn in enemy kills',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.lootLooted) {
            options.push({
                code: 'loot-loot',
                text: 'Pick up loot',
            });
        }

        options.push({
            text: 'Leave the guild hall',
            code: 'travel-east',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(
                    "Among some clutter in a corner, you spot a seemingly long-forgotten back of loot from someone's previous adventuring."
                );
            } else if (choice === 'loot-loot') {
                rm.state.lootLooted = true;
                return addToInventory('Loot (4-7g)', rm);
            } else if (choice === 'turn-in-kills') {
                const gold =
                    Inventory['Proof of Enemy Kill (Weak)'].count * 6 +
                    Inventory['Proof of Enemy Kill (Strong)'].count * 55 +
                    Inventory['Proof of Enemy Kill (Dangerous)'].count * 505 +
                    Inventory['Proof of Enemy Kill (Legendary)'].count * 1054;

                if (!gold) {
                    return resultRoom(rm, 'You do not have any kills to turn in right now.');
                }

                const finishedQuests = [
                    Inventory['Proof of Enemy Kill (Weak)'].count ? finishQuest('killTierOneEnemy') : null,
                    Inventory['Proof of Enemy Kill (Strong)'].count ? finishQuest('killTierTwoEnemy') : null,
                    Inventory['Proof of Enemy Kill (Dangerous)'].count ? finishQuest('killTierThreeEnemy') : null,
                    Inventory['Proof of Enemy Kill (Legendary)'].count ? finishQuest('killTierFourEnemy') : null,
                ].filter((x) => x);
                if (finishedQuests.length) {
                    finishedQuests.push(startQuest('talkToGuildMaster'));
                }

                emptyFromInventory(
                    'Proof of Enemy Kill (Weak)',
                    'Proof of Enemy Kill (Strong)',
                    'Proof of Enemy Kill (Dangerous)',
                    'Proof of Enemy Kill (Legendary)'
                );

                Inventory['Gold Coin'].count += gold;
                Stats.goldEarned = (Stats.goldEarned ?? 0) + gold;

                return resultRoom(
                    rm,
                    [
                        `You have turned in all your kills for ${gold} gold coins.`,
                        finishQuest('guildIntroduction'),
                        ...finishedQuests,
                    ].filter((x) => x !== null && typeof x !== 'undefined')
                );
            } else if (choice === 'talk-guild-master') {
                return GuildMasterNpc.getConversation(rm);
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
    .atLocation('B', 4);
