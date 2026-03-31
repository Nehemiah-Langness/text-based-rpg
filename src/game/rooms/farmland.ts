import { staminaToDescription } from '../descriptions';
import { rollDice } from '../dice';
import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { getItemsEquipped } from '../inventory/get-items-equipped';
import { Inventory } from '../inventory/inventory';
import { isCategory } from '../inventory/is-category';
import { LargeStick } from '../items/large-stick';
import { Rock } from '../items/rock';
import { Knowledge } from '../knowledge';
import { FarmerNpc } from '../npcs/farmer-npc';
import { Names, NpcNames } from '../npcs/npc-names';
import { Player } from '../player';
import { finishQuest, progressQuest, Quests } from '../quests';
import { Stats } from '../stats';
import { Room } from '../engine/room';
import { resultRoom } from './utility-rooms/result-room';

const RoomDescription = () => {
    return `Golden fields stretch across the countryside in a patchwork of crops and pasture. Wooden fences divide the land, and a few quiet farmhouses and barns sit scattered among the rows. The scent of soil and hay lingers in the warm sun, and the distant creak of a windmill turns slowly in the breeze.

${Knowledge.farmerName ? NpcNames['Farmer'][Names.FullName] : 'A farmer'} leans against a wooden fence nearby.

To the north, the land eases downward towards a large lake.

To the west, the land rises into a grassy hilltop clearing, where a road continues on towards a small village in the distance.

To the south, trees scatter into a light woodland.`;
};

export const Farmland = new Room(
    {
        strawHat: false,
        rockLooted: false,
        largeStickLooted: false,
        workLeft: 100,
    },
    (rm) => {
        return [
            RoomDescription(),
            rm.investigated && !rm.state.strawHat
                ? 'A worn straw hat, seemingly left behind from a farmer lays on the ground in a field nearby.'
                : null,
            rm.investigated && !rm.state.rockLooted ? Rock.investigationLanguage : null,
            rm.investigated && !rm.state.largeStickLooted ? LargeStick.investigationLanguage : null,
            progressQuest('farmingIntroduction', 1, 0),
        ];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'talk-farmer',
                text: 'Talk to ' + (Knowledge.farmerName ? `${FarmerNpc.getName(rm)[Names.FirstName]}` : 'the farmer'),
            },
        ];

        if (Quests.farmingIntroduction.active || Quests.farmingIntroduction.completed) {
            options.push({
                text: 'Work the fields',
                code: 'work',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else {
            if (!rm.state.strawHat) {
                options.push({
                    code: 'loot-straw-hat',
                    text: 'Pick up straw hat',
                });
            }
            if (!rm.state.rockLooted) {
                options.push({
                    code: 'loot-rock',
                    text: 'Pick up rock',
                });
            }
            if (!rm.state.largeStickLooted) {
                options.push({
                    code: 'loot-stick',
                    text: 'Pick up stick',
                });
            }
        }

        options.push(
            {
                text: 'Go north to the lake',
                code: 'travel-north',
            },
            {
                text: 'Go south into the woodlands',
                code: 'travel-south',
            },
            {
                text: 'Go west towards the village',
                code: 'travel-west',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(
                    [
                        'You spot a worn straw hat, seemingly left behind from a farmer lays on the ground in a field nearby.  You also find a large rock and a sturdy stick just off the road.  A sturdy stick could be useful for smacking undesired strangers you meet, and nothing will make wildlife scatter like chucking a large rock at them.',
                    ].join('\n\n')
                );
            } else if (choice === 'loot-stick') {
                rm.state.largeStickLooted = true;
                return addToInventory('Large Stick', rm);
            } else if (choice === 'loot-rock') {
                rm.state.rockLooted = true;
                return addToInventory('Rock', rm);
            } else if (choice === 'loot-straw-hat') {
                rm.state.strawHat = true;
                return addToInventory('Straw Hat', rm);
            } else if (choice === 'talk-farmer') {
                return FarmerNpc.getConversation(rm);
            }
            if (choice === 'work') {
                const minStamina = 15;
                const staminaBonus = getItemsEquipped().filter((x) => isCategory('farmingBonus', x)).length * 15;

                if (Player.stamina + staminaBonus <= minStamina) {
                    return resultRoom(rm, 'You are too exhausted to work in the fields right now.');
                } else if (rm.state.workLeft <= 0) {
                    return resultRoom(rm, 'There is no more work to be done in the fields.');
                }

                const workDone = Math.min(rm.state.workLeft, Player.stamina + staminaBonus - minStamina, staminaBonus + 10 + rollDice(15));
                rm.state.workLeft -= workDone;
                const staminaSpent = Math.max(0, workDone - staminaBonus);
                Player.stamina -= staminaSpent;
                Stats.staminaLost = (Stats.staminaLost ?? 0) + staminaSpent;

                const gold = rollDice(2, Math.ceil(workDone / 2));
                Inventory['Gold Coin'].count += gold;
                Stats.goldEarned = (Stats.goldEarned ?? 0) + gold;

                Stats.goldFromFarming = (Stats.goldFromFarming ?? 0) + gold;

                return resultRoom(
                    rm,
                    [
                        ...FarmerNpc.getSpecialRemark('workCompleted', rm),
                        ...FarmerNpc.getSpecialRemark(rm.state.workLeft > 0 ? 'moreWork' : 'noMoreWork', rm),
                        `You received ${gold} gold coins and you now are ${staminaToDescription(Player.stamina / Player.maxStamina)}.`,
                        staminaBonus
                            ? null
                            : 'This work was difficult in your current attire and wore you down considerably more than it should have.',
                        finishQuest('farmingIntroduction'),
                    ].filter((x) => x !== null && typeof x !== 'undefined')
                );
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
    .atLocation('D', 6);
