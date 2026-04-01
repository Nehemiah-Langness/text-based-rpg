import { useEffect, useMemo, useState } from 'react';

function useInterval(callback: () => void, ms: number) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = useMemo(() => setInterval(callback, ms), []);

    return {
        clearInterval: () => clearInterval(interval)
    }
}

export function Text({ content, onComplete, readyForInput }: { content: string; onComplete: () => void; readyForInput: boolean }) {
    const [currentCharacter, setCurrentCharacter] = useState(0);
    const progression = useInterval(() => {
            setCurrentCharacter((x) => x + 1);
        }, 50)

    if (!readyForInput && currentCharacter >= content.length) {
        onComplete();
        progression.clearInterval()
    }

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

    return <div style={{ whiteSpace: 'pre-line' }}>{content.substring(0, currentCharacter)}</div>;
}
