import { Room, type RoomLike } from '../../engine/room';

export function resultRoom(
    backTo: Room,
    text: string | (string | { text: string; color: Required<Room['roomColor']> })[] | { text: string; color: Required<Room['roomColor']> },
    continueText?: string,
    color?: Room['roomColor']
): Room;
export function resultRoom(
    backTo: RoomLike,
    text: string | (string | { text: string; color: Required<Room['roomColor']> })[] | { text: string; color: Required<Room['roomColor']> },
    continueText?: string,
    color?: Room['roomColor']
): RoomLike;
export function resultRoom(
    backTo: RoomLike,
    text: string | (string | { text: string; color: Required<Room['roomColor']> })[] | { text: string; color: Required<Room['roomColor']> },
    continueText = 'Continue',
    color?: Room['roomColor']
): RoomLike {
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
                    select: () => backTo,
                };
            },
            undefined,
            color ?? roomColor
        );
    }

    if (!text.length) return backTo;

    return text.reduceRight((c, n) => resultRoom(c, n, continueText, color), backTo);
}
