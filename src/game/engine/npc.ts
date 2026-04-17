import { Room } from './room';
import { NpcList } from '../npcs/npc-list';
import { DialogueTree } from './dialogue-tree';
import type { Dialogue } from './dialogue';
import type { Store } from './store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericNpc = Npc<any, any>;
export class Npc<TStore = Store | null, TSpecialRemark extends string = string> {
    

    coordinates: { y: string; x: number } | undefined;
    mapId: string | undefined;
    met = false;
    protected currentRemark = 0;

    save() {
        return {
            id: this.id,
            met: this.met,
            currentRemark: this.currentRemark,
            coordinates: this.coordinates,
            mapId: this.mapId,
        };
    }

    load(data: Partial<ReturnType<typeof this.save>>) {
        if (data.id === this.id) {
            this.met = data.met ?? false;
            this.currentRemark = data.currentRemark ?? 0;
            this.coordinates = data.coordinates ?? this.coordinates;
            this.mapId = data.mapId ?? this.mapId;
        }
    }

    id: string;
    name: readonly [string, string, string] | ((npc: Npc<TStore>, room?: Room) => readonly [string, string, string]);
    store?: (room: Room) => TStore;
    inStore = false;
    protected remarks: (string | ((npc: Npc<TStore, TSpecialRemark>, room: Room) => string | false | (string | null)[]))[] | null;
    protected specialRemark: ((npc: Npc<TStore, TSpecialRemark>, room: Room, key?: TSpecialRemark) => (() => Dialogue) | null) | null;

    constructor(
        id: string,
        name: readonly [string, string, string] | ((npc: Npc<TStore>, room?: Room) => readonly [string, string, string]),
        remarks?: (string | ((npc: Npc<TStore, TSpecialRemark>, room: Room) => string | false | (string | null)[]))[],
        specialRemark?: (npc: Npc<TStore, TSpecialRemark>, room: Room, key?: TSpecialRemark) => (() => Dialogue) | null
    ) {
        this.id = id;
        this.name = name;
        this.remarks = remarks ?? null;
        this.specialRemark = specialRemark ?? null;
        NpcList.push(this);
    }

    hasSpecialRemark(room: Room) {
        const remark = this.specialRemark?.(this, room) ?? null;
        return remark !== null;
    }

    getName(room?: Room) {
        return typeof this.name === 'function' ? this.name(this, room) : this.name;
    }

    canConverse() {
        return this.remarks !== null;
    }

    getConversation(room: Room, requestedConversation?: TSpecialRemark) {
        const specialRemark = this.specialRemark?.(this, room, requestedConversation) ?? null;
        if (specialRemark !== null) {
            return this.toRoom(specialRemark(), room);
        }

        if (this.remarks === null) return this.toRoom(false, room);

        const startingRemark = this.currentRemark;
        let attempt = this.nextConversation(room);

        while (attempt === false && this.currentRemark !== startingRemark) {
            attempt = this.nextConversation(room);
        }

        return this.toRoom(attempt, room);
    }

    private nextConversation(room: Room) {
        if (this.remarks === null) return false;
        this.currentRemark = (this.currentRemark + 1) % this.remarks.length;
        return this.resolveConversation(this.remarks[this.currentRemark], room);
    }

    private toRoom(remarks: Dialogue | false, room: Room) {
        const statements =
            remarks === false ? [`${this.getName(room)[0]} nothing to say right now.`] : typeof remarks === 'string' ? [remarks] : remarks;

        return new DialogueTree(statements).getRoom(room);
    }

    private resolveConversation<TReturn>(conversation: string | ((npc: Npc, room: Room) => TReturn), room: Room) {
        return typeof conversation === 'function' ? conversation(this, room) : conversation;
    }

    move(room: Room) {
        if (room.coordinates && room.map) {
            this.coordinates = { ...room.coordinates };
            this.mapId = room.map.id;
        }
        return this;
    }

    meet() {
        this.met = true;
        return this;
    }

    hasStore<T>(store: (room: Room) => T, inStore = false) {
        this.store = (rm) => store(rm) as unknown as TStore;
        this.inStore = inStore;
        return this as unknown as Npc<T, TSpecialRemark>;
    }
}
