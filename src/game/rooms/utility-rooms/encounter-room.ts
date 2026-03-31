import { healthToDescription, staminaToDescription } from '../../descriptions';
import { rollDice } from '../../dice';
import type { Enemy } from '../../enemies/enemy';
import { EnemyLevels } from '../../enemies/enemy-level';
import { getEnemy } from '../../enemies/get-enemy';
import { addToInventory } from '../../inventory/add-to-inventory';
import { getDamageRating } from '../../inventory/get-damage-rating';
import { getPlayerDefense } from '../../inventory/get-player-defense';
import { getWeaponOptions } from '../../inventory/get-weapon-options';
import { Inventory } from '../../inventory/inventory';
import { isCategory } from '../../inventory/is-category';
import { shootRangeWeapon } from '../../inventory/shoot-range-weapon';
import type { Item } from '../../inventory/types/item';
import { getDamage } from '../../items/damage';
import { lootTable } from '../../items/loot-table';
import { criticalChance, die, Player } from '../../player';
import { finishQuest, progressQuest, Quests } from '../../quests';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { choiceRoom } from './choice-room';
import { openInventoryRoom } from './inventory-room';
import { resultRoom } from './result-room';
import { winRoom } from './win-room';

export function encounterRoom(
    backTo: Room,
    text: string,
    enemy: Enemy,
    levelCap: number,
    timesToNextLevel?: number
): Room<{ enemy: Enemy; ammo: Item[] }> {
    return new Room(
        {
            enemy,
            ammo: [] as Item[],
        },
        (rm) => {
            if (!rm.visited)
                return (
                    text +
                    `\n\nYou are in combat with a${'aeiou'.split('').includes(rm.state.enemy.name) ? 'n' : ''} ${rm.state.enemy.name}.`
                );
            return `The ${rm.state.enemy.name} is ${healthToDescription(rm.state.enemy.health / rm.state.enemy.maxHealth)}.  You are ${healthToDescription(Player.health / Player.maxHealth)} and are ${staminaToDescription(Player.stamina / Player.maxStamina)}.`;
        },
        (rm) => {
            const weaponOptions = getWeaponOptions();
            const ammoOptions = rm.state.ammo
                .groupBy((x) => x)
                .map((x, i) => {
                    return {
                        option: i + weaponOptions.length + 1,
                        code: 'pickup-' + x.key,
                        text: `Pickup a previously used ${x.key}`,
                    };
                });

            return {
                options: [
                    ...weaponOptions,
                    ...ammoOptions,
                    {
                        code: 'inventory',
                        option: weaponOptions.length + ammoOptions.length + 1,
                        text: 'Open Inventory',
                    },
                    {
                        code: 'run',
                        option: weaponOptions.length + ammoOptions.length + 2,
                        text: 'Escape',
                    },
                ],
                select: (option) => {
                    const attackOnPlayer = (nextRoom: Room) => {
                        const enemyAttackRoll = getDamage(enemy.attack, enemy.level);
                        const playerDefense = getPlayerDefense();
                        const healthLost = Math.max(0, enemyAttackRoll - playerDefense);
                        Player.health -= healthLost;
                        Stats.healthLost = (Stats.healthLost ?? 0) + healthLost;

                        if (enemyAttackRoll <= playerDefense) {
                            Stats.attacksBlocked = (Stats.attacksBlocked ?? 0) + 1;
                        }

                        if (playerDefense > (Stats.highestDefense ?? 0)) {
                            Stats.highestDefense = playerDefense;
                        }

                        const attackMessage =
                            enemyAttackRoll > playerDefense
                                ? `The ${rm.state.enemy.name} attacks you for ${enemyAttackRoll} damage.  Your armor deflects ${playerDefense} points.`
                                : `You block the attack from the ${rm.state.enemy.name}.`;

                        if (Player.health <= 0) {
                            return resultRoom(die(backTo), attackMessage);
                        }

                        return resultRoom(nextRoom, attackMessage);
                    };

                    if (option === 'inventory') {
                        return openInventoryRoom(() => attackOnPlayer(rm), 1);
                    } else if (option === 'run') {
                        const dodgedSuccess = rollDice(6) <= 4;

                        const escaped = resultRoom(backTo, `You have escaped combat with the ${rm.state.enemy.name}.`);
                        return dodgedSuccess ? escaped : attackOnPlayer(escaped);
                    } else if (option.startsWith('pickup-')) {
                        const pickedUpAmmo = option.replace('pickup-', '') as Item;
                        const i = rm.state.ammo.indexOf(pickedUpAmmo);
                        rm.state.ammo.splice(i, 1);
                        return addToInventory(pickedUpAmmo, attackOnPlayer(rm));
                    }

                    if (Player.stamina <= 5) {
                        return resultRoom(attackOnPlayer(rm), `You are to tired to use your weapon.`);
                    }

                    Player.stamina -= 5;
                    Stats.staminaLost = (Stats.staminaLost ?? 0) + 5;

                    const weapon = option as Item;

                    let dodgePercent = 1;

                    if (isCategory('rangeWeapons', weapon)) {
                        const ammoUsed = shootRangeWeapon(weapon);
                        if (!ammoUsed) {
                            return resultRoom(rm, `You are out of ammo and cannot use your ${weapon}.`);
                        }
                        rm.state.ammo.push(ammoUsed);
                        dodgePercent += 2;
                    }

                    const weaponLevel = getDamageRating(weapon);
                    const critical = rollDice(100) <= criticalChance();
                    if (critical && Player.criticalChance > 0) {
                        Player.criticalChance -= 1;
                    }
                    const attackRoll = getDamage(7 + weaponLevel, weaponLevel) * (critical ? 2 : 1);
                    const damageInflicted = Math.max(0, attackRoll - rm.state.enemy.defense);
                    enemy.health -= damageInflicted;
                    Stats.damageInflicted = (Stats.damageInflicted ?? 0) + damageInflicted;
                    if (attackRoll > (Stats.highestDamage ?? 0)) {
                        Stats.highestDamage = attackRoll;
                    }

                    const messaging = [
                        attackRoll > rm.state.enemy.defense
                            ? `You attack for ${attackRoll}${critical ? ` (critical)` : ''} damage.  The ${rm.state.enemy.name} defends with ${rm.state.enemy.defense} points.`
                            : `The ${rm.state.enemy.name} blocks your attack.`,
                    ];

                    const healing = Math.min(Player.maxHealth - Player.health, rollDice(4, Inventory['Healing Aura'].count));
                    const energizing = Math.min(Player.maxStamina - Player.stamina, rollDice(4, Inventory['Energizing Aura'].count));

                    if (healing > 0) {
                        Player.health += healing;
                        Stats.healthRestored = (Stats.healthRestored ?? 0) + healing;
                        messaging.push(`Your healing aura heals you ${healing} health point${healing === 1 ? '' : 's'}.`);
                    }
                    if (energizing > 0) {
                        Player.stamina += energizing;
                        Stats.staminaRestored = (Stats.staminaRestored ?? 0) + energizing;
                        messaging.push(`Your energizing aura gives you ${energizing} stamina point${energizing === 1 ? '' : 's'}.`);
                    }

                    if (enemy.health < 0) {
                        if (!Stats.enemiesDefeated[enemy.name]) {
                            Stats.enemiesDefeated[enemy.name] = 0;
                        }
                        Stats.enemiesDefeated[enemy.name] += 1;

                        const loot = lootTable(enemy.level);
                        loot.forEach((l) => {
                            Inventory[l.loot].count += l.count;
                        });

                        rm.state.ammo.forEach((a) => {
                            Inventory[a].count += 1;
                        });

                        const currentProgress = Quests['defeatBoss'].completed;

                        const questProgress = [
                            loot.some((x) => isCategory('loot', x.loot)) ? progressQuest('lootIntroduction', 1) : null,
                            enemy.level === EnemyLevels.Weak
                                ? progressQuest('killTierOneEnemy', 1)
                                : enemy.level === EnemyLevels.Strong
                                  ? progressQuest('killTierTwoEnemy', 1)
                                  : enemy.level === EnemyLevels.Dangerous
                                    ? progressQuest('killTierThreeEnemy', 1)
                                    : enemy.level === EnemyLevels.Legendary
                                      ? progressQuest('killTierFourEnemy', 1)
                                      : enemy.level === EnemyLevels.Boss
                                        ? finishQuest('defeatBoss')
                                        : null,
                        ].filter((x) => x !== null && typeof x !== 'undefined');

                        const showWinScreen = !currentProgress && Quests['defeatBoss'].completed;

                        const nextRoom = choiceRoom(
                            `You have defeated the ${rm.state.enemy.name} and picked up:\n${(loot as { loot: string; count: number }[])
                                .concat(
                                    rm.state.ammo
                                        .groupBy((a) => a)
                                        .map((x) => ({
                                            count: x.values.length,
                                            loot: x.key,
                                        }))
                                )
                                .map((l) => `${l.count}x ${l.loot}`)
                                .join('\n')}`,
                            [
                                {
                                    code: 'deeper',
                                    text: 'Go deeper',
                                },
                                {
                                    code: 'back',
                                    text: 'Leave',
                                },
                            ],
                            (choice) => {
                                if (choice === 'deeper') {
                                    const effectiveTimesToNextLevel =
                                        (typeof timesToNextLevel === 'undefined' ? 4 + enemy.level : timesToNextLevel) - 1;
                                    if (effectiveTimesToNextLevel <= 0) {
                                        if (enemy.level + 1 > levelCap) {
                                            return resultRoom(backTo, 'You have cleared this area for now.');
                                        }
                                        return resultRoom(
                                            encounterRoom(backTo, text, getEnemy(Math.min(enemy.level + 1, levelCap)), levelCap),
                                            'Stronger enemies have become aware of your presence...'
                                        );
                                    }
                                    return encounterRoom(backTo, text, getEnemy(enemy.level), levelCap, effectiveTimesToNextLevel);
                                } else if (choice === 'back') {
                                    return resultRoom(backTo, 'You turn back and retrace your steps.');
                                }

                                return rm;
                            }
                        ).withInventoryAccess();

                        return resultRoom(showWinScreen ? winRoom(nextRoom) : nextRoom, [...messaging, ...questProgress]);
                    }

                    const playerDodgesAttack = rollDice(6) <= dodgePercent;

                    if (playerDodgesAttack) {
                        Stats.attacksDogged = (Stats.attacksDogged ?? 0) + 1;
                    }

                    return resultRoom(
                        playerDodgesAttack
                            ? resultRoom(rm, `You successfully dodged an attack from the ${enemy.name}.`)
                            : attackOnPlayer(rm),
                        messaging
                    );
                },
            };
        }
    );
}
