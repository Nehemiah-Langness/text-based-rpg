import type { SkillModifier } from '../../knowledge';

export type InventoryItem<TCategory> = {
    count: number;
    equipped: boolean;
} & InventoryItemMeta<TCategory>;

export interface InventoryItemMeta<TCategory> {
    name: string;
    category: TCategory;
    vendor?: {
        wontBuy?: boolean;
        wontSell?: boolean;
        value: number;
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
}
