import type { RoomLike } from '../engine/room';
import { Mood } from '../rooms/moods/mood';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';

export function searchRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        maxAttempts: number | null;
        tries: { x: number; y: number }[];
        hints: { x: number; y: number }[];
        player: { x: number; y: number };
        target: { x: number; y: number };
        onComplete?: (rm: RoomLike) => RoomLike;
        onFailure?: (rm: RoomLike) => RoomLike;
    }
) {
    const entities: { coordinates: { x: number; y: number }; icon: string }[] = [
        {
            coordinates: settings.player,
            icon: '*',
        },
        import.meta.env.DEV
            ? {
                  coordinates: settings.target,
                  icon: '.',
              }
            : null,
    ]
        .filter((x) => x !== null)
        .concat(
            settings.tries.map((x) => ({
                coordinates: x,
                icon: 'x',
            }))
        )
        .concat(
            settings.hints.map((x) => ({
                coordinates: x,
                icon: '?',
            }))
        );

    const drawGrid = () => {
        const lines: string[] = [];
        for (let y = 0; y < settings.gridSize; y++) {
            for (let row = 0; row < 3; row++) {
                let currentLine = '';
                for (let x = 0; x < settings.gridSize; x++) {
                    if (row === 0 || (row === 2 && y === settings.gridSize - 1)) {
                        currentLine += `----${x === settings.gridSize - 1 ? '-' : ''}`;
                    } else if (row === 1) {
                        currentLine += `|${entities
                            .filter(({ coordinates }) => coordinates.x === x && coordinates.y === y)
                            .map((x) => x.icon)
                            .join('')
                            .substring(0, 3)
                            .padEnd(2, ' ')
                            .padStart(3, ' ')}${x === settings.gridSize - 1 ? '|' : ''}`;
                    }
                }
                if (currentLine) {
                    lines.push(currentLine);
                }
            }
        }
        return lines.join('\n');
    };

    return choiceRoom(
        drawGrid() +
            `\n\nx = Searched\n* = You${settings.maxAttempts !== null ? `\nAttempts Left: ${settings.maxAttempts - settings.tries.length}` : ''}`,
        [
            settings.player.y > 0
                ? {
                      code: 'north',
                      text: 'Move north',
                  }
                : null,
            settings.player.x < settings.gridSize - 1
                ? {
                      code: 'east',
                      text: 'Move east',
                  }
                : null,
            settings.player.y < settings.gridSize - 1
                ? {
                      code: 'south',
                      text: 'Move south',
                  }
                : null,
            settings.player.x > 0
                ? {
                      code: 'west',
                      text: 'Move west',
                  }
                : null,
            !settings.tries.find(({ x, y }) => x === settings.player.x && y === settings.player.y)
                ? {
                      code: 'search',
                      text: 'Search area',
                  }
                : null,
            {
                code: 'leave',
                text: 'Abandon',
            },
        ].filter((x) => x !== null),
        (code, rm) => {
            const nextRoom = () => {
                return searchRoom(backTo, settings);
            };

            if (code === 'leave') {
                return backTo;
            } else if (code === 'north') {
                settings.player.y = Math.max(0, settings.player.y - 1);
                return nextRoom;
            } else if (code === 'east') {
                settings.player.x = Math.min(settings.gridSize - 1, settings.player.x + 1);
                return nextRoom;
            } else if (code === 'south') {
                settings.player.y = Math.min(settings.gridSize - 1, settings.player.y + 1);
                return nextRoom;
            } else if (code === 'west') {
                settings.player.x = Math.max(0, settings.player.x - 1);
                return nextRoom;
            } else if (code === 'search') {
                if (settings.player.x === settings.target.x && settings.player.y === settings.target.y) {
                    return settings.onComplete?.(backTo) ?? backTo;
                }

                if (Math.abs(settings.target.x - settings.player.x) < 2 && Math.abs(settings.target.y - settings.player.y) < 2) {
                    const adjacentSquares = [
                        { x: settings.player.x - 1, y: settings.player.y - 1 },
                        { x: settings.player.x + 1, y: settings.player.y - 1 },
                        { x: settings.player.x - 1, y: settings.player.y + 1 },
                        { x: settings.player.x + 1, y: settings.player.y + 1 },
                        { x: settings.player.x + 1, y: settings.player.y },
                        { x: settings.player.x - 1, y: settings.player.y },
                        { x: settings.player.x, y: settings.player.y - 1 },
                        { x: settings.player.x, y: settings.player.y + 1 },
                    ]
                        .filter(({ x, y }) => x >= 0 && y >= 0 && x < settings.gridSize && y < settings.gridSize)
                        .filter(
                            (hint) =>
                                (hint.x === settings.target.x && hint.y === settings.target.y) ||
                                !settings.tries.find((tries) => isAdjacent(tries, hint))
                        );

                    if (!settings.hints.length) {
                        adjacentSquares
                            .filter(
                                ({ x, y }) =>
                                    !settings.tries.find((tries) => tries.x === x && tries.y === y) &&
                                    !settings.hints.find((hint) => hint.x === x && hint.y === y)
                            )
                            .forEach((coordinate) => settings.hints.push(coordinate));
                    } else {
                        settings.hints = settings.hints.filter(({ x: x1, y: y1 }) =>
                            adjacentSquares.find(({ x: x2, y: y2 }) => x2 === x1 && y2 === y1)
                        );
                    }
                }

                settings.tries.push({
                    ...settings.player,
                });

                const lost = settings.maxAttempts !== null && settings.tries.length >= settings.maxAttempts;
                return lost ? (settings.onFailure?.(backTo) ?? backTo) : nextRoom;
            }

            return rm;
        }
    )
        .withColor(Mood.miniGame)
        .withFastPrint();
}

function isAdjacent({ x: x1, y: y1 }: { x: number; y: number }, { x: x2, y: y2 }: { x: number; y: number }) {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}
