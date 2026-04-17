import { saveGame } from './game';
import { Room } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Player } from './player';
import { Mood } from './rooms/moods/mood';
import { oxfordComma } from './utility-functions/oxford-comma';

export function fullRest(room: Room) {
    const healed = Player.heal(Player.health.max);
    const energized = Player.energize(Player.stamina.max);

    const updates = oxfordComma(
        healed ? `${healed} health point${healed === 1 ? '' : 's'}` : '',
        energized ? `${energized} stamina point${energized === 1 ? '' : 's'}` : ''
    );

    const savedRoom = () => {
        saveGame(room);
        return resultRoom(room, 'Your progress has been saved.', undefined, Mood.peaceful);
    };

    return resultRoom(
        savedRoom,
        [updates ? `You regain ${updates}.` : null].filter((x) => x !== null),
        undefined,
        Mood.peaceful
    );
}
