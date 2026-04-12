import type { Room } from '../room';

type RoomPath = { room: Room; direction: string }[];

export function continuePath(
    to: Room,
    current: RoomPath[],
    allViewed: { room: Room; bestPath: number }[],
    depth: number
): RoomPath[] | null {
    if (depth === 100) return null;

    const successfulPaths = current.filter((path) => path[path.length - 1].room === to);
    const bestPathLength = successfulPaths.reduce((c, n) => (c === null ? n.length : Math.min(n.length, c)), null as number | null);

    if (current.every((path) => path[path.length - 1].room === to)) {
        console.log('Tries:', depth);
        return current;
    }

    const toAdd: RoomPath[] = [];
    const toRemove: RoomPath[] = [];

    current.forEach((path) => {
        const betterPathViewed = path.filter((current, steps) =>
            allViewed.find(({ bestPath, room }) => bestPath < steps && room === current.room)
        );

        if (betterPathViewed.length) {
            toRemove.push(path);
            return;
        }

        const from = path[path.length - 1].room;
        if (from === to) {
            if (bestPathLength !== null && path.length > bestPathLength) {
                toRemove.push(path);
            }
            return;
        }
        const currentSteps = path.length;

        const adjacentRooms = from
            .getAdjacentRooms()
            .filter(({ room: current }) => !allViewed.find(({ bestPath, room }) => bestPath <= currentSteps && room === current));

        adjacentRooms
            .map(({ room }) => allViewed.find((viewed) => viewed.room === room))
            .forEach((room) => {
                if (room) {
                    room.bestPath = currentSteps;
                }
            });

        adjacentRooms
            .filter(({ room }) => !allViewed.find((viewed) => viewed.room === room))
            .forEach((room) => {
                allViewed.push({
                    bestPath: currentSteps,
                    room: room.room,
                });
            });

        toAdd.push(
            ...adjacentRooms.map(({ code, room }) =>
                path.concat([
                    {
                        room: room,
                        direction: code,
                    },
                ])
            )
        );
        toRemove.push(path);
    });

    return continuePath(to, current.filter((x) => !toRemove.includes(x)).concat(toAdd), allViewed, depth + 1);
}
