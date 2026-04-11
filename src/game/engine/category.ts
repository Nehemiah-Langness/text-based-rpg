import type { InventoryItem } from '../inventory/types/inventory-item';
import type { InventorySystem } from './inventory-system';


export type Category<T> = T extends Record<string, InventoryItem<infer U>> ? U : never;

export type InventoryKey<T> = keyof (T extends InventorySystem<infer U> ? U : never);
