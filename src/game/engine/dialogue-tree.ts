import { resultRoom } from '../rooms/utility-rooms/result-room';
import type { Dialogue } from './dialogue';
import { Room, type RoomLike } from './room';

export class DialogueTree {
    private dialogue: (string | ((rm: RoomLike) => RoomLike))[];

    constructor(dialogue: Dialogue) {
        const statements = typeof dialogue === 'string' ? [dialogue] : dialogue;

        this.dialogue = statements.filter((x) => x !== null && typeof x !== 'undefined');
    }

    getRoom(rm: Room) {
        return this.dialogue.reduceRight((c, n) => (typeof n === 'string' ? resultRoom(c, n) : n(c)), rm as RoomLike);
    }
}
