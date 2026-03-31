/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { rollDice } from './dice';
import { InputOptions } from './input-options';
import { MainMenu } from './rooms/main-menu';
import { Room } from './engine/room';
import { Text } from './text';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).generatePrice = (tier: number, base: number) => {
    const buyPrice = Math.round((Math.pow(10, tier) * base) / Math.ceil(Math.log10(base))) + rollDice(base);
    return {
        buy: buyPrice,
        sell: Math.round((buyPrice * (100 - 50 - rollDice(10))) / 100),
    };
};

export function Game() {
    const [currentRoom, setCurrentRoom] = useState(MainMenu);
    const [readyForInput, setReadyForInput] = useState(false);
    const onTextComplete = useCallback(() => setReadyForInput(true), []);

    const [text, setText] = useState('');
    const [inputOptions, setInputOptions] = useState<ReturnType<typeof currentRoom.getOptions>>({
        options: [],
        select: () => ({}) as Room<unknown>,
    });

    useEffect(() => {
        setText(currentRoom.getText());
        setInputOptions(currentRoom.getOptions());
        setReadyForInput(false);
    }, [currentRoom, currentRoom.changeIndicator]);

    const onSelect = useCallback(
        (code: string) => {
            setCurrentRoom(inputOptions.select(code));
        },
        [inputOptions]
    );

    return (
        <div className='game'>
            <div>
                <Text content={text} onComplete={onTextComplete} />
                {readyForInput ? <InputOptions onInput={onSelect} options={inputOptions.options} /> : null}
            </div>
        </div>
    );
}
