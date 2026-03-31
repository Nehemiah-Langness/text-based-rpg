import { rollDice } from '../dice';
import { Quests } from '../quests';
import { Enemies } from './enemies';
import { EnemyLevels } from './enemy-level';

export function getEnemy(level: number) {
    if (level >= EnemyLevels.Boss) {
        if (!Quests.defeatBoss.active) {
            level = EnemyLevels.Legendary;
        }
    }

    const enemyPool = Enemies[level - 1];

    return {
        ...enemyPool[rollDice(enemyPool.length) - 1],
    };
}
