import type { Room } from '../../engine/room';
import { FastTravel } from '../../fast-travel';
import { choiceRoom } from './choice-room';

export function fastTravelRoom(backTo: Room) {
    return choiceRoom(
        `You reach out and touch the statue.  You can feel yourself being pulled away by what feels like a strong ocean current.`,
        FastTravel.getUnlockedLocations()
            .filter((x) => x.room !== backTo)
            .map((option) => ({
                code: option.room.name ?? option.option,
                text: option.option,
            }))
            .concat({
                code: 'back',
                text: 'Fight the current',
            }),
        (choice, fastTravelRoom) => {
            if (choice === 'back') {
                return backTo;
            }

            const chosen = FastTravel.getUnlockedLocations().find((option) => (option.room.name ?? option.option) === choice);
            if (chosen) {
                return chosen.room;
            }

            return fastTravelRoom;
        }
    );
}
