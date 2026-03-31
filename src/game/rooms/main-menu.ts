import { Start } from '.';
import { loadGame } from '../game';
import type { InputOption } from '../input-option';
import { Room } from '../engine/room';
import { choiceRoom } from './utility-rooms/choice-room';
import { resultRoom } from './utility-rooms/result-room';

export const MainMenu = new Room(
    null,
    () => 'A game title should go here, but I do not have one yet, so this placeholder text will do.',
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'new-game',
                text: 'Start a new game',
            },
            {
                code: 'load-game',
                text: 'Load a game',
            },
        ];

        return {
            options: options,
            select: (choice: string) => {
                if (choice === 'load-game') {
                    const load = loadGame();
                    if (load === false) {
                        return resultRoom(rm, `You do not have an existing save file.`);
                    }
                    return load || Start;
                } else if (choice === 'new-game') {
                    if (localStorage.getItem('saved-game')) {
                        return choiceRoom(
                            `You have a game currently saved.  Do you want to start over?`,
                            [
                                {
                                    code: 'cancel',
                                    text: 'Cancel',
                                },
                                {
                                    code: 'new-game',
                                    text: 'Start Over',
                                },
                            ],
                            (choice) => {
                                if (choice === 'new-game') {
                                    localStorage.setItem('saved-game', '');
                                    return Start;
                                }
                                return rm;
                            }
                        );
                    }

                    localStorage.setItem('saved-game', '');
                    return Start;
                }

                return rm;
            },
        };
    }
);
