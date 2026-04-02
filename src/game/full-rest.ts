import { saveGame } from './game';
import { Player } from './player';
import { Room } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Stats } from './stats';

export function fullRest(room: Room) {
    if (Player.stamina === Player.maxStamina) {
        Player.criticalChance += 3;
    }
    Stats.nightsSlept = (Stats.nightsSlept ?? 0) + 1;
    saveGame(room);
    return resultRoom(
        room,
        [
            Player.stamina === Player.maxStamina ? 'You have received a well-rested bonus (+3 luck points).' : null,
            'Your progress has been saved.',
        ].filter((x) => x !== null && typeof x !== 'undefined')
    );
}
