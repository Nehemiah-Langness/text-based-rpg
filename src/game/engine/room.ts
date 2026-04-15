import type { InputOption } from '../input-option';
import { Map } from './map';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { isTravelOption, type TravelOption, type TravelOptions } from './travel-options';
import { NpcList } from '../npcs/npc-list';
import { characterMenu } from '../rooms/utility-rooms/character-menu';
import { Names } from '../npcs/npc-names';
import { getPath } from './path-finding/get-path';
import { Compass } from '../compass';
import type { Store } from './store';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { shopInventoryRoom } from '../rooms/utility-rooms/inventory-room';

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

    additionalRoomAccess: (() => {
        room: Room;
        code: (typeof TravelOptions)[number] | `${(typeof TravelOptions)[number]}-custom`;
    } | null)[] = [];

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

    getAdjacentRooms() {
        return (
            this.getTravelOptions(this)
                .filter((x) => x !== null)
                .map(({ code }) =>
                    isTravelOption(code)
                        ? {
                              code,
                              room: this.travel(code),
                          }
                        : null
                )
                .filter((rm) => rm !== null && rm.room !== null) as {
                room: Room;
                code: (typeof TravelOptions)[number] | `${(typeof TravelOptions)[number]}-custom`;
            }[]
        ).concat(this.additionalRoomAccess.map((getRoom) => getRoom()).filter((x) => x !== null));
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
        const parts = typeof text === 'string' ? [text] : text;

        const compass = Compass.getDestination();
        if (this.inventoryAccess && compass) {
            const pathForward = getPath(this, compass);
            const direction = pathForward?.[1]?.direction;
            if (direction) {
                parts.push(`Your compass points ${direction.replace('travel-', '').replace('-custom', '')}`);
            }
        }
        return parts.filter((x) => x).join('\n\n');
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
                .concat(
                    npcsAtLocation
                        .map((npc) => ({
                            npc,
                            store: npc.store?.(this) ?? null,
                        }))
                        .map(({ npc, store }) => {
                            return !store
                                ? null
                                : {
                                      code: `shop-at-${npc.id}`,
                                      text: `${store.openShopText}`,
                                  };
                        })
                        .filter((x) => x !== null)
                )
                .concat(this.getTravelOptions(this).filter((x) => x !== null))
                .concat(
                    this.inventoryAccess
                        ? [
                              {
                                  code: 'character-menu',
                                  text: 'Open character menu',
                              },
                          ]
                        : []
                ),
            select: (code: string) => {
                this.visited = true;

                if (this.inventoryAccess && code === 'character-menu') {
                    return characterMenu(this);
                } else if (code.startsWith('talk-to-')) {
                    const npc = npcsAtLocation.find((n) => code === `talk-to-${n.id}`);
                    if (npc) {
                        return npc.getConversation(this);
                    }
                } else if (code.startsWith('shop-at-')) {
                    const store = npcsAtLocation.find((n) => code === `shop-at-${n.id}`)?.store?.(this);
                    if (store) {
                        return shop(this, this, store);
                    }
                } else if (isTravelOption(code)) {
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

    withRoomAccess(
        ...rooms: (() => { room: Room; code: (typeof TravelOptions)[number] | `${(typeof TravelOptions)[number]}-custom` } | null)[]
    ) {
        rooms.forEach((rm) => this.additionalRoomAccess.push(rm));
        return this;
    }

    static resolve(room: RoomLike): Room {
        if (typeof room === 'function') return Room.resolve(room());
        return room;
    }
}

function shop(root: Room, backTo: RoomLike, store: Store) {
    const shopText = store.shopText(root);
    const buyOptions = store.getItemsToBuy();
    const sellOptions = store.getItemsToSell();

    return choiceRoom(
        (typeof shopText === 'string' ? [shopText] : shopText).filter((x) => x !== null).join('\n\n'),
        [
            buyOptions.length
                ? {
                      code: 'buy',
                      text: 'Buy',
                  }
                : null,
            sellOptions.length
                ? {
                      code: 'sell',
                      text: 'Sell',
                  }
                : null,
            {
                code: 'leave',
                text: store.leaveStoreText,
            },
        ],
        (choice, rm) => {
            if (choice === 'leave') {
                return backTo;
            } else if (choice === 'buy' || choice === 'sell') {
                return shopInventoryRoom(
                    rm,
                    choice === 'buy' ? `The following items are available for purchase.` : `You can sell the following items.`,
                    store,
                    choice
                );
            }

            return rm;
        }
    );
}
