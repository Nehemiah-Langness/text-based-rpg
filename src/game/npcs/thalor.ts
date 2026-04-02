import { Npc } from '../engine/npc';

export const Thalor = new Npc(
    'thalor',
    ['Commander Thalor', 'Thalor', 'Commander'],
    [
        () => {
            return '';
        },
    ],
    {},
    () => null
).meet();
