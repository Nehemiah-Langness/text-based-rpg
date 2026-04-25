import { Npc, type GenericNpc, type SpecialRemark } from '../engine/npc';
import type { Room, RoomLike } from '../engine/room';
import { Quests } from '../quests';
import { dialogueRoom } from '../rooms/utility-rooms/dialogue-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Names } from './npc-names';

export const Velrix = new Npc(
    'velrix',
    (npc) => (npc.met ? ['Velrix the Keeper of Curios', 'Velrix', 'the Keeper'] : ['the deep-sea octopus', 'the octopus', 'the octopus']),
    undefined,
    (npc, room) => {
        if (Quests.getStage('mainQuest') === 'find-jewel-1') return startFetchQuest(npc, room);
        if (Quests.getStage('mainQuest') === 'jewel-1-turn-in') return turnInQuest(npc, room);
        return null;
    }
);

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
    
"'Need' is a strong current. Most who say that are pulled under it.`,
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

const turnInQuest: SpecialRemark = (npc, room) => () => [
    (backTo) =>
        resultRoom(backTo, [
            `${npc.getName(room)[Names.FirstName]} looks up as you enter his cavern.
    
"Ah, you have found it.  I can feel it's energy radiating from you.`,
            `${npc.getName(room)[Names.FirstName]} examines the item carefully, almost reverently.

He then gently move aside several objects and retrieve the glowing Abyssal Crown gem.`,
            `"A fair exchange," ${npc.getName(room)[Names.FirstName]} states as he hands over the gem.

"Take it. But understand - you are not the only one searching for power beneath these waters."`,
            ...(Quests.progress('mainQuest', 'jewel-1-turn-in') ?? []),
        ]),
];
