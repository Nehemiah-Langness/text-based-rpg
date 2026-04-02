import { rollDice } from '../dice';
import { Enemies } from './enemies';

export function getEnemy(level: number) {

    const enemyPool = Enemies[level - 1];

    return {
        ...enemyPool[rollDice(enemyPool.length) - 1],
    };
}
