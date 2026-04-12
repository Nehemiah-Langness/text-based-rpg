import { useEffect, useMemo, useState } from 'react';

function useInterval(callback: () => void, ms: number) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = useMemo(() => setInterval(callback, ms), []);

    return {
        clearInterval: () => clearInterval(interval),
    };
}

export function Text({
    content,
    onComplete,
    readyForInput,
    fastPrint,
}: {
    content: string;
    onComplete: () => void;
    readyForInput: boolean;
    fastPrint: boolean;
}) {
    const [currentCharacter, setCurrentCharacter] = useState(fastPrint ? content.length : 0);
    const progression = useInterval(() => {
        setCurrentCharacter((x) => x + 1);
    }, 50);

    const complete = !readyForInput && currentCharacter >= content.length;
    if (complete) {
        progression.clearInterval();
    }
    useEffect(() => {
        if (complete) {
            onComplete();
        }
    }, [complete, onComplete]);

    useEffect(() => {
        const handler = (ev: KeyboardEvent | MouseEvent) => {
            if (ev.type === 'keydown') {
                const keyboardEvent = ev as KeyboardEvent;
                if (keyboardEvent.repeat) return;
                if (keyboardEvent.key === 'Enter') {
                    setCurrentCharacter(content.length);
                }
            } else {
                setCurrentCharacter(content.length);
            }
        };

        document.addEventListener('keydown', handler);
        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('keydown', handler);
            document.removeEventListener('mousedown', handler);
        };
    }, [content.length]);

    return (
        <div className='game-text' style={{ whiteSpace: 'break-spaces' }}>
            {content.substring(0, currentCharacter)}
        </div>
    );
}
