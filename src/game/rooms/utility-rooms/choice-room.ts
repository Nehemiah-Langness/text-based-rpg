import type { InputOption } from '../../input-option';
import { Room } from '../../engine/room';

export function choiceRoom(choice: string, options: InputOption[], onChoice: (choice: string, room: Room) => Room) {
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
