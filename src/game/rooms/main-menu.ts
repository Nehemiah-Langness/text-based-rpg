import { loadGame } from '../game';
import type { InputOption } from '../input-option';
import { Room } from '../engine/room';
import { choiceRoom } from './utility-rooms/choice-room';
import { resultRoom } from './utility-rooms/result-room';
import { OpeningRoom } from './story/opening-room';

export const MainMenu = new Room(
    null,
    () => 'Welcome to "Trident of the Deep"',
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

        const newGame = () => {
            localStorage.setItem('saved-game', '');
            return OpeningRoom;
        };

        return {
            options: options,
            select: (choice: string) => {
                if (choice === 'load-game') {
                    const load = loadGame();
                    if (load === false) {
                        return resultRoom(rm, `You do not have an existing save file.`);
                    }
                    return load || OpeningRoom;
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
                                    return newGame();
                                }
                                return rm;
                            }
                        );
                    }

                    return newGame();
                }

                return rm;
            },
        };
    },
    undefined,
    {
        primary: '#83725a',
        secondary: '#100b06',
    }
);


