import { rollDice } from '../dice';
import type { RoomLike } from '../engine/room';
import { Mood } from '../rooms/moods/mood';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';

export function sneakRoom(
    backTo: RoomLike,
    settings: {
        gridSize: number;
        enemies: { x: number; y: number }[];
        enemyName: string;
        player: { x: number; y: number };
        target: { x: number; y: number };
        onComplete?: (rm: RoomLike) => RoomLike;
        onFailure?: (rm: RoomLike) => RoomLike;
    }
) {
    const entities = settings.enemies
        .map((enemy) => ({
            coordinates: enemy,
            icon: '!',
        }))
        .concat({
            coordinates: settings.player,
            icon: '*',
        })
        .concat({
            coordinates: settings.target,
            icon: 'X',
        });

    const drawGrid = () => {
        const lines: string[] = [];
        for (let y = 0; y < settings.gridSize; y++) {
            for (let row = 0; row < 3; row++) {
                let currentLine = '';
                for (let x = 0; x < settings.gridSize; x++) {
                    if (row === 0 || (row === 2 && y === settings.gridSize - 1)) {
                        currentLine += `----${x === settings.gridSize - 1 ? '-' : ''}`;
                    } else if (row === 1) {
                        currentLine += `| ${entities.find((e) => e.coordinates.x === x && e.coordinates.y === y)?.icon ?? ' '} ${
                            x === settings.gridSize - 1 ? '|' : ''
                        }`;
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
        drawGrid() + `\n\n! = ${settings.enemyName}\nX = Target\n* = You`,
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
            {
                code: 'leave',
                text: 'Abandon',
            },
        ].filter((x) => x !== null),
        (code, rm) => {
            const nextRoom = () => {
                if (settings.player.x === settings.target.x && settings.player.y === settings.target.y) {
                    return settings.onComplete?.(backTo) ?? backTo;
                }

                let lost = false;

                settings.enemies.forEach((enemy) => {
                    if (Math.abs(enemy.x - settings.player.x) <= 1 && enemy.y === settings.player.y) {
                        lost = true;
                        return;
                    } else if (Math.abs(enemy.y - settings.player.y) <= 1 && enemy.x === settings.player.x) {
                        lost = true;
                        return;
                    }

                    const options = [
                        enemy.y - 1 >= 0 && !entities.find((e) => e.coordinates.y === enemy.y - 1 && e.coordinates.x === enemy.x)
                            ? 'north'
                            : null,
                        enemy.y + 1 < settings.gridSize &&
                        !entities.find((e) => e.coordinates.y === enemy.y + 1 && e.coordinates.x === enemy.x)
                            ? 'south'
                            : null,
                        enemy.x - 1 >= 0 && !entities.find((e) => e.coordinates.y === enemy.y && e.coordinates.x === enemy.x - 1)
                            ? 'west'
                            : null,
                        enemy.x + 1 < settings.gridSize &&
                        !entities.find((e) => e.coordinates.y === enemy.y && e.coordinates.x === enemy.x + 1)
                            ? 'east'
                            : null,
                    ].filter((o) => o !== null);

                    if (options.length) {
                        const direction = options[rollDice(options.length) - 1];
                        if (direction === 'north') {
                            enemy.y -= 1;
                        } else if (direction === 'south') {
                            enemy.y += 1;
                        } else if (direction === 'west') {
                            enemy.x -= 1;
                        } else if (direction === 'east') {
                            enemy.x += 1;
                        }
                    }
                });

                return lost ? settings.onFailure?.(backTo) ?? backTo : sneakRoom(backTo, settings);
            };

            if (code === 'leave') {
                return backTo;
            } else if (code === 'north') {
                settings.player.y = Math.max(0, settings.player.y - 1);
                return nextRoom;
            } else if (code === 'east') {
                settings.player.x = Math.max(0, settings.player.x - 1);
                return nextRoom;
            } else if (code === 'south') {
                settings.player.y = Math.min(settings.gridSize - 1, settings.player.y + 1);
                return nextRoom;
            } else if (code === 'west') {
                settings.player.x = Math.min(settings.gridSize - 1, settings.player.x + 1);
                return nextRoom;
            }

            return rm;
        }
    )
        .withColor(Mood.miniGame)
        .withFastPrint();
}
