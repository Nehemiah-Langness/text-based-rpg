import { staminaToDescription } from '../../utility-functions/stamina-to-description';
import { healthToDescription } from '../../utility-functions/health-to-description';
import { Player } from '../../player';
import { Quests } from '../../quests';
import { choiceRoom } from './choice-room';
import { openInventoryRoom } from './inventory-room';
import { resultRoom } from './result-room';
import type { Room } from '../../engine/room';
import { Mood } from '../moods/mood';
import { resolveAttackRoll } from '../../combat/resolve-attack';
import { oxfordComma } from '../../utility-functions/oxford-comma';

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
                code: 'skills',
                text: 'Review your skills',
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
                const playerLevel = Player.getLevel();

                return resultRoom(
                    rm,
                    [
                        `You ${oxfordComma(
                            `are ${healthToDescription(Player.health.current / Player.health.max)} (${Player.health.current} hp) and ${staminaToDescription(
                                Player.stamina.current / Player.stamina.max
                            )} (${Player.stamina.current} sp)`
                        )}.\n\n${[
                            `You have:`,
                            `${Player.getDefense()} defense`,
                            `${Player.strength} strength`,
                            `${Player.speed} speed`,
                            `${Player.valor} valor`,
                            `${Player.truthfulness - 50} honesty`,
                            `${Player.health.max} max health`,
                            `${Player.stamina.max} max stamina`,
                        ].join('\n')}\n\nYour attack level is ${playerLevel.attack} and your defense level is ${playerLevel.defense}.`,
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
            } else if (code === 'skills') {
                const skills = Player.skillSet.getSkills();
                if (!skills.length) return resultRoom(rm, 'You have not learned any skills.').withColor(Mood.menu);

                return choiceRoom(
                    `You have learned the following skills:`,
                    skills
                        .map(({ name, skill }) => ({
                            code: name as string,
                            text: `View ${skill.name} (Level ${skill.level})`,
                        }))
                        .concat({
                            code: 'done',
                            text: 'Done',
                        }),
                    (choice, inventoryRoom) => {
                        if (choice === 'done') {
                            return rm;
                        }

                        const chosen = skills.find((q) => q.name === choice);
                        if (!chosen) {
                            return resultRoom(inventoryRoom, `You do not know that skill yet.`).withColor(Mood.menu);
                        }
                        const { skill } = chosen;

                        const estimateDamage = () => {
                            const { maxAttack, minAttack } = resolveAttackRoll({
                                level: skill.level,
                                strength: skill.attack + Player.strength,
                                penalty: 0,
                            });

                            if (maxAttack === 0) return '';
                            if (minAttack === maxAttack) return `${maxAttack} damage`;
                            return `${minAttack}-${maxAttack} damage`;
                        };

                        return resultRoom(
                            inventoryRoom,
                            [
                                `${skill.name} - Level ${skill.level}`,
                                estimateDamage(),
                                skill.modifiers?.length
                                    ? 'Applies ' + oxfordComma(...(skill.modifiers?.map((x) => `${x.effect}`) ?? []))
                                    : '',
                                skill.stamina ? `Costs ${skill.stamina} stamina point${skill.stamina === 1 ? '' : 's'}.` : '',
                                skill.coolDown ? `${skill.coolDown}-turn cool down.` : '',
                                skill.level < 10
                                    ? `${skill.xp}/${Player.skillSet.nextLevelXpRequirement(skill.level)} xp until level ${skill.level + 1}.`
                                    : '',
                            ]
                                .filter((x) => x)
                                .join('\n\n')
                        ).withColor(Mood.menu);
                    }
                ).withColor(Mood.menu);
            }

            return rm;
        }
    ).withColor(Mood.menu);
}
