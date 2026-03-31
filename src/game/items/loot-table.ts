import { rollDice } from '../dice';
import { EnemyLevels } from '../enemies/enemy-level';
import { Categories } from '../inventory/lists/categories';

export function lootTable(enemyLevel: number) {
    const giveBonusLoot = enemyLevel >= EnemyLevels.Legendary;
    const legendaryLootRoll = rollDice(100);
    const giveLegendaryLoot = enemyLevel >= EnemyLevels.Dangerous ? legendaryLootRoll <= 7 + (enemyLevel - EnemyLevels.Dangerous) * 8 : false;

    const tierOneLoot = enemyLevel === EnemyLevels.Weak || giveBonusLoot ? rollDice(giveBonusLoot ? 20 : 4) - 1 : 0;
    const tierTwoLoot = enemyLevel === EnemyLevels.Strong || giveBonusLoot ? rollDice(giveBonusLoot ? 10 : 4) - 1 : 0;
    const tierThreeLoot = enemyLevel === EnemyLevels.Dangerous || giveBonusLoot ? rollDice(giveBonusLoot ? 5 : 4) - 1 : 0;

    return [
        {
            loot: 'Loot (4-7g)' as const,
            count: tierOneLoot,
        },
        {
            loot: 'Loot (21-43g)' as const,
            count: tierTwoLoot,
        },
        {
            loot: 'Loot (201-404g)' as const,
            count: tierThreeLoot,
        },
        {
            loot:
                enemyLevel <= EnemyLevels.Weak
                    ? ('Proof of Enemy Kill (Weak)' as const)
                    : enemyLevel === EnemyLevels.Strong
                      ? ('Proof of Enemy Kill (Strong)' as const)
                      : enemyLevel === EnemyLevels.Dangerous
                        ? ('Proof of Enemy Kill (Dangerous)' as const)
                        : ('Proof of Enemy Kill (Legendary)' as const),
            count: 1,
        },
        {
            loot: Categories.legendaryDrops[rollDice(Categories.legendaryDrops.length) - 1],
            count: giveLegendaryLoot ? 1 : 0,
        },
    ].filter((x) => x.count > 0);
}
