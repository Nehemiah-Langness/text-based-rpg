import { rollDice } from '../dice';
import { type RoomLike } from '../engine/room';
import { type SkillName } from '../skills';
import { Player } from '../player';
import { EnemyEntity } from '../engine/enemy-entity';
import { healthToDescription } from '../utility-functions/health-to-description';
import { modifierToPastTenseVerb } from '../utility-functions/modifier-to-past-tense-verb';
import { Mood } from '../rooms/moods/mood';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { resolveAttack, resolveAttackRoll } from './resolve-attack';
import { staminaToDescription } from '../utility-functions/stamina-to-description';
import { oxfordComma } from '../utility-functions/oxford-comma';
import { openInventoryRoom } from '../rooms/utility-rooms/inventory-room';
import type { Skill } from '../engine/skill-set';
import { cleanTrailingPunctuation } from '../utility-functions/clean-trailing-punctuation';

type CombatState = {
    nonLethal?: boolean;
    onComplete?: (rm: RoomLike) => RoomLike;
    onFailure?: (rm: RoomLike) => RoomLike;
    damageDealt: number;
    damageReceived: number;
    valorDamageThreshold: number;
};

export function combatEncounter(backTo: RoomLike, enemies: EnemyEntity[], variants: CombatState): RoomLike {
    const { onComplete, onFailure } = variants ?? {};
    const completedRoom = (rm: RoomLike) => onComplete?.(rm) ?? resultRoom(rm, 'All enemies have been defeated.', undefined, Mood.battle);
    const failedRoom = () => onFailure?.(backTo) ?? resultRoom(() => Player.die(backTo), 'You have been defeated.', undefined, Mood.battle);

    if (enemies.length === 0) {
        const valor = variants.nonLethal ? 0 : Math.floor((variants.damageDealt + variants.damageReceived) / variants.valorDamageThreshold);
        return completedRoom(() =>
            resultRoom(
                backTo,
                [valor > 0 ? Player.addValor(valor) : null].filter((x) => x !== null),
                undefined,
                Mood.questComplete
            )
        );
    }
    if (Player.health.current <= 0) return failedRoom();

    return roundStart(backTo, enemies, variants);
}

function roundStart(backTo: RoomLike, enemies: EnemyEntity[], variants: CombatState) {
    const { effects, skills } = Player.coolDown();

    const staminaRegeneration = Player.energize(
        Player.modifiers
            .map((x) => {
                switch (x.effect) {
                    case 'stamina-regen-low':
                        return 5 + rollDice(10);
                    case 'stamina-regen-med':
                        return 10 + rollDice(10, 2);
                    case 'stamina-regen-high':
                        return 15 + rollDice(10, 3);
                    default:
                        return 0;
                }
            })
            .reduce((c, n) => c + n, 0)
    );

    const healthRegeneration = Player.heal(
        Player.modifiers
            .map((x) => {
                switch (x.effect) {
                    case 'health-regen-low':
                        return 4 + rollDice(6);
                    case 'health-regen-med':
                        return 8 + rollDice(6, 2);
                    case 'health-regen-high':
                        return 12 + rollDice(6, 3);
                    default:
                        return 0;
                }
            })
            .reduce((c, n) => c + n, 0)
    );

    const updates = [effects.length ? `You are no longer ${oxfordComma(...effects.map(modifierToPastTenseVerb))}.` : null]
        .concat(skills)
        .filter((x) => x)
        .join('\n\n');

    return resultRoom(
        () => playerTurn(backTo, enemies, variants),
        [
            healthRegeneration || staminaRegeneration
                ? `You regenerate ${oxfordComma(
                      ...[
                          healthRegeneration ? `${healthRegeneration} health point${healthRegeneration === 1 ? '' : 's'}` : null,
                          staminaRegeneration ? `${staminaRegeneration} stamina point${staminaRegeneration === 1 ? '' : 's'}.` : null,
                      ]
                  )}.`
                : null,
            updates ? updates : null,
        ].filter((x) => x !== null),
        undefined,
        Mood.battle
    );
}

function playerTurn(backTo: RoomLike, enemies: EnemyEntity[], variants: CombatState) {
    const { nonLethal = false } = variants ?? {};
    const currentEnemy = enemies[0];

    const playerStatus = `You are ${oxfordComma(
        healthToDescription(Player.health.current / Player.health.max),
        staminaToDescription(Player.stamina.current / Player.stamina.max),
        ...Player.modifiers.map((x) => modifierToPastTenseVerb(x.effect))
    )}`;

    const enemyStatus = `${currentEnemy.specificName} is ${oxfordComma(
        healthToDescription(currentEnemy.health.current / currentEnemy.health.max),
        staminaToDescription(currentEnemy.stamina.current / currentEnemy.stamina.max),
        ...currentEnemy.modifiers.map((x) => modifierToPastTenseVerb(x.effect))
    )}`;

    const playerSkillList = Player.skillSet.getSkills().filter((x) => !x.skill.stamina || x.skill.stamina < Player.stamina.current);
    const modifiers = Player.getModifiers();

    const estimateDamage = (skill: Skill) => {
        const { maxAttack, minAttack } = resolveAttackRoll({
            level: skill.level,
            strength: skill.attack + Player.strength + (modifiers.strength ? 3 : 0),
            penalty: modifiers.distract ? 1 : 0,
        });

        if (maxAttack === 0) return '(no damage)';
        if (minAttack === maxAttack) return `(${maxAttack} damage)`;
        return `(${minAttack}-${maxAttack} damage)`;
    };

    return choiceRoom(
        `You are in ${nonLethal ? 'non-lethal ' : ''}combat with ${currentEnemy.genericName}${enemies.length > 1 ? `.  ${enemies.length - 1} other enem${enemies.length == 2 ? 'y is' : 'ies are'} nearby` : ''}.${playerStatus ? `\n\n${playerStatus}.` : ''}${enemyStatus ? `\n\n${enemyStatus}.` : ''}`,
        modifiers.stun
            ? [
                  {
                      code: 'nothing',
                      text: `Lose turn (${modifierToPastTenseVerb('stun')})`,
                  },
              ]
            : playerSkillList
                  .map((availableSkills) => {
                      return {
                          code: `perform-${availableSkills.name}`,
                          text: `${availableSkills.skill.name} ${estimateDamage(availableSkills.skill)}${availableSkills.skill.modifiers?.length ? ' applies ' + oxfordComma(...(availableSkills.skill.modifiers?.map((x) => `${x.effect}`) ?? [])) : ''}`,
                      };
                  })
                  .concat(
                      {
                          code: 'dodge',
                          text: `Dodge attack (no damage) ${oxfordComma(...[{ effect: 'alert' as const }].map((x) => `applies ${x.effect}, +10 stamina`))}`,
                      },
                      {
                          code: 'flee',
                          text: variants.nonLethal ? 'Yield combat' : 'Flee combat',
                      },
                      {
                          code: 'inventory',
                          text: 'Open your pouch',
                      }
                  ),
        (code, rm) => {
            const nextPhase = () => enemyTurn(backTo, enemies, variants);

            if (code === 'nothing') {
                return nextPhase();
            } else if (code === 'inventory') {
                return openInventoryRoom(nextPhase, 1);
            } else if (code.startsWith('perform-')) {
                const skillName = code.replace('perform-', '') as SkillName;
                const { skill, leveledUp } = Player.useSkill(skillName);
                if (!skill) {
                    return resultRoom(nextPhase, `You are too exhausted.`, undefined, Mood.battle);
                }

                const resolvedAttack = resolveAttack(
                    {
                        level: skill.level,
                        strength: skill.attack + Player.strength + (modifiers.strength ? 3 : 0),
                        penalty: modifiers.distract ? 1 : 0,
                    },
                    {
                        armor: currentEnemy.getDefense(),
                        dodge: currentEnemy.getDodge(),
                    }
                );

                Player.addModifier(...resolvedAttack.attackerModifiers);
                if (resolvedAttack.critical !== 'fail') Player.addModifier(...(skill.perks ?? []));

                currentEnemy.health.current = Math.max(0, currentEnemy.health.current - resolvedAttack.damage);
                variants.damageDealt += resolvedAttack.damage;

                if (!resolvedAttack.dodged && resolvedAttack.critical !== 'fail') currentEnemy.addModifier(...(skill.modifiers ?? []));

                const skillAction = skill.actionDescriptionSecondPerson ?? skill.actionDescription;

                return resultRoom(
                    nextPhase,
                    [
                        resolvedAttack.critical === 'fail'
                            ? `You failed to ${cleanTrailingPunctuation(skillAction)}.`
                            : `You ${skillAction}${skill.attack ? ` doing ${resolvedAttack.attack} damage${resolvedAttack.critical === 'success' ? ' (critical)' : ''}${resolvedAttack.dodged ? ` and ${currentEnemy.specificName} dodges it.` : `.  ${currentEnemy.specificName} blocks ${resolvedAttack.damage === 0 ? `all of it.` : `${resolvedAttack.defense} points of damage.`}`}` : '.'}`,
                        resolvedAttack.attackerModifiers.length || skill.perks?.length
                            ? `You have been ${oxfordComma(
                                  ...resolvedAttack.attackerModifiers.map(
                                      (modifier) =>
                                          `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                              modifier.duration === 1 ? '' : 's'
                                          })`
                                  ),
                                  ...(resolvedAttack.critical !== 'fail' ? (skill.perks ?? []) : []).map(
                                      (modifier) =>
                                          `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                              modifier.duration === 1 ? '' : 's'
                                          })`
                                  )
                              )}.`
                            : null,
                        !resolvedAttack.dodged &&
                        resolvedAttack.critical !== 'fail' &&
                        skill.modifiers?.length &&
                        currentEnemy.health.current > 0
                            ? `${currentEnemy.specificName} has been ${oxfordComma(
                                  ...skill.modifiers.map(
                                      (modifier) =>
                                          `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                              modifier.duration === 1 ? '' : 's'
                                          })`
                                  )
                              )}.`
                            : null,
                        leveledUp ? `You have increased your damage when you ${cleanTrailingPunctuation(skillAction)}.` : null,
                    ].filter((x) => x !== null),
                    undefined,
                    Mood.battle
                );
            } else if (code === 'flee') {
                if (variants.nonLethal) {
                    return resultRoom(backTo, `You yield combat with ${currentEnemy.specificName}.`, undefined, Mood.battle);
                }
                return enemyTurn(backTo, enemies, {
                    ...variants,
                    flee: true,
                });
            } else if (code === 'dodge') {
                const { staminaGained, effect } = Player.prepareForAttack();

                return resultRoom(
                    nextPhase,
                    `You ${oxfordComma(
                        ...[`are ${modifierToPastTenseVerb(effect)}`, staminaGained > 0 ? `have gained ${staminaGained} stamina` : null]
                    )}.`,
                    undefined,
                    Mood.battle
                );
            }

            return rm;
        }
    ).withColor(Mood.battle);
}

function enemyTurn(backTo: RoomLike, enemies: EnemyEntity[], variants: CombatState & { flee?: boolean }) {
    const currentEnemy = enemies[0];
    if (currentEnemy.health.current === 0) {
        return resultRoom(
            () =>
                combatEncounter(backTo, enemies.slice(1), {
                    nonLethal: variants?.nonLethal,
                    onComplete: variants.onComplete,
                    onFailure: variants.onFailure,
                    damageDealt: variants.damageDealt,
                    damageReceived: variants.damageReceived,
                    valorDamageThreshold: variants.valorDamageThreshold,
                }),
            `${currentEnemy.specificName} ${variants.nonLethal ? `yields` : `has been defeated`}.`,
            undefined,
            Mood.battle
        );
    }

    const nextPhase = () => enemyAttack(backTo, enemies, variants);

    const { effects, skills } = currentEnemy.coolDown();

    const staminaRegeneration = currentEnemy.energize(
        currentEnemy.modifiers
            .map((x) => {
                switch (x.effect) {
                    case 'stamina-regen-low':
                        return rollDice(6);
                    case 'stamina-regen-med':
                        return rollDice(6, 2);
                    case 'stamina-regen-high':
                        return rollDice(6, 3);
                    default:
                        return 0;
                }
            })
            .reduce((c, n) => c + n, 0)
    );

    const healthRegeneration = currentEnemy.heal(
        currentEnemy.modifiers
            .map((x) => {
                switch (x.effect) {
                    case 'health-regen-low':
                        return rollDice(6);
                    case 'health-regen-med':
                        return rollDice(6, 2);
                    case 'health-regen-high':
                        return rollDice(6, 3);
                    default:
                        return 0;
                }
            })
            .reduce((c, n) => c + n, 0)
    );

    const updates = effects
        .map((x) => `${currentEnemy.specificName} is no longer ${modifierToPastTenseVerb(x)}.`)
        .concat(skills)
        .filter((x) => x)
        .join('\n\n');

    return resultRoom(
        nextPhase,
        [
            healthRegeneration || staminaRegeneration
                ? `${currentEnemy.specificName} regenerates ${oxfordComma(
                      ...[
                          healthRegeneration ? `${healthRegeneration} health point${healthRegeneration === 1 ? '' : 's'}` : null,
                          staminaRegeneration ? `${staminaRegeneration} stamina point${staminaRegeneration === 1 ? '' : 's'}.` : null,
                      ]
                  )}.`
                : null,
            updates ? updates : null,
        ].filter((x) => x !== null),
        undefined,
        Mood.battle
    );
}

function enemyAttack(backTo: RoomLike, enemies: EnemyEntity[], { flee, ...variants }: CombatState & { flee?: boolean }) {
    const currentEnemy = enemies[0];
    const nextPhase = () =>
        flee
            ? resultRoom(backTo, `You flee combat with ${currentEnemy.specificName}.`, undefined, Mood.battle)
            : combatEncounter(backTo, enemies, {
                  nonLethal: variants?.nonLethal,
                  onComplete: variants.onComplete,
                  onFailure: variants.onFailure,
                  damageDealt: variants.damageDealt,
                  damageReceived: variants.damageReceived,
                  valorDamageThreshold: variants.valorDamageThreshold,
              });

    const modifiers = currentEnemy.getModifiers();
    if (modifiers.stun) {
        return resultRoom(nextPhase, `${currentEnemy.specificName} is stunned and unable to attack.`, undefined, Mood.battle);
    }

    const enemySkillList = currentEnemy.skillSet
        .getSkills()
        .filter((x) => !x.skill.stamina || x.skill.stamina < currentEnemy.stamina.current);
    const options = enemySkillList
        .flatMap((x) => new Array(Math.max(1, x.skill.attack) * x.skill.level).fill(x) as (typeof x)[])
        .map((e) => `perform-${e.name}`)
        .concat('dodge');
    const chosenOption = options[rollDice(options.length) - 1];

    if (chosenOption.startsWith('perform-')) {
        const skillName = chosenOption.replace('perform-', '');
        const { leveledUp, skill } = currentEnemy.useSkill(skillName);
        if (!skill) {
            return resultRoom(nextPhase, `${currentEnemy.specificName} is too exhausted to do anything.`, undefined, Mood.battle);
        }

        const resolvedAttack = resolveAttack(
            {
                level: skill.level,
                strength: skill.attack + currentEnemy.strength + (modifiers.strength ? 3 : 0),
                penalty: modifiers.distract ? 1 : 0,
            },
            {
                armor: Player.getDefense(),
                dodge: Player.getDodge(),
            }
        );

        currentEnemy.addModifier(...resolvedAttack.attackerModifiers);
        if (resolvedAttack.critical !== 'fail') currentEnemy.addModifier(...(skill.perks ?? []));

        Player.health.current = Math.max(0, Player.health.current - resolvedAttack.damage);
        variants.damageReceived += resolvedAttack.damage;
        if (!resolvedAttack.dodged && resolvedAttack.critical !== 'fail') Player.addModifier(...(skill.modifiers ?? []));

        return resultRoom(
            nextPhase,
            [
                resolvedAttack.critical === 'fail'
                    ? `${currentEnemy.specificName} failed to perform a ${skill.name}.`
                    : `${currentEnemy.specificName} ${skill.actionDescription}${skill.attack ? ` doing ${resolvedAttack.attack} damage${resolvedAttack.critical === 'success' ? ' (critical)' : ''}${resolvedAttack.dodged ? ` and you dodged it.` : `.  You block ${resolvedAttack.damage === 0 ? `all of it.` : `${resolvedAttack.defense} points of damage.`}`}` : '.'}`,
                resolvedAttack.attackerModifiers.length || skill.perks?.length
                    ? `${currentEnemy.specificName} has been ${oxfordComma(
                          ...resolvedAttack.attackerModifiers.map(
                              (modifier) =>
                                  `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                      modifier.duration === 1 ? '' : 's'
                                  })`
                          ),
                          ...(resolvedAttack.critical !== 'fail' ? (skill.perks ?? []) : []).map(
                              (modifier) =>
                                  `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                      modifier.duration === 1 ? '' : 's'
                                  })`
                          )
                      )}.`
                    : null,
                !resolvedAttack.dodged && resolvedAttack.critical !== 'fail' && skill.modifiers?.length && Player.health.current > 0
                    ? `You have been ${oxfordComma(
                          ...skill.modifiers.map(
                              (modifier) =>
                                  `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${
                                      modifier.duration === 1 ? '' : 's'
                                  })`
                          )
                      )}.`
                    : null,

                leveledUp ? `${currentEnemy.specificName} has improved at ${skill.actionDescription}` : null,
            ].filter((x) => x !== null),
            undefined,
            Mood.battle
        );
    } else if (chosenOption === 'dodge') {
        const { staminaGained, effect } = currentEnemy.prepareForAttack();

        return resultRoom(
            nextPhase,
            [
                `${currentEnemy.specificName} readies for your attack.`,
                `${currentEnemy.specificName} ${oxfordComma(...[`is ${modifierToPastTenseVerb(effect)}`, staminaGained > 0 ? `${currentEnemy.specificName} has gained ${staminaGained} stamina.` : null])}`,
            ].filter((x) => x !== null),
            undefined,
            Mood.battle
        );
    }

    return nextPhase();
}
