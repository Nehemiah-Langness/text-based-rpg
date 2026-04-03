import { rollDice } from '../dice';
import { type RoomLike, Room } from '../engine/room';
import { Skills, SkillSet, type SkillModifier, type SkillName } from '../knowledge';
import { Player } from '../player';
import { healthToDescription } from '../utility-functions/health-to-description';
import { modifierToPastTenseVerb } from '../utility-functions/modifier-to-past-tense-verb';
import { Mood } from '../rooms/moods/mood';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import type { Enemy } from './enemy';
import { resolveAttack } from './resolve-attack';

export function combatEncounter(
    backTo: RoomLike,
    enemies: Enemy[],
    variants?: {
        nonLethal?: boolean;
        completeText?: string;
        onComplete?: (rm: RoomLike) => RoomLike;
        onFailure?: (rm: RoomLike) => RoomLike;
    }
): Room {
    const { nonLethal = false, completeText, onComplete, onFailure } = variants ?? {};
    if (enemies.length === 0)
        return resultRoom(onComplete ? onComplete(backTo) : backTo, completeText ?? 'All enemies have been defeated.');

    const currentEnemy = enemies[0];
    const skillList = Skills.getSkills();
    const enemySkills = new SkillSet(currentEnemy.moves);

    const coolDownPhase = (backTo: RoomLike) => {
        const playerCoolDowns = Player.coolDown();
        const playerMoveCoolDowns = Skills.coolDown();

        return resultRoom(
            backTo,
            playerCoolDowns.map((x) => `You are no longer ${modifierToPastTenseVerb(x)}.`).concat(playerMoveCoolDowns),
            undefined,
            Mood.battle
        );
    };

    const enemyCoolDownPhase = (backTo: RoomLike) => {
        const enemyCoolDowns = currentEnemy.effects.filter((x) => x.duration === 1).map((x) => x.effect);
        currentEnemy.effects = currentEnemy.effects
            .map((e) => ({
                ...e,
                duration: e.duration - 1,
            }))
            .filter((x) => x.duration > 0);
        enemySkills.coolDown();

        return resultRoom(
            () => enemyAttackPhase(backTo),
            enemyCoolDowns.map((x) => `${currentEnemy.specificName} is no longer ${modifierToPastTenseVerb(x)}`),
            undefined,
            Mood.battle
        );
    };

    const addEnemyModifier = (modifier: (typeof currentEnemy.effects)[number]) => {
        const current = currentEnemy.effects.find((e) => e.effect === 'alert');
        if (current) {
            current.duration += modifier.duration;
        } else {
            currentEnemy.effects.push(modifier);
        }
    };

    const enemyAttackPhase = (backTo: RoomLike) => {
        if (currentEnemy.effects.find((e) => e.effect === 'stun')) {
            return resultRoom(
                () => coolDownPhase(backTo),
                `${currentEnemy.specificName} is ${modifierToPastTenseVerb('stun')} and unable to make an attack.`,
                undefined,
                Mood.battle
            );
        }

        const eligibleSkills = enemySkills.getSkills();
        if (eligibleSkills.length === 0) {
            addEnemyModifier({
                duration: 1,
                effect: 'alert',
            });
            return resultRoom(
                () => coolDownPhase(backTo),
                `${currentEnemy.specificName} has ${modifierToPastTenseVerb('alert')}.`,
                undefined,
                Mood.battle
            );
        }

        const pickedSkill = enemySkills.useSkill(eligibleSkills[rollDice(eligibleSkills.length) - 1].name);

        const enemyAttack = resolveAttack(
            {
                level: currentEnemy.level,
                penalty: currentEnemy.effects.find((e) => e.effect === 'distract') ? 1 : 0,
                strength: pickedSkill.attack,
            },
            {
                armor: currentEnemy.defense,
                dodge: currentEnemy.dodge + (currentEnemy.effects.find((e) => e.duration > 0 && e.effect === 'alert') ? 2 : 0),
            }
        );

        if (enemyAttack.attackerModifiers.length) {
            enemyAttack.attackerModifiers.forEach((modifier) => addEnemyModifier({ ...modifier, duration: modifier.duration + 1 }));
        }

        if (enemyAttack.dodged) {
            return resultRoom(
                () => coolDownPhase(backTo),
                `You dodged ${currentEnemy.specificName}'s ${pickedSkill.name}.`,
                undefined,
                Mood.battle
            );
        }

        pickedSkill.modifiers?.forEach((x) =>
            Player.addModifier({
                ...x,
                duration: x.duration + 1,
            })
        );

        const damageDone = enemyAttack.attack - enemyAttack.defense;
        Player.health.current = Math.max(0, Player.health.current - damageDone);

        return resultRoom(
            () =>
                Player.health.current < 1
                    ? Room.resolve(onFailure?.(backTo) ?? resultRoom(Player.die(backTo), 'You have been defeated.', undefined, Mood.battle))
                    : coolDownPhase(backTo),
            [
                enemyAttack.critical === 1
                    ? `${currentEnemy.specificName} failed a ${pickedSkill.name}.`
                    : `${currentEnemy.specificName} performs a ${pickedSkill.name}${
                          damageDone > 0
                              ? ` and damages you ${damageDone} point${damageDone === 1 ? '' : 's'}${
                                    enemyAttack.critical === 20 ? ' (Critical)' : ''
                                }`
                              : enemyAttack.attack > 0
                              ? '. You block the attack'
                              : ''
                      }.`,
                ...(pickedSkill.modifiers?.map(
                    (modifier) =>
                        `You have been ${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                            modifier.duration === 1 ? '' : 's'
                        }).`
                ) ?? []),
                ...enemyAttack.attackerModifiers.map(
                    (modifier) =>
                        `${currentEnemy.specificName} has been ${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                            modifier.duration === 1 ? '' : 's'
                        }).`
                ),
            ],
            undefined,
            Mood.battle
        );
    };

    const modifiers = Player.modifiers
        .filter((x) => x.duration > 0)
        .reduce(
            (c, n) =>
                Object.assign(c, {
                    [n.effect]: true,
                }),
            {} as Record<SkillModifier, boolean | undefined>
        );

    if (modifiers.stun) {
        return resultRoom(
            () => enemyCoolDownPhase(() => combatEncounter(backTo, enemies, variants)),
            `You are currently stunned and unable to attack.`,
            undefined,
            Mood.battle
        );
    }

    const playerAttackPhase = () =>
        choiceRoom(
            `You are in ${nonLethal ? 'non-lethal ' : ''}combat with ${currentEnemy.genericName}.  You are ${healthToDescription(
                Player.health.current / Player.health.max
            )}${Player.modifiers.length ? ` and ${Player.modifiers.map((x) => modifierToPastTenseVerb(x.effect)).join(', ')}` : ''}.  ${
                currentEnemy.specificName
            } is ${healthToDescription(currentEnemy.health.current / currentEnemy.health.max)}${
                currentEnemy.effects.length ? ` and ${currentEnemy.effects.map((x) => modifierToPastTenseVerb(x.effect)).join(', ')}` : ''
            }.`,
            skillList
                .map((learnedSkill) => {
                    return {
                        code: `perform-${learnedSkill.name}`,
                        text: learnedSkill.skill.name,
                    };
                })
                .concat(
                    {
                        code: 'dodge',
                        text: 'Dodge attack',
                    },
                    {
                        code: 'flee',
                        text: 'Flee combat',
                    }
                ),
            (code, rm) => {
                const nextTurn = () => combatEncounter(backTo, enemies, variants);

                if (code.startsWith('perform-')) {
                    const skillName = code.replace('perform-', '') as SkillName;
                    const skill = Skills.useSkill(skillName);

                    const playerAttack = resolveAttack(
                        {
                            level: skill.level,
                            strength: skill.attack,
                            penalty: modifiers.distract ? 1 : 0,
                        },
                        {
                            armor: currentEnemy.defense,
                            dodge: currentEnemy.dodge + (currentEnemy.effects.find((e) => e.duration > 0 && e.effect === 'alert') ? 2 : 0),
                        }
                    );

                    if (playerAttack.attackerModifiers.length) {
                        playerAttack.attackerModifiers.forEach((modifier) =>
                            Player.addModifier({
                                ...modifier,
                                duration: modifier.duration + 1,
                            })
                        );
                    }

                    if (playerAttack.dodged) {
                        return resultRoom(
                            () => enemyCoolDownPhase(nextTurn),
                            `${currentEnemy.specificName} dodged your attack.`,
                            undefined,
                            Mood.battle
                        );
                    }

                    const damageDone = playerAttack.attack - playerAttack.defense;
                    currentEnemy.health.current = Math.max(0, currentEnemy.health.current - damageDone);

                    skill.modifiers?.forEach((modifier) =>
                        addEnemyModifier({
                            ...modifier,
                            duration: modifier.duration + 1,
                        })
                    );

                    return resultRoom(
                        currentEnemy.health.current === 0
                            ? () =>
                                  resultRoom(
                                      () => combatEncounter(backTo, enemies.slice(1), variants),
                                      [
                                          `You have defeated ${currentEnemy.specificName}`,
                                          ...Skills.coolDown(true).concat(Player.coolDown(true)),
                                      ],
                                      undefined,
                                      Mood.battle
                                  )
                            : () => enemyCoolDownPhase(nextTurn),
                        [
                            playerAttack.critical === 1
                                ? `You fail a ${skill.name}.`
                                : `You perform a ${skill.name}${
                                      damageDone > 0
                                          ? ` and damage ${currentEnemy.specificName} ${damageDone} point${damageDone === 1 ? '' : 's'}${
                                                playerAttack.critical === 20 ? ' (Critical)' : ''
                                            }`
                                          : playerAttack.attack > 0
                                          ? `. ${currentEnemy.specificName} blocks the attack`
                                          : ''
                                  }.`,
                            ...playerAttack.attackerModifiers.map(
                                (modifier) =>
                                    `You have been ${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                        modifier.duration === 1 ? '' : 's'
                                    }).`
                            ),
                            ...(skill.modifiers?.map(
                                (modifier) =>
                                    `${currentEnemy.specificName} has been ${modifierToPastTenseVerb(modifier.effect)} (${
                                        modifier.duration
                                    } turn${modifier.duration === 1 ? '' : 's'}).`
                            ) ?? []),
                        ],
                        undefined,
                        Mood.battle
                    );
                } else if (code === 'flee') {
                    return enemyCoolDownPhase(() => resultRoom(backTo, 'You flee combat.'));
                } else if (code === 'dodge') {
                    Player.addModifier({ duration: 1, effect: 'alert' });
                    return resultRoom(
                        () => enemyCoolDownPhase(nextTurn),
                        `You are ${modifierToPastTenseVerb('alert')}.`,
                        undefined,
                        Mood.battle
                    );
                }

                return rm;
            }
        ).withColor(Mood.battle);

    return playerAttackPhase();
}
