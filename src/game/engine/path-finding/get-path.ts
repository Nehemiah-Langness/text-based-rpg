import { compare } from '../../../helpers/compare';
import type { Room } from '../room';
import { continuePath } from './continue-path';

export function getPath(from: Room, to: Room) {
    const paths = continuePath(
        to,
        [
            [
                {
                    room: from,
                    direction: '',
                },
            ],
        ],
        [
            {
                room: from,
                bestPath: 0,
            },
        ],
        0
    );

    const successfulPaths = paths?.filter((path) => path[path.length - 1].room === to);

    return successfulPaths?.sort(compare((x) => x.length, 'desc'))[0] ?? null;
}
