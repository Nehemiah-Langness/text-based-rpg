import { Room } from '../../engine/room';

export function resultRoom(backTo: Room | (() => Room), text: string | string[], continueText = 'Continue'): Room {
    if (typeof text === 'string')
        return new Room(
            null,
            () => text,
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
            }
        );

    if (!text.length) return typeof backTo === 'function' ? backTo() : backTo;

    return text.reduceRight((c, n) => resultRoom(c, n, continueText), backTo) as Room;
}
