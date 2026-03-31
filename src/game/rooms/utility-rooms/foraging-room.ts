import { staminaToDescription } from '../../descriptions';
import { rollDice } from '../../dice';
import { Inventory } from '../../inventory/inventory';
import { Player } from '../../player';
import { progressQuest } from '../../quests';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { resultRoom } from './result-room';

export function foragingRoom<T extends { timesForaged: number }>(backTo: Room<T>) {
    if (backTo.state.timesForaged >= 3) {
        return resultRoom(backTo, `The area seems to be pretty picked-clean.`);
    }
    if (Player.stamina <= 4) {
        return resultRoom(backTo, 'You are too exhausted to forage right now.');
    }
    Player.stamina -= 4;
    Stats.staminaLost = (Stats.staminaLost ?? 0) + 4;

    backTo.state.timesForaged += 1;

    const foraged = rollDice(6) <= 3;
    if (foraged) {
        Inventory['Medicinal Herbs'].count += 1;
        Stats.herbsForaged = (Stats.herbsForaged ?? 0) + 1;
        return resultRoom(
            backTo,
            [
                `You have foraged some medicinal herbs.`,
                `You are ${staminaToDescription(Player.stamina / Player.maxHealth)}`,
                progressQuest('forage', 2, undefined, true),
            ].filter((x) => x !== null && typeof x !== 'undefined')
        );
    }

    return resultRoom(backTo, [
        'You looked around but did not find anything useful.',
        `You are ${staminaToDescription(Player.stamina / Player.maxHealth)}`,
    ]);
}
