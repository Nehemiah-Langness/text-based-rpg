import { saveGame } from './game';
import { Player } from './player';
import { Room } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Stats } from './stats';

export function fullRest(room: Room) {
    if (Player.stamina.current === Player.stamina.max) {
        Player.criticalChance += 3;
    }
    Stats.nightsSlept = (Stats.nightsSlept ?? 0) + 1;
    saveGame(room);
    return resultRoom(
        room,
        [
            Player.stamina.current === Player.stamina.max ? 'You have received a well-rested bonus (+3 luck points).' : null,
            'Your progress has been saved.',
        ].filter((x) => x !== null && typeof x !== 'undefined')
    );
}
