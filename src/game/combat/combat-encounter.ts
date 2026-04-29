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
import type { PlayerEntity } from '../engine/player-entity';

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

function capitalize(text: string) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

function attack(
    backTo: RoomLike,
    {
        attacker,
        defender,
        leveledUp,
        skill,
        voice,
    }: {
        attacker: EnemyEntity | PlayerEntity;
        defender: EnemyEntity | PlayerEntity;
        skill: Skill;
        leveledUp: boolean;
        voice: 'third' | 'second';
    },
    variants: CombatState
) {
    const modifiers = attacker.getModifiers();

    const resolvedAttack = resolveAttack(
        {
            level: skill.level,
            strength: skill.attack === 0 ? 0 : skill.attack + attacker.strength + (modifiers.strength ? 3 : 0),
            penalty: modifiers.distract ? 1 : 0,
        },
        {
            armor: defender.getDefense(),
            dodge: defender.getDodge(),
        }
    );

    const allAttackerEffects = resolvedAttack.attackerModifiers.concat(resolvedAttack.critical !== 'fail' ? (skill.perks ?? []) : []);
    const allDefenderEffects = !resolvedAttack.dodged && resolvedAttack.critical !== 'fail' ? (skill.modifiers ?? []) : [];

    attacker.addModifier(...allAttackerEffects);
    defender.addModifier(...allDefenderEffects);

    defender.health.current = Math.max(0, defender.health.current - resolvedAttack.damage);
    variants.damageDealt += resolvedAttack.damage;

    const skillAction = voice === 'second' ? (skill.actionDescriptionSecondPerson ?? skill.actionDescription) : skill.actionDescription;

    const failureText = `${capitalize(attacker.specificName)} failed to perform ${skill.name}.`;
    const attackHadDamage = skill.attack > 0;
    const damageText = ` doing ${resolvedAttack.attack} damage${resolvedAttack.critical === 'success' ? ' (critical)' : ''}`;
    const dodgeText = `${defender.specificName} ${voice === 'second' ? 'dodges' : 'dodge'} the attack`;
    const blockText = `${defender.specificName} ${voice === 'second' ? 'blocks' : 'block'} ${resolvedAttack.damage === 0 ? `the attack` : `${resolvedAttack.defense} points of damage`}`;
    const successText = `${capitalize(attacker.specificName)} ${skillAction}${
        attackHadDamage
            ? `${damageText}${resolvedAttack.dodged ? ` and ${dodgeText}` : resolvedAttack.defense > 0 ? `. ${capitalize(blockText)}` : ''}`
            : resolvedAttack.dodged
              ? dodgeText
              : ''
    }.`;
    return resultRoom(
        backTo,
        [
            resolvedAttack.critical === 'fail' ? failureText : successText,
            allAttackerEffects.length
                ? `${capitalize(attacker.specificName)} ${voice === 'second' ? 'have' : 'has'} been ${oxfordComma(
                      ...allAttackerEffects.map(
                          (modifier) =>
                              `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${modifier.duration === 1 ? '' : 's'})`
                      )
                  )}.`
                : null,
            allDefenderEffects.length && defender.health.current > 0
                ? `${capitalize(defender.specificName)} ${voice === 'second' ? 'has' : 'have'} been ${oxfordComma(
                      ...allDefenderEffects.map(
                          (modifier) =>
                              `${modifierToPastTenseVerb(modifier.effect)} (${modifier.duration} turn${modifier.duration === 1 ? '' : 's'})`
                      )
                  )}.`
                : null,
            leveledUp
                ? `${capitalize(defender.specificName)} ${voice === 'second' ? 'have' : 'has'} increased ${voice === 'second' ? 'your' : 'their'} damage when ${voice === 'second' ? 'you' : 'they'} ${cleanTrailingPunctuation(skillAction)}.`
                : null,
        ].filter((x) => x !== null),
        undefined,
        Mood.battle
    );
}

function playerTurn(backTo: RoomLike, enemies: EnemyEntity[], variants: CombatState) {
    const { nonLethal = false } = variants ?? {};
    const currentEnemy = enemies[0];

    const playerStatus = `You are ${oxfordComma(
        healthToDescription(Player.health.current / Player.health.max) + ` (${Player.health.current} hp)`,
        staminaToDescription(Player.stamina.current / Player.stamina.max) + ` (${Player.stamina.current} stamina)`,
        ...Player.modifiers.map((x) => modifierToPastTenseVerb(x.effect))
    )}`;

    const enemyStatus = `${capitalize(currentEnemy.specificName)} is ${oxfordComma(
        healthToDescription(currentEnemy.health.current / currentEnemy.health.max) + ` (${currentEnemy.health.current} hp)`,
        staminaToDescription(currentEnemy.stamina.current / currentEnemy.stamina.max) + ` (${currentEnemy.stamina.current} stamina)`,
        ...currentEnemy.modifiers.map((x) => modifierToPastTenseVerb(x.effect))
    )}`;

    const playerSkillList = Player.skillSet.getSkills().filter((x) => !x.skill.stamina || x.skill.stamina < Player.stamina.current);
    const modifiers = Player.getModifiers();

    const estimateDamage = (skill: Skill) => {
        const { maxAttack, minAttack } = resolveAttackRoll({
            level: skill.level,
            strength: skill.attack === 0 ? 0 : skill.attack + Player.strength + (modifiers.strength ? 3 : 0),
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

                return attack(
                    nextPhase,
                    {
                        attacker: Player,
                        defender: currentEnemy,
                        leveledUp: leveledUp,
                        skill: skill,
                        voice: 'second',
                    },
                    variants
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
            `${capitalize(currentEnemy.specificName)} ${variants.nonLethal ? `yields` : `has been defeated`}.`,
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
        .map((x) => `${capitalize(currentEnemy.specificName)} is no longer ${modifierToPastTenseVerb(x)}.`)
        .concat(skills)
        .filter((x) => x)
        .join('\n\n');

    return resultRoom(
        nextPhase,
        [
            healthRegeneration || staminaRegeneration
                ? `${capitalize(currentEnemy.specificName)} regenerates ${oxfordComma(
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
        return resultRoom(nextPhase, `${capitalize(currentEnemy.specificName)} is stunned and unable to attack.`, undefined, Mood.battle);
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
            return resultRoom(
                nextPhase,
                `${capitalize(currentEnemy.specificName)} is too exhausted to do anything.`,
                undefined,
                Mood.battle
            );
        }

        return attack(
            nextPhase,
            {
                attacker: currentEnemy,
                defender: Player,
                leveledUp: leveledUp,
                skill: skill,
                voice: 'third',
            },
            variants
        );
    } else if (chosenOption === 'dodge') {
        const { staminaGained, effect } = currentEnemy.prepareForAttack();

        return resultRoom(
            nextPhase,
            [
                `${capitalize(currentEnemy.specificName)} takes a defensive stance.`,
                `${capitalize(currentEnemy.specificName)} ${oxfordComma(...[`is ${modifierToPastTenseVerb(effect)}`, staminaGained > 0 ? `${capitalize(currentEnemy.specificName)} has gained ${staminaGained} stamina.` : null])}`,
            ].filter((x) => x !== null),
            undefined,
            Mood.battle
        );
    }

    return nextPhase();
}
