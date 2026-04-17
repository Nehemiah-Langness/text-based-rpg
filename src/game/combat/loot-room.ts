import type { RoomLike } from '../engine/room';
import { type InventoryKey, Inventory } from '../inventory';
import { resultRoom } from '../rooms/utility-rooms/result-room';

export function lootRoom(backTo: RoomLike, text: string, loot: { item: InventoryKey; count: number; }[]) {
    loot.forEach(({ count, item }) => {
        Inventory.add(item, count);
    });
    return resultRoom(backTo, `${text}\n\n${loot.map(({ item, count }) => `${Inventory.get(item).name} (x${count})`).join('\n')}`);
}
