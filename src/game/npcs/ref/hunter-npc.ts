import { Inventory } from '../../inventory/inventory';
import { Knowledge } from '../../knowledge';
import { progressQuest, Quests, startQuest } from '../../quests';
import { Npc } from '../../engine/npc';
import { Names, NpcNames } from '../npc-names';

export const HunterNpc = new Npc(
    'Hunter',
    () => (Knowledge.hunterName ? NpcNames['Hunter'] : ['The hunter', 'The hunter', 'The hunter']),
    [
        (npc, rm) => {
            return `${npc.getName(rm)[Names.FirstName]} takes a slow bite of his supper before speaking. 
            
"Most days I'm out before sunrise," he says. "Forest is quieter then - animals move easier when the world's still waking up."`;
        },
        (npc, rm) => {
            if (!Quests['findWayToPond'].active || Quests['findWayToPond'].completed) return false;

            Knowledge.pathToPond = true;
            return [
                `${npc.getName(rm)[Names.FirstName]} nods toward the direction of the woods beyond the village. 
            
"If you wander southwest of town," he says, "and push through the thicker part of the forest long enough, you'll come to a clearing with a pond. Cool, clear water. Best place I know to wash the dust off after a long walk."`,
                progressQuest('findWayToPond', 1),
            ];
        },
        (npc, rm) => {
            return `${npc.getName(rm)[Names.FirstName]} leans back in his chair slightly, resting an arm on the table. 
            
"You learn patience as a hunter," he remarks. "Sometimes you sit half a day just listening to the wind in the trees before you see so much as a rabbit."`;
        },
        (npc, rm) => {
            if (Quests.forage.completed) return false;

            return [
                `${npc.getName(rm)[Names.FirstName]} wipes his hands on a cloth and leans back in his chair. 
            
"If it's herbs you're after," he says, nodding toward the window, "try the woodlands south of the farms. Plenty of medicinal plants grow there if you know where to look. The villagers gather from there often enough, but the forest still has more than it gives away."`,
                startQuest('forage'),
            ];
        },
        (npc, rm) => {
            return `${npc.getName(rm)[Names.FirstName]} glances down at his bowl with a faint smile. 
            
"Village stew tastes a lot better after a few days sleeping under the canopy," he says. "Hard bread and dried meat only go so far."`;
        },
        (npc, rm) => {
            return `${npc.getName(rm)[Names.FirstName]} taps a finger lightly on the table as if tracing a trail. 
            
"Tracks tell stories if you know how to read them," he explains. "Broken twigs, bent grass... the forest's always talking."
            
${npc.getName(rm)[Names.FirstName]}'s expression grows a touch more serious as he finishes his thought. "Just mind yourself in the dark forest," he adds quietly. "Not everything out there runs from people."`;
        },
        (npc, rm) => {
            if (Quests.fish.completed) return false;

            return [
                `${npc.getName(rm)[Names.FirstName]} glances up from his meal and gives a small nod. 
            
"If you're after a good catch," he says, lowering his voice slightly, "head north of the farmlands outside of the village. There's a lake tucked beneath the ridge. Quiet place, but the fish there are plenty and not too wary yet."`,
                Inventory['Fishing Pole'].count > 0 ? progressQuest('fish', 1, undefined, true) : startQuest('fish'),
            ];
        },
    ],
    {
        introduction: (npc, rm) => {
            npc.met = true;
            Knowledge.hunterName = true;
            return `The hunter gives a small nod in greeting. "Name's ${npc.getName(rm)[Names.FullName]}," he says in a calm, steady voice. "Some folks around here call me Stagshadow."
            
He gestures vaguely toward the dark woods beyond the village. "I spend most of my time hunting out in the forest. Come in now and then for a hot meal before heading back out."`;
        },
    },
    (npc) => {
        if (!npc.met) return 'introduction';

        return null;
    }
);
