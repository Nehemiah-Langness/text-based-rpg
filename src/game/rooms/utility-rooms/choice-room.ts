import type { InputOption } from '../../input-option';
import { Room, type RoomLike } from '../../engine/room';

export function choiceRoom(choice: string, options: InputOption[], onChoice: (choice: string, room: Room) => RoomLike) {
    return new Room(
        null,
        () => choice,
        (rm) => {
            return {
                options: options,
                select: (code) => onChoice(code, rm),
            };
        }
    );
}
