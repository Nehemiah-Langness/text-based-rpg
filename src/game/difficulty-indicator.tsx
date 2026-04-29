import { Player } from './player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';

export function DifficultyIndicator({ level }: { level: number }) {
    const playerLevel = Player.getLevel();
    return (
        <>
            {new Array(Math.min(4, Math.max(0, level - playerLevel.attack) + Math.max(0, level - playerLevel.defense)))
                .fill(() => <FontAwesomeIcon icon={faSkull} />)
                .map((X, i) => (
                    <X key={i}  />
                ))}
        </>
    );
}
