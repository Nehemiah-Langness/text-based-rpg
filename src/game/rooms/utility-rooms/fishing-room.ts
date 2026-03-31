import { staminaToDescription } from '../../descriptions';
import { rollDice } from '../../dice';
import { Inventory } from '../../inventory/inventory';
import { Player } from '../../player';
import { progressQuest } from '../../quests';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { resultRoom } from './result-room';

export function fishingRoom<T extends { timesFished: number }>(backTo: Room<T>) {
    if (backTo.state.timesFished >= 3) {
        return resultRoom(backTo, `The fish aren't biting right now.`);
    }
    if (Player.stamina <= 3) {
        return resultRoom(backTo, 'You are too exhausted to fish right now.');
    }
    Player.stamina -= 3;
    Stats.staminaLost = (Stats.staminaLost ?? 0) + 3;

    backTo.state.timesFished += 1;

    const caughtFish = rollDice(3) === 2;
    if (caughtFish || Inventory['Fishing Tackle'].count > 0) {
        if (!caughtFish) {
            Inventory['Fishing Tackle'].count -= 1;
        }
        const progress = progressQuest('fish', 3, 0, true);
        Inventory['Raw Fish'].count += 1;
        Stats.fishCaught = (Stats.fishCaught ?? 0) + 1;

        return resultRoom(
            backTo,
            [
                caughtFish ? `You have caught a fish.` : 'You have used your Fishing Tackle and caught a fish.',
                `You are ${staminaToDescription(Player.stamina / Player.maxHealth)}`,
                progress,
            ].filter((x) => x !== null && typeof x !== 'undefined')
        );
    }

    return resultRoom(backTo, [
        'A fish tugged on your line, but it got away before you could reel it in.',
        `You are ${staminaToDescription(Player.stamina / Player.maxHealth)}`,
    ]);
}
