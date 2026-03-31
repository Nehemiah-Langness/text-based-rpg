/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';

export function Text({ content, onComplete }: { content: string; onComplete: () => void }) {
    const reset = useRef(false);
    const progression = useRef<NodeJS.Timeout>(null);
    const [currentCharacter, setCurrentCharacter] = useState(0);
    useEffect(() => {
        setCurrentCharacter(0);
        const nextChar = () => {
            setCurrentCharacter((x) => x + 1);
            reset.current = false;
        };
        progression.current = setInterval(nextChar, 50);
        reset.current = true;
    }, [content]);

    useEffect(() => {
        if (reset.current) {
            return;
        }
        if (currentCharacter >= content.length && progression.current) {
            clearInterval(progression.current);
            progression.current = null;
            onComplete();
        }
    }, [content.length, currentCharacter, onComplete]);

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
