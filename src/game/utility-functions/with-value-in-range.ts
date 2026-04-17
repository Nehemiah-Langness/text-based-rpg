import type { Inventory } from '../inventory';

export function withValueInRange(range: { min: number; max: number; }) {
    return ({ item }: ReturnType<typeof Inventory.getCategory>[number]) => (item.vendor?.value ?? 0) >= range.min && (item.vendor?.value ?? 0) <= range.max;
}
