import type { InputOption } from '../input-option';
import { Map } from './map';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { isTravelOption, type TravelOption, type TravelOptions } from './travel-options';
import { NpcList } from '../npcs/npc-list';
import { characterMenu } from '../rooms/utility-rooms/character-menu';
import { Names } from '../npcs/npc-names';

export type RoomLike = Room | (() => RoomLike);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Room<T = any> {
    name: string | undefined;
    inventoryAccess = false;
    coordinates: { y: string; x: number } | undefined;
    map: Map | undefined;
    roomColor:
        | string
        | {
              primary: string;
              secondary: string;
          }
        | undefined;

    investigated = false;
    visited = false;
    state: T;
    fastPrint = false;

    public onEnter?: () => RoomLike = undefined;

    private getTextLogic: (room: Room<T>) => string | (string | null)[];
    private getOptionsLogic: (room: Room<T>) => {
        options: InputOption[];
        select: (code: string) => RoomLike;
    };
    private getTravelOptions: (
        room: Room<T>
    ) => ({ text: string; code: (typeof TravelOptions)[number] | `${(typeof TravelOptions)[number]}-custom` } | null)[];

    constructor(
        state: T,
        getTextLogic?: (room: Room<T>) => string | (string | null)[],
        getOptionsLogic?: (room: Room<T>) => {
            options: InputOption[];
            select: (code: string) => RoomLike;
        },
        getTravelOptions?: (
            room: Room<T>
        ) => ({ text: string; code: (typeof TravelOptions)[number] | `${(typeof TravelOptions)[number]}-custom` } | null)[],
        color?:
            | string
            | {
                  primary: string;
                  secondary: string;
              }
    ) {
        this.state = state;
        this.getTextLogic = getTextLogic ?? (() => []);
        this.getOptionsLogic =
            getOptionsLogic ??
            ((rm) => {
                return {
                    options: [],
                    select: () => {
                        return rm;
                    },
                };
            });
        this.getTravelOptions = getTravelOptions ?? (() => []);

        this.roomColor = color;
    }

    save() {
        return {
            investigated: this.investigated,
            visited: this.visited,
            state: this.state,
        };
    }

    load(data: ReturnType<Room['save']> | null) {
        if (data) {
            this.investigated = data.investigated ?? this.investigated;
            this.visited = data.visited ?? this.visited;
            if (this.state) Object.assign(this.state, data.state);
        }
    }

    getText() {
        const text = this.getTextLogic(this);
        if (typeof text === 'string') return text;
        return text.filter((x) => x).join('\n\n');
    }

    getNpcsInRoom() {
        return this.map && this.coordinates
            ? NpcList.filter(
                  (npc) =>
                      npc.mapId === this.map?.id && npc.coordinates?.x === this.coordinates?.x && npc.coordinates?.y === this.coordinates?.y
              )
            : [];
    }

    getOptions() {
        const roomOptions = this.getOptionsLogic(this);

        const npcsAtLocation = this.getNpcsInRoom();

        return {
            options: roomOptions.options
                .concat(
                    npcsAtLocation.map((npc) => {
                        return {
                            code: `talk-to-${npc.id}`,
                            text: `Talk to ${npc.getName(this)[Names.FullName]}${npc.hasSpecialRemark(this) ? ' (!)' : ''}`,
                        };
                    })
                )
                .concat(this.getTravelOptions(this).filter((x) => x !== null))
                .concat(
                    this.inventoryAccess
                        ? [
                              {
                                  code: 'character-menu',
                                  text: 'Open Character Menu',
                              },
                          ]
                        : []
                ),
            select: (code: string) => {
                this.visited = true;

                if (this.inventoryAccess && code === 'character-menu') {
                    return characterMenu(this);
                }

                if (code.startsWith('talk-to-')) {
                    const npc = npcsAtLocation.find((n) => code === `talk-to-${n.id}`);
                    if (npc) {
                        return npc.getConversation(this);
                    }
                }

                if (isTravelOption(code)) {
                    const traveled = this.travel(code);
                    if (traveled) return traveled;
                }

                return roomOptions.select(code);
            },
        };
    }

    withInventoryAccess() {
        this.inventoryAccess = true;
        return this;
    }

    atLocation(map: Map, y: string, x: number) {
        this.coordinates = { y: y, x: x };
        this.map = map;
        map.setRoom(y, x, this);
        return this;
    }

    withName(name: string) {
        this.name = name;
        return this;
    }

    withFastPrint() {
        this.fastPrint = true;
        return this;
    }

    investigate(text: string) {
        this.investigated = true;
        return resultRoom(this, text);
    }

    travel(choice: TravelOption) {
        if (this.map) {
            switch (choice) {
                case 'travel-north':
                    return this.map.north(this);
                case 'travel-east':
                    return this.map.east(this);
                case 'travel-south':
                    return this.map.south(this);
                case 'travel-west':
                    return this.map.west(this);
            }
        }

        return null;
    }

    withColor(color: Room['roomColor']) {
        this.roomColor = color;
        return this;
    }

    withOnEnter(onEnter: (rm: Room) => RoomLike) {
        this.onEnter = () => onEnter(this);
        return this;
    }

    static resolve(room: RoomLike): Room {
        if (typeof room === 'function') return Room.resolve(room());
        return room;
    }
}
