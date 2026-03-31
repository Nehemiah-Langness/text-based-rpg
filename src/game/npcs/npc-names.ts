export const NpcNames = {
    'General Store Owner': ['Hartham Miller', 'Old Hartham', 'Hartham'] as const,
    'Inn Keeper': ['Garron Feldon', 'Big Garron', 'Garron'] as const,
    'Inn Keeper Wife': ['Mara Feldon', 'Warm Hearth Mara', 'Mara'] as const,
    'Weapon Store Owner': ['Darik Stonehand', 'Hammerhand', 'Darik'] as const,
    'Armor Store Owner': ['Lysa Fen', 'Little Lysa', 'Lysa'] as const,
    Farmer: ['Colm Braddock', 'Big Colm', 'Colm'] as const,
    'Guild Master': ['Fenric Alder', 'Fen the Fox', 'Fenric'] as const,
    'City Guard': ['Rurik Dain', 'Rurik the Sure', 'Rurik'] as const,
    Hunter: ['Toren Vale', 'Stagshadow', 'Toren'] as const,
    Wizard: ['Eldrin Vael', 'The Clockwork Sage', 'Eldrin'] as const,
};

export const Names = {
    FullName: 0,
    NickName: 1,
    FirstName: 2,
};

export type Name = keyof typeof Names;
