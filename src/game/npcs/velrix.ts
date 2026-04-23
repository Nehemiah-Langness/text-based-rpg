import { Npc, type GenericNpc, type SpecialRemark } from '../engine/npc';
import type { Room, RoomLike } from '../engine/room';
import { Quests } from '../quests';
import { DarkWaters } from '../rooms/open-ocean/dark-waters';
import { dialogueRoom } from '../rooms/utility-rooms/dialogue-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Names } from './npc-names';

export const Velrix = new Npc(
    'velrix',
    (npc) => (npc.met ? ['Velrix the Keeper of Curios', 'Velrix', 'the Keeper'] : ['the deep-sea octopus', 'the octopus', 'the octopus']),
    undefined,
    (npc, room) => {
        if (Quests.getStage('mainQuest') === 'find-jewel-1') return startFetchQuest(npc, room);
        return null;
    }
).move(DarkWaters);

const fetchHook = (npc: GenericNpc, room: Room) => (backTo: RoomLike) =>
    dialogueRoom(
        backTo,
        [
            `${npc.getName(room)[Names.FirstName]} pulls something from a pile in their collection.  A faint glow radiates from it.`,
            `An Abyssal Crown Gem.`,
            `"I found this after a great rupture in the ocean long ago."

"It sang to me, so I kept it."`,
        ],
        {
            [`"I need that gem. It belongs to something important."`]: (backTo) =>
                resultRoom(() => {
                    npc.meet();
                    return resultRoom(backTo, Quests.progress('mainQuest', 'find-jewel-1'));
                }, [
                    `${npc.getName(room)[Names.FirstName]} tilts his head, studying you.
    
"'Need' is a string current. Most who say that are pulled under it.`,
                    `"Still... I am not unreasonable."

"There is something I cannot retrieve myself... hidden within a sealed cavern not far from here."`,
                    `"The cavern resists me. Old forces. Old locks."

"But you... you are already entangled in such things."

Bring me, Velrix, the Keeper of Curios, the Sealed Relic Orb from the cavern, and I will part with the gem.`,
                ]),
        }
    );

const startFetchQuest: SpecialRemark = (npc, room) => () => [
    (backTo) =>
        dialogueRoom(backTo, `"Ahh... a seeker. I wondered when the currents would bring one to me."`, {
            [`"You knew I was coming?"`]: (backTo) =>
                resultRoom(
                    () => fetchHook(npc, room)(backTo),
                    [
                        `${npc.getName(room)[Names.FirstName]} chuckles softly.
        
"I know I know many things that drift through the deep... including what you carry."

${npc.getName(room)[Names.FirstName]} gestures subtly to your pouch.`,
                    ]
                ),
            [`"Who are you?"`]: (backTo) => {
                npc.meet();
                return resultRoom(
                    () => fetchHook(npc, room)(backTo),
                    [
                        `"I am ${npc.getName(room)[Names.FullName]}."
            
"I find things of value, things with stories, and I bring them all here."`,
                        `"One such thing, I think you might be looking for..."`,
                    ]
                );
            },
        }),
];
