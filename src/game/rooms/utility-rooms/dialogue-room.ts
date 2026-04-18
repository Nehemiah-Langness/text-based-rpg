import type { RoomLike } from '../../engine/room';
import { choiceRoom } from './choice-room';
import { resultRoom } from './result-room';

export function dialogueRoom(backTo: RoomLike, text: string | (string | null)[], responses: Record<string, (backTo: RoomLike) => RoomLike>) {
    const options = Object.keys(responses).map((r) => ({
        code: r,
        text: r,
    }));

    const dialogue = (message: string) => choiceRoom(message, options, (code, rm) => {
        const choice = Object.entries(responses).find(([key]) => key === code);
        if (choice) return choice[1](backTo);
        return rm;
    });

    if (typeof text === 'string') return dialogue(text);

    const pieces = text.filter((x) => x !== null).filter((x) => x);
    if (pieces.length === 0) {
        return dialogue('');
    }
    return resultRoom(() => dialogue(pieces[pieces.length - 1]), pieces.slice(0, -1));
}
