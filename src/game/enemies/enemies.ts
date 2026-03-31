import { attackRange, getDefense } from '../items/damage';
import type { Enemy } from './enemy';

function enemyDefense(defense: number, level: number) {
    return Math.ceil(getDefense(8, level) * 0.8) * defense;
}

function enemyAttack(attack: number) {
    return 4 + attack;
}

function getEnemyHealth(base: number, level: number) {
    const { maxAttack } = attackRange(8, level);
    const defense = enemyDefense(2, level);
    const health = Math.ceil((maxAttack - defense) * 3) + base;
    return {
        health: health,
        maxHealth: health,
    };
}

export const Enemies: Enemy[][] = [
    [
        {
            name: 'Starving Wolf',
            attack: enemyAttack(4),
            defense: enemyDefense(2, 1),
            ...getEnemyHealth(8, 1),
            level: 1,
        },
        {
            name: 'Giant Rat',
            attack: enemyAttack(3),
            defense: enemyDefense(3, 1),
            ...getEnemyHealth(2, 1),
            level: 1,
        },
        {
            name: 'Wild Boar',
            attack: enemyAttack(5),
            defense: enemyDefense(1, 1),
            ...getEnemyHealth(12, 1),
            level: 1,
        },
        {
            name: 'Forest Bandit',
            attack: enemyAttack(5),
            defense: enemyDefense(1, 1),
            ...getEnemyHealth(10, 1),
            level: 1,
        },
        {
            name: 'Goblin Scout',
            attack: enemyAttack(2),
            defense: enemyDefense(3, 1),
            ...getEnemyHealth(6, 1),
            level: 1,
        },
    ],
    [
        {
            name: 'Goblin Raider',
            attack: enemyAttack(2),
            defense: enemyDefense(4, 2),
            ...getEnemyHealth(4, 2),
            level: 2,
        },
        {
            name: 'Black Bear',
            attack: enemyAttack(5),
            defense: enemyDefense(3, 2),
            ...getEnemyHealth(10, 2),
            level: 2,
        },
        {
            name: 'Bandit Archer',
            attack: enemyAttack(4),
            defense: enemyDefense(2, 2),
            ...getEnemyHealth(2, 2),
            level: 2,
        },
        {
            name: 'Giant Spider',
            attack: enemyAttack(3),
            defense: enemyDefense(1, 2),
            ...getEnemyHealth(0, 2),
            level: 2,
        },
        {
            name: 'Dire Wolf',
            attack: enemyAttack(4),
            defense: enemyDefense(3, 2),
            ...getEnemyHealth(6, 2),
            level: 2,
        },
    ],
    [
        {
            name: 'Ogre Brute',
            attack: enemyAttack(3),
            defense: enemyDefense(3, 3),
            ...getEnemyHealth(14, 3),
            level: 3,
        },
        {
            name: 'Warg Pack Leader',
            attack: enemyAttack(4),
            defense: enemyDefense(2, 3),
            ...getEnemyHealth(7, 3),
            level: 3,
        },
        {
            name: 'Hobgoblin Soldier',
            attack: enemyAttack(3),
            defense: enemyDefense(4, 3) - 3,
            ...getEnemyHealth(0, 3),
            level: 3,
        },
        {
            name: 'Cave Troll',
            attack: enemyAttack(4),
            defense: enemyDefense(3, 3),
            ...getEnemyHealth(19, 3),
            level: 3,
        },
        {
            name: 'Wyvern',
            attack: enemyAttack(6),
            defense: enemyDefense(1, 3),
            ...getEnemyHealth(11, 3),
            level: 3,
        },
    ],
    [
        {
            name: 'Ogre Chieftain',
            attack: enemyAttack(4),
            defense: enemyDefense(3, 4),
            ...getEnemyHealth(25, 4),
            level: 4,
        },
        {
            name: 'Alpha Dire Wolf',
            attack: enemyAttack(5),
            defense: enemyDefense(2, 4),
            ...getEnemyHealth(10, 4),
            level: 4,
        },
        {
            name: 'Goblin King',
            attack: enemyAttack(4),
            defense: enemyDefense(3, 4),
            ...getEnemyHealth(0, 4),
            level: 4,
        },
        {
            name: 'Hulking Troll',
            attack: enemyAttack(3),
            defense: enemyDefense(4, 4) - 4,
            ...getEnemyHealth(35, 4),
            level: 4,
        },
        {
            name: 'Spider Queen',
            attack: enemyAttack(6),
            defense: enemyDefense(1, 4),
            ...getEnemyHealth(15, 4),
            level: 4,
        },
    ],
    [
        {
            name: 'Sorcerer Warlord',
            attack: enemyAttack(7),
            defense: enemyDefense(4, 5),
            ...getEnemyHealth(64, 6),
            level: 5,
        },
    ],
];
