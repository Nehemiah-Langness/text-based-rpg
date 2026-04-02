import { healthToDescription, staminaToDescription } from '../../descriptions';
import { getItemsEquipped } from '../../inventory/get-items-equipped';
import { getPlayerDefense } from '../../inventory/get-player-defense';
import { isCategory } from '../../inventory/is-category';
import { criticalChance, Player } from '../../player';
import { Quests } from '../../quests';
import { choiceRoom } from './choice-room';
import { openInventoryRoom } from './inventory-room';
import { resultRoom } from './result-room';
import type { Room } from '../../engine/room';
import { Mood } from '../moods/mood';

export function characterMenu(backTo: Room) {
    return choiceRoom(
        '',
        [
            {
                code: 'inventory',
                text: 'Look in your pack',
            },
            {
                code: 'health',
                text: 'Check your physical well-being',
            },
            {
                code: 'quests',
                text: 'Review your current quests',
            },
            {
                code: 'back',
                text: 'Done',
            },
        ],
        (code, rm) => {
            if (code === 'back') {
                return backTo;
            } else if (code === 'inventory') {
                return openInventoryRoom(rm);
            } else if (code === 'health') {
                const defense = getPlayerDefense();
                const farmingBonus = getItemsEquipped().filter((x) => isCategory('farmingBonus', x)).length;
                const criticalPoints = criticalChance() - 5;
                return resultRoom(
                    rm,
                    [
                        `You are ${healthToDescription(Player.health / Player.maxHealth)} and ${staminaToDescription(
                            Player.stamina / Player.maxStamina
                        )}.`,
                        defense ? ` You have a defense of ${defense}.` : null,
                        criticalPoints > 0 ? `You have +${criticalPoints} luck points.` : null,
                        farmingBonus ? `You have a farming bonus of +${farmingBonus}.` : null,
                    ].filter((x) => x !== null && typeof x !== 'undefined'),
                    undefined,
                    Mood.menu
                );
            } else if (code === 'quests') {
                const currentQuests = Quests.getActiveQuests();
                if (!currentQuests.length)
                    return resultRoom(
                        rm,
                        "You have not been given any quests yet.  Perhaps if you talk to people, they'll have some quests for you."
                    ).withColor(Mood.menu);

                return choiceRoom(
                    `You have been given the following quests:`,
                    currentQuests
                        .map((quest) => ({
                            code: quest.name,
                            text: `${quest.name}${quest.completed ? ' (COMPLETED)' : ''}`,
                        }))
                        .concat({
                            code: 'done',
                            text: 'Done',
                        }),
                    (choice, inventoryRoom) => {
                        if (choice === 'done') {
                            return rm;
                        }

                        const quest = currentQuests.find((q) => q.name === choice);
                        if (!quest) {
                            return resultRoom(inventoryRoom, `You have not been given the quest "${choice}" yet.`).withColor(Mood.menu);
                        }

                        return resultRoom(
                            inventoryRoom,
                            `${quest.name}${quest.completed ? ' (COMPLETED)' : ''}\n\n${quest.stages
                                .filter((_stage, index) => index <= quest.progress)
                                .map(
                                    (stage, stageIndex) => `${stageIndex + 1}. ${stage} ${stageIndex < quest.progress ? '(COMPLETED)' : ''}`
                                )
                                .join('\n')}`
                        ).withColor(Mood.menu);
                    }
                ).withColor(Mood.menu);
            }

            return rm;
        }
    ).withColor(Mood.menu);
}
