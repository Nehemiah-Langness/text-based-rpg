export const EnemyLevels = {
    Weak: 1,
    Strong: 2,
    Dangerous: 3,
    Legendary: 4,
    Boss: 5,
}

export type EnemyLevel = keyof typeof EnemyLevels
