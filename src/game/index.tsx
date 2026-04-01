import { useCallback, useState, type CSSProperties } from 'react';
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
    const [roomColor, setRoomColor] = useState<
        | string
        | {
              primary: string;
              secondary: string;
          }
        | undefined
    >(MainMenu.roomColor);
    const [readyForInput, setReadyForInput] = useState(false);
    const onTextComplete = useCallback(() => setReadyForInput(true), []);

    const [text, setText] = useState(MainMenu.getText());
    const [inputOptions, setInputOptions] = useState<ReturnType<Room['getOptions']>>(MainMenu.getOptions());

    const onSelect = useCallback(
        (code: string) => {
            const room = inputOptions.select(code);
            setText(room.getText());
            setInputOptions(room.getOptions());
            setRoomColor(room.roomColor);
            setReadyForInput(false);
        },
        [inputOptions]
    );

    return (
        <div
            className='game'
            style={
                typeof roomColor === 'string'
                    ? ({
                          '--bg-color': roomColor,
                      } as CSSProperties)
                    : typeof roomColor === 'object'
                    ? ({
                          '--bg-color': roomColor.primary,
                          '--bg-color-2': roomColor.secondary,
                      } as CSSProperties)
                    : undefined
            }
        >
            <div>
                <Text key={text} content={text} onComplete={onTextComplete} readyForInput={readyForInput} />
                {readyForInput ? <InputOptions onInput={onSelect} options={inputOptions.options} /> : null}
            </div>
        </div>
    );
}
