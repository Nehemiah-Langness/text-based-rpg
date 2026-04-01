import { Room } from '../../engine/room';

export function resultRoom(
    backTo: Room | (() => Room),
    text: string | (string | { text: string; color: Required<Room['roomColor']> })[] | { text: string; color: Required<Room['roomColor']> },
    continueText = 'Continue'
): Room {
    if (!Array.isArray(text)) {
        const roomText = typeof text === 'string' ? text : text.text;
        const roomColor = typeof text === 'string' ? undefined : text.color;
        console.log({
            text,
            roomText,
            roomColor,
        });
        return new Room(
            null,
            () => roomText,
            () => {
                return {
                    options: [
                        {
                            code: 'cont',
                            text: continueText,
                        },
                    ],
                    select: () => (typeof backTo === 'function' ? backTo() : backTo),
                };
            },
            undefined,
            roomColor
        );
    }

    if (!text.length) return typeof backTo === 'function' ? backTo() : backTo;

    return text.reduceRight((c, n) => resultRoom(c, n, continueText), backTo) as Room;
}
