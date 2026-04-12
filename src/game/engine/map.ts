import { MapList } from '../rooms/map-list';
import { Room } from './room';

export class Map {
    id: string;
    cells: Record<string, (Room | null)[]> = {};
    size: { x: number; y: string };
    entrance: Room | undefined;

    constructor(id: string, x: number, y: string) {
        this.size = { x, y };
        this.id = id;

        this.traverseMap((cells, y, x) => {
            cells[y][x] = null;
        });

        MapList.push(this);
    }

    private traverseMap(callback: (cells: Record<string, (Room | null)[]>, y: string, x: number) => void) {
        for (let x = 'A'.charCodeAt(0); x <= this.size.y.charCodeAt(0); x++) {
            const letter = String.fromCharCode(x);
            if (!this.cells[letter]) {
                this.cells[letter] = [];
            }
            for (let x = 1; x <= this.size.x; x++) {
                callback(this.cells, letter, x);
            }
        }
    }

    saveMap() {
        const saveData: Record<string, (ReturnType<Room['save']> | null)[]> = {};

        this.traverseMap((cells, y, x) => {
            if (!saveData[y]) {
                saveData[y] = [];
            }

            const room = cells[y][x];
            saveData[y][x] = room?.save() ?? null;
        });

        return {
            id: this.id,
            data: saveData,
        };
    }

    loadMap(saveData: Record<string, (ReturnType<Room['save']> | null)[]>) {
        this.traverseMap((cells, y, x) => {
            const room = cells[y][x];
            if (room) {
                room.load(saveData[y]?.[x]);
            }
        });
    }

    setRoom(y: string, x: number, room: Room) {
        let resize = false;
        if (y > this.size.y) {
            this.size.y = y;
            resize = true;
        }
        if (x > this.size.x) {
            this.size.x = x;
            resize = true;
        }
        if (resize) {
            this.traverseMap((cells, y, x) => {
                if (typeof cells[y][x] === 'undefined') {
                    cells[y][x] = null;
                }
            });
        }

        this.cells[y][x] = room;
    }

    north(room: Room) {
        if (!room.coordinates) {
            return room;
        }

        return this.cells[String.fromCharCode(room.coordinates.y.charCodeAt(0) - 1)][room.coordinates.x] ?? room;
    }

    south(room: Room) {
        if (!room.coordinates) {
            return room;
        }

        return this.cells[String.fromCharCode(room.coordinates.y.charCodeAt(0) + 1)][room.coordinates.x] ?? room;
    }

    east(room: Room) {
        if (!room.coordinates) {
            return room;
        }

        return this.cells[room.coordinates.y][room.coordinates.x + 1] ?? room;
    }
    west(room: Room) {
        if (!room.coordinates) {
            return room;
        }

        return this.cells[room.coordinates.y][room.coordinates.x - 1] ?? room;
    }

    find(id: string) {
        return Object.values(this.cells)
            .map((row) => row.find((rm) => rm?.name === id))
            .filter((x) => x)[0];
    }
}
