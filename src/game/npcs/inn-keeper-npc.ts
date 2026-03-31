import { hasItemInCategory } from '../inventory/has-item-in-category';
import { Knowledge } from '../knowledge';
import { progressQuest, Quests, startQuest } from '../quests';
import { Npc } from '../engine/npc';
import { Names, NpcNames } from './npc-names';

export const InnKeeperNpc = new Npc(
    'InnKeeper',
    () => (Knowledge.innKeeperName ? NpcNames['Inn Keeper'] : ['The innkeeper', 'The innkeeper', 'The innkeeper']),
    [
        (npc, rm) => {
            if (Quests.guildIntroduction.completed) return false;

            Knowledge.guildMasterName = true;

            return [
                `${npc.getName(rm)[Names.FirstName]} wipes down a mug and gives you a thoughtful look.

"If you're hunting for honest work, you'll want the guild hall. Head west from the village square and you'll see it soon enough. ${NpcNames['Guild Master'][Names.FullName]} runs the place - though most folks call him Fen the Fox. Clever man, that one. If there's coin to be earned around here, chances are he knows about it."`,
                startQuest('guildIntroduction'),
            ];
        },
        (npc, rm) => {
            if (Quests.farmingIntroduction.completed) return false;

            Knowledge.farmerName = true;

            return [
                `${npc.getName(rm)[Names.FirstName]} wipes down a mug and gives you a thoughtful look.

"If fighting isn't what you're looking for, ${NpcNames['Farmer'][Names.NickName]} is always looking for some help in his fields southeast of town. Pays pretty good for your hard labor, too."`,
                startQuest('farmingIntroduction'),
            ];
        },
        (npc, rm) => {
            return [
                `${npc.getName(rm)[Names.FirstName]} leans heavily on the worn counter, lowering his voice as the tavern noise fades into the background. His eyes flick briefly toward the window, as if the forest itself might be listening.

"South of the village," he says quietly, "past the last fields and the old hunting trail... that's where the Dark Forest begins. The trees grow thick there, and the paths twist in ways they shouldn't. Folk who wander too far tend to find trouble."`,
                `He wipes a mug with a rag, pausing before continuing.

"And if you push through those woods, you'll find a cave set into the hillside. Black as pitch inside. Creatures nest there - goblins, beasts, worse things maybe. They don't fight fair either. Hide in the shadows, wait along the for passersby - then strike when your back's turned."

${npc.getName(rm)[Names.FirstName]} gives you a long look before setting the mug down.

"Just be careful if you head that way. Plenty of brave souls have walked south from this village... not all of them walked back."`,
            ];
        },
        (npc, rm) => {
            if (Quests.lootIntroduction.completed) return false;

            Knowledge.generalStoreOwnerName = true;

            return [
                `${npc.getName(rm)[Names.FirstName]} nods toward the window on the far side of the tavern and gestures with his thumb.

"If you happen to come back from your travels with a pack full of loot," he says, "you'll want to head east from here. That road leads straight into the village's shopping district."`,
                `He sets a mug down on the counter and continues.

"You'll find the general store there. ${NpcNames['General Store Owner'][Names.NickName]} runs the place - buys pelts, trinkets, lumber, most anything. Fair prices too, most days."

${npc.getName(rm)[Names.FirstName]} gives a small shrug.

"Better to turn that loot into coin while you can. Gold spends easier than monster teeth."`,
                hasItemInCategory('loot') ? progressQuest('lootIntroduction', 1, undefined, true) : startQuest('lootIntroduction'),
            ];
        },
        (npc, rm) => {
            if (Quests.fish.completed && Quests.forage.completed) return false;
            Knowledge.innKeeperWifeName = true;

            return [
                `${npc.getName(rm)[Names.FirstName]} wipes his hands on a worn apron and gives you a friendly nod.

"Traveler, if you happen to bring in any raw food - meat, fish, or the like - my wife ${NpcNames['Inn Keeper Wife'][Names.FirstName]} can cook it up proper for you. She's got a fine hand with the hearth. Just a small fee for the trouble, and you'll have yourself a warm meal instead of chewing on something half-wild.  She can even mix up some medicine for you if you have the ingredients."`,
                startQuest('fish'),
                startQuest('forage'),
            ];
        },
        (npc, rm) => {
            Knowledge.weaponStoreOwnerName = true;

            return `${npc.getName(rm)[Names.FirstName]} leans on the counter.

"Looking for something sharper than that, are you? If you need proper steel, head east from the inn into the shopping district. You'll find the weapon shop there - can't miss it. It's run by ${NpcNames['Weapon Store Owner'][Names.FirstName]}, though most folk around here call him ${NpcNames['Weapon Store Owner'][Names.NickName]}. He knows his blades better than anyone in the village."`;
        },
        (npc, rm) => {
            Knowledge.armorStoreOwnerName = true;

            return `${npc.getName(rm)[Names.FirstName]} nods toward the door and lowers his voice.

"If it's armor you're after, head east of the inn into the shopping district. There's a sturdy little smithy there run by ${NpcNames['Armor Store Owner'][Names.FullName]}. The woman could hammer plate from a wagon wheel if she had to. Stop by her shop and she'll get you fitted with something that'll keep a sword from finding your ribs."`;
        },
    ],
    {
        introduction: (npc, rm) => {
            const currentlyKnownInnKeeper = npc.getName(rm);
            const currentlyKnownInnKeeperWife = Knowledge.innKeeperWifeName ? NpcNames['Inn Keeper Wife'][Names.FirstName] : 'a barmaid';
            npc.met = true;
            Knowledge.innKeeperName = true;
            Knowledge.innKeeperWifeName = true;

            return [
                `"Welcome, traveler," says ${currentlyKnownInnKeeper[Names.FirstName]}. His voice is deep but friendly, the tone of someone used to greeting both strangers and neighbors alike. "Find yourself a seat and make yourself at home."

He gestures toward the hearth, where ${currentlyKnownInnKeeperWife} moves about tending the fire and serving meals. "My wife, ${NpcNames['Inn Keeper Wife'][Names.FirstName]}, will tend to you shortly."

${currentlyKnownInnKeeper[Names.FirstName]} leans casually on the counter. "If you need a meal, a room, or a bit of news about what's going on around here, just ask me, ${npc.getName(rm)[Names.NickName]}. I've been in this town long enough to know just about everyone - and most things worth knowing."`,
                startQuest('stayAtInn'),
            ];
        },
    },
    (npc) => {
        if (!npc.met) return 'introduction';
        return null;
    }
);
