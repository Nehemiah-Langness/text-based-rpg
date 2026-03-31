import { Room } from './room';
import { resultRoom } from '../rooms/utility-rooms/result-room';

export class Npc<TSpecialRemarks extends string = string> {
    protected currentRemark = 0;
    public met = false;

    save() {
        return {
            id: this.id,
            met: this.met,
            currentRemark: this.currentRemark,
        };
    }

    load(data: Partial<ReturnType<typeof this.save>>) {
        this.met = data.met ?? false;
        this.currentRemark = data.currentRemark ?? 0;
    }

    id: string;
    name: readonly [string, string, string] | ((npc: Npc<TSpecialRemarks>, room: Room) => readonly [string, string, string]);
    protected remarks: (string | ((npc: Npc<TSpecialRemarks>, room: Room) => string | false | (string | null)[]))[];
    protected specialRemarks: Record<TSpecialRemarks, string | ((npc: Npc<TSpecialRemarks>, room: Room) => string | (string | null)[])>;
    protected needsSpecialRemark: (npc: Npc<TSpecialRemarks>, room: Room) => TSpecialRemarks | null;

    constructor(
        id: string,
        name: readonly [string, string, string] | ((npc: Npc<TSpecialRemarks>, room: Room) => readonly [string, string, string]),
        remarks: (string | ((npc: Npc<TSpecialRemarks>, room: Room) => string | false | (string | null)[]))[],
        specialRemarks: Record<TSpecialRemarks, string | ((npc: Npc<TSpecialRemarks>, room: Room) => string | (string | null)[])>,
        needsSpecialRemark: (npc: Npc<TSpecialRemarks>, room: Room) => TSpecialRemarks | null
    ) {
        this.id = id;
        this.name = name;
        this.remarks = remarks;
        this.specialRemarks = specialRemarks;
        this.needsSpecialRemark = needsSpecialRemark;
    }

    getName(room: Room) {
        return typeof this.name === 'function' ? this.name(this, room) : this.name;
    }

    getConversation(room: Room, specialRemark?: TSpecialRemarks) {
        const specialRemarkNeeded = specialRemark ?? this.needsSpecialRemark(this, room);
        if (specialRemarkNeeded !== null) {
            return this.toRoom(this.getSpecialRemark(specialRemarkNeeded, room), room);
        }

        const currentRemark = this.currentRemark;

        let remarkIndex = currentRemark;
        this.currentRemark = (this.currentRemark + 1) % this.remarks.length;
        let attempt = this.resolveConversation(this.remarks[remarkIndex], room);

        while (attempt === false && this.currentRemark !== currentRemark) {
            remarkIndex = this.currentRemark;
            this.currentRemark = (this.currentRemark + 1) % this.remarks.length;
            attempt = this.resolveConversation(this.remarks[remarkIndex], room);
        }

        return this.toRoom(attempt, room);
    }

    private toRoom(remarks: false | string | (string | null)[], room: Room) {
        const statements =
            remarks === false ? [`${this.getName(room)[0]} nothing to say right now.`] : typeof remarks === 'string' ? [remarks] : remarks;

        return statements.filter((x) => x !== null && typeof x !== 'undefined').reduceRight((c, n) => resultRoom(c, n), room);
    }

    private resolveConversation<TReturn>(conversation: string | ((npc: Npc<TSpecialRemarks>, room: Room) => TReturn), room: Room) {
        return typeof conversation === 'function' ? conversation(this, room) : conversation;
    }

    getSpecialRemark(remark: TSpecialRemarks, room: Room) {
        const remarks = this.resolveConversation(this.specialRemarks[remark], room);
        return typeof remarks === 'string' ? [remarks] : remarks;
    }
}
