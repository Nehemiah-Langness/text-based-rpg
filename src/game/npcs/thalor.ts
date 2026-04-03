import { Npc } from '../engine/npc';
import { Factions } from '../factions';
import { Quests } from '../quests';
import { GuardHall } from '../rooms/mermaid-city/guard-hall';
import { Names } from './npc-names';
import { Velmora } from './velmora';

export const Thalor = new Npc(
    'thalor',
    ['Commander Thalor', 'Thalor', 'Commander'],
    [
        () => {
            return '';
        },
    ],
    {
        firstClue: (npc, room) => {
            Velmora.meet();

            return [
                `${npc.getName(room)[Names.FirstName]} begins to circle slowly, hands clasped behind his back.

"Your path is not blind, despite what the others believe. Those who came before you... they failed, yes - but they did not die without leaving something behind."

He stops, facing you directly.

"The last Chosen made a discovery before her death."`,
                `"A hermit. An outcast who lived beyond the reef - ${Velmora.getName(room)[Names.FirstName]}, known as ${
                    Velmora.getName(room)[Names.NickName]
                }."

The name lingers in the water between you.

"She was no ordinary recluse. Records recovered from the previous expedition suggest she once belonged to an ancient order... one that predates our city itself."

His gaze sharpens slightly.`,
                `"They called themselves ${Factions.silentOrder.nameFormal}."

The words feel heavy. Intentional.

"Their purpose was singular - to hide and protect the Trident of the Deep from those who would use it to control the ocean."

${npc.getName(room)[Names.FirstName]} turns, gesturing outward, toward the distant wilds beyond the city.

"${
                    Velmora.getName(room)[Names.FirstName]
                }'s dwelling was destroyed long ago. Tectonic shifts... deep collapses. The reef swallowed most of it."`,
                `He looks back at you.

"But not everything is lost so easily."

A beat.

"If she truly was a member of ${Factions.silentOrder.namePassing}, then she would have kept records. A journal. A relic. Something."

His voice lowers, more focused now.

"Find it."`,
                `The weight of the command settles over you.

"Whatever remains in those ruins may be the closest anyone has come to locating the Trident itself."

He steps aside, clearing the path toward the exit of the Guard Hall.

"Your training begins here," he says, "but your trial begins there."

A final glance.

"Go to the reef. Find what ${Velmora.getName(room)[Names.FirstName]} left behind."`,
                (rm) => Quests.progress(rm, 'mainQuest', 'learn-first-clue-location'),
            ];
        },
    },
    () => {
        if (Quests.getStage('mainQuest') === 'learn-first-clue-location') return 'firstClue';
        return null;
    }
)
    .meet()
    .move(GuardHall);
