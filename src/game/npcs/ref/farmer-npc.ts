import { Knowledge } from '../../knowledge';
import { progressQuest } from '../../quests';
import { Npc } from '../../engine/npc';
import { Names, NpcNames } from '../npc-names';

export const FarmerNpc = new Npc(
    'Farmer',
    () => (Knowledge.farmerName ? NpcNames['Farmer'] : ['The farmer', 'The farmer', 'The farmer']),
    [
        (
            npc,
            rm
        ) => `${npc.getName(rm)[Names.NickName]} stands by the fence line, looking out over the golden fields as a warm breeze rolls through the crops.

"Fine weather we're having," he says with an easy smile. "Sun's warm, wind's gentle, and the soil's just right. Days like this make a farmer's work a fair bit easier."`,
        (
            npc,
            rm
        ) => `${npc.getName(rm)[Names.FirstName]} leans against the fence, his gaze drifting toward the distant tree line where the fields give way to the shadowy edge of the Dark Forest.

"Lost a few head of livestock not long ago," he says with a troubled frown. "They wandered too close to that forest over there. Animals get spooked near those woods and sometimes they don't wander back."`,
        (npc, rm) => {
            Knowledge.innKeeperName = true;
            Knowledge.innKeeperWifeName = true;
            return `${npc.getName(rm)[Names.FullName]} stretches his back and looks west toward the road that winds over the grassy hill toward the distant village.

"Truth be told," he says with a small chuckle, "I've half a mind to head back to the inn tonight. ${NpcNames['Inn Keeper'][Names.NickName]} usually has a pot of stew going that could warm a man clear to his bones."

He smiles at the thought.

"And his wife, ${NpcNames['Inn Keeper Wife'][Names.NickName]}, knows how to make a traveler feel welcome. Hard to beat good food and kinder company after a long day in the fields."`;
        },
        (
            npc,
            rm
        ) => `${npc.getName(rm)[Names.FirstName]} tips the brim of his straw hat back and wipes his brow, glancing over the sunlit fields.

"Can't overstate it," he says with a grin. "Farm work's a lot easier when you've got a good straw hat to keep the sun off and light clothes that don't weigh you down. Makes even the longest day feel a bit shorter."`,
    ],
    {
        introduction: (npc, rm) => {
            npc.met = true;
            Knowledge.farmerName = true;

            return [
                `A broad-shouldered farmer approaches, brushing dust from his hands as he steps through a wooden gate.

"My name's ${npc.getName(rm)[Names.FullName]}," he says with an easy nod. "These fields keep me busy, but there's always more work than one man can handle.`,
                `The slow creak of a distant windmill drifts across the patchwork of crops and pasture as he gestures toward the surrounding farmland.

"If you're looking to earn a bit of coin while you're passing through, I've got work that could use doing. Nothing too fancy - just honest farm troubles that need a capable hand."`,
                progressQuest('farmingIntroduction', 2, undefined, true),
            ];
        },
        workCompleted: (
            npc,
            rm
        ) => `${npc.getName(rm)[Names.NickName]} wipes his brow with the back of his sleeve, looking over the fields with a satisfied nod.

"Well now, that's good work you've done," he says, reaching into a small leather pouch at his belt. A few coins clink together as he counts them out and places them in your hand. "Fair pay for honest labor."

The warm scent of soil and hay drifts across the quiet farmland as he glances back toward the rows of crops and the fences stretching across the fields.`,
        moreWork: (npc, rm) =>
            `"And if you find yourself wanting a bit more coin," ${npc.getName(rm)[Names.FirstName]} adds with a friendly grin, "don't wander too far. There's still work around here that could use doing."`,
        noMoreWork: (npc, rm) =>
            `${npc.getName(rm)[Names.FirstName]} gives a tired but satisfied nod. "That's the last of it for today - I'm afraid there's no more work left until tomorrow."`,
    },
    (npc) => {
        if (!npc.met) return 'introduction';

        return null;
    }
);
