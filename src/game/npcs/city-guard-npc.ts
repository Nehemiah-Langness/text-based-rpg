import { fullyClothed } from '../inventory/fully-clothed';
import { Knowledge } from '../knowledge';
import { startQuest } from '../quests';
import { Npc } from '../engine/npc';
import { Names, NpcNames } from './npc-names';

export const CityGuardNpc = new Npc(
    'CityGuard',
    () => (Knowledge.guardName ? NpcNames['City Guard'] : ['The village guard', 'The guard', 'The guard']),
    [
        (npc, rm) => {
            Knowledge.innKeeperName = true;
            Knowledge.innKeeperWifeName = true;

            return [
                `${npc.getName(rm)[Names.FirstName]} shifts his spear and nods toward the center of the village.

"If you're needing a place to rest, head over to the inn. ${NpcNames['Inn Keeper'][Names.FullName]} runs the place, and his wife ${NpcNames['Inn Keeper Wife'][Names.FirstName]} keeps the hearth going - most folks call her ${NpcNames['Inn Keeper Wife'][Names.NickName]}. You'll get a hot meal, a soft bed, and a welcome that'll make the road feel a little less long."`,
                startQuest('stayAtInn'),
            ];
        },
        (npc, rm) => {
            Knowledge.generalStoreOwnerName = true;
            return `${npc.getName(rm)[Names.FirstName]} adjusts his gauntlet and points northeast with a nod.

"If you need bandages or any sort of medical supplies, head to the shopping district just northeast of the village square. The general store's the place to go, run by ${NpcNames['General Store Owner'][0]}. The man keeps a tidy stock of anything that'll keep you in one piece out on the road."`;
        },
        (npc, rm) => {
            return [
                `${npc.getName(rm)[Names.FirstName]} folds his arms and gives you a more measured look.

"If you're looking for honest work and fair pay," he says, nodding down the road toward the center of the village, "you should head over to the guild hall. Speak with the guild master, ${NpcNames['Guild Master'][Names.FullName]}. He's always got tasks for capable folk."

${npc.getName(rm)[Names.FirstName]} adjusts the strap of his armor and adds, "Do the work right, and ${NpcNames['Guild Master'][Names.FirstName]} makes sure people are paid what they're owed."`,
                startQuest('guildIntroduction'),
            ];
        },
    ],
    {
        introduction: (npc, rm) => {
            npc.met = true;
            Knowledge.guardName = true;
            return `"Welcome to the village," he says. "Name's ${npc.getName(rm)[Names.FullName]}, one of the guards here. Keep the peace, mind the folk, and you won't have any trouble. If you need directions or run into danger, find one of us - we're here to keep the roads and the village safe."`;
        },
        playerNeedsClothes: (
            npc,
            rm
        ) => `${npc.getName(rm)[Names.FirstName]} stops dead in his tracks, his eyes widening as he takes in your appearance. His jaw tightens, and a sharp whistle escapes him.

"You can't go wandering around the village dressed like that!" he exclaims, his voice a mix of shock and disapproval.

He shakes his head, and pats the satchel at his side. "If you don't have anything suitable, I've got some spare clothes you can wear. Keeps you decent..."`,

        givesPlayerPants: (npc, rm) =>
            `${npc.getName(rm)[Names.FirstName]} reaches into his satchel and pulls out a rolled pair of Cloth Pants.`,
        givesPlayerShirt: (npc, rm) => `${npc.getName(rm)[Names.FirstName]} reaches into his satchel and pulls out a rolled Cloth Shirt.`,
    },
    (npc) => {
        if (!fullyClothed()) {
            return 'playerNeedsClothes';
        }

        if (!npc.met) return 'introduction';

        return null;
    }
);
