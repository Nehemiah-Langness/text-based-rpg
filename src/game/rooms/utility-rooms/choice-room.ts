import type { InputOption } from '../../input-option';
import { Room, type RoomLike } from '../../engine/room';

export function choiceRoom(
    choice: string | (() => string),
    options: (InputOption | null)[] | (() => (InputOption | null)[]),
    onChoice: (choice: string, room: Room) => RoomLike
) {
    return new Room(
        null,
        () => (typeof choice === 'string' ? choice : choice()),
        (rm) => {
            return {
                options: (typeof options === 'function' ? options() : options).filter((x) => x !== null),
                select: (code) => onChoice(code, rm),
            };
        }
    );
}
