import type { SkillModifier } from '../../engine/skill-set';

export type InventoryItem<TCategory> = {
    count: number;
    equipped: boolean;
} & InventoryItemMeta<TCategory>;

export interface InventoryItemMeta<TCategory = string> {
    name: string;
    category: TCategory;
    vendor?: {
        wontBuy?: boolean;
        wontSell?: boolean;
        value: number;
        max?: number;
    };
    description?: string;
    pluralSuffix?: string;
    consumable?: {
        health?: number;
        stamina?: number;
        effects?: {
            effect: SkillModifier;
            duration: number;
        }[];
        text?: string;
    };
    equippable?: {
        subCategory?: string;
        requirement?: {
            category: string;
            subCategory?: string;
            type: 'has' | 'equipped';
        };
        defense?: number;
        health?: number;
        stamina?: number;
        strength?: number;
        speed?: number;
    };
    onAdd?: () => string | string[] | null;
    onRemove?: () => string | string[] | null;
}
