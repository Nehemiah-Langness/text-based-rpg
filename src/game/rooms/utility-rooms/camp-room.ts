import { fullRest } from '../../full-rest';
import { Inventory } from '../../inventory/inventory';
import { energize, heal, Player } from '../../player';
import { Room } from '../../engine/room';
import { resultRoom } from './result-room';

export function campRoom(rm: Room, healthBoost: number, energyBoost: number, ...description: (string | null)[]) {
    Player.criticalChance = 0;

    return resultRoom(
        heal(
            energize(() => fullRest(rm), energyBoost + (Inventory['Bedroll'].count > 0 ? 25 : 0), Inventory['Bedroll'].count > 0 ? 2 : 0),
            healthBoost
        ),
        [
            ...description,
            Inventory['Bedroll'].count > 0 ? `You received an additional rest bonus by using your bedroll.` : null,
        ].filter((x) => x !== null && typeof x !== 'undefined')
    );
}
