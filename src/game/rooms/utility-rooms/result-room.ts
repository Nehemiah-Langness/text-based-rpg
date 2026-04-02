import { Room } from '../../engine/room';

export function resultRoom(
    backTo: Room | (() => Room),
    text: string | (string | { text: string; color: Required<Room['roomColor']> })[] | { text: string; color: Required<Room['roomColor']> },
    continueText = 'Continue',
    color?: Room['roomColor']
): Room {
    if (!Array.isArray(text)) {
        const roomText = typeof text === 'string' ? text : text.text;
        const roomColor = typeof text === 'string' ? undefined : text.color;
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
                    select: () => Room.resolve(backTo),
                };
            },
            undefined,
            color ?? roomColor
        );
    }

    if (!text.length) return Room.resolve(backTo);

    return text.reduceRight((c, n) => resultRoom(c, n, continueText, color), backTo) as Room;
}
