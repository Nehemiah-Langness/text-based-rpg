import { Npc } from '../engine/npc';

export const Velmora = new Npc(
    'velmora',
    (npc) =>
        npc.met ? ['Velmora the Ink-Seer', 'Velmora', 'the Ink-Seer'] : ['the old octopus hermit', 'the old hermit', 'the old hermit'],
    [
        () => {
            return '';
        },
    ],
    {},
    () => null
);
