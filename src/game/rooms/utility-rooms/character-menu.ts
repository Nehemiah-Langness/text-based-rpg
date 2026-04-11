import { staminaToDescription } from '../../utility-functions/stamina-to-description';
import { healthToDescription } from '../../utility-functions/health-to-description';
import { Player } from '../../player';
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
                text: 'Look in your pouch',
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
                return resultRoom(
                    rm,
                    [
                        `You are ${healthToDescription(Player.health.current / Player.health.max)} and ${staminaToDescription(
                            Player.stamina.current / Player.stamina.max
                        )}.`,
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
                                    (stage, stageIndex) =>
                                        `${stageIndex + 1}. ${stage.stage} ${stageIndex < quest.progress ? '(COMPLETED)' : ''}`
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
