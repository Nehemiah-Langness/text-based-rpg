/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import type { InputOption } from './input-option';

export function InputOptions({ options, onInput }: { options: InputOption[]; onInput: (option: string) => void }) {
    const [selected, setSelected] = useState<number | null>(null);
    useEffect(() => {
        setSelected(null);
    }, [options]);

    useEffect(() => {
        const handler = ({ key, repeat }: KeyboardEvent) => {
            if (repeat) return;
            if (key >= '0' && key <= '9') {
                setSelected(+key - 1);
            } else if (key === 'Enter') {
                const option = selected != null ? options[selected] : null;
                if (option) {
                    onInput(option.code);
                }
            } else if (key === 'ArrowUp') {
                setSelected((x) => Math.max(0, (x ?? options.length) - 1));
            } else if (key === 'ArrowDown') {
                setSelected((x) => Math.min(options.length - 1, (x ?? -1) + 1));
            }
        };

        const clickHandler = () => {
            if (options.length === 1) {
                onInput(options[0].code);
            }
        };

        document.addEventListener('keydown', handler);
        document.addEventListener('mousedown', clickHandler);
        return () => {
            document.removeEventListener('keydown', handler);
            document.removeEventListener('mousedown', clickHandler);
        };
    }, [onInput, options, selected]);

    useEffect(() => {
        if (options.length === 1) {
            setSelected(0);
        }
    }, [options]);

    return (
        <div className='mt-5'>
            {options.length > 1 ? <span className='fw-bold game-text'>What would you like to do?</span> : null}
            <ul style={{ listStyle: 'none' }}>
                {options.map((o, i) => (
                    <li
                        className={'input-option ' + (selected === i ? 'text-decoration-underline' : '')}
                        key={o.code}
                        onClick={() => onInput(o.code)}
                    >
                        {options.length > 1 ? i + 1 + '.' : ''} {o.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}
