import { Room } from './room';

export const Map: Record<string, (Room | null)[]> = {};
const mapSize = {
    y: 'F',
    x: 6,
};

for (let x = 'A'.charCodeAt(0); x <= mapSize.y.charCodeAt(0); x++) {
    const letter = String.fromCharCode(x);
    Map[letter] = [];
    for (let x = 1; x <= mapSize.x; x++) {
        Map[letter][x] = null;
    }
}

export function saveMap() {
    const saveData: Record<string, ({ investigated: boolean; visited: boolean; state: unknown } | null)[]> = {};

    for (let y = 'A'.charCodeAt(0); y <= mapSize.y.charCodeAt(0); y++) {
        const letter = String.fromCharCode(y);
        saveData[letter] = [];
        for (let x = 1; x <= mapSize.x; x++) {
            const map = Map[letter][x];

            saveData[letter][x] = map
                ? {
                      state: map.state,
                      investigated: map.investigated,
                      visited: map.visited,
                  }
                : null;
        }
    }

    return saveData;
}

export function loadMap(saveData: Record<string, ({ investigated: boolean; visited: boolean; state: unknown } | null)[]>) {
    for (let y = 'A'.charCodeAt(0); y <= mapSize.y.charCodeAt(0); y++) {
        const letter = String.fromCharCode(y);
        for (let x = 1; x <= mapSize.x; x++) {
            const map = Map[letter][x];
            const data = saveData[letter][x];
            if (map && data) {
                map.investigated = data.investigated ?? map.investigated;
                map.visited = data.visited ?? map.visited;
                if (map.state && data.state) Object.assign(map.state, data.state);
            }
        }
    }
}

export function north(room: Room) {
    if (!room.coordinates) {
        return room;
    }

    return Map[String.fromCharCode(room.coordinates.y.charCodeAt(0) - 1)][room.coordinates.x] ?? room;
}

export function south(room: Room) {
    if (!room.coordinates) {
        return room;
    }

    return Map[String.fromCharCode(room.coordinates.y.charCodeAt(0) + 1)][room.coordinates.x] ?? room;
}

export function east(room: Room) {
    if (!room.coordinates) {
        return room;
    }

    return Map[room.coordinates.y][room.coordinates.x + 1] ?? room;
}

export function west(room: Room) {
    if (!room.coordinates) {
        return room;
    }

    return Map[room.coordinates.y][room.coordinates.x - 1] ?? room;
}
