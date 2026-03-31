import { Knowledge } from '../knowledge';
import { finishQuest, progressQuest, Quests, startQuest } from '../quests';
import { Npc } from '../engine/npc';
import { Names, NpcNames } from './npc-names';

export const GuildMasterNpc = new Npc(
    'GuildMaster',
    () => (Knowledge.guildMasterName ? NpcNames['Guild Master'] : ['The guild master', 'The man', 'The man']),
    [
        (npc, rm) => {
            if (Quests.killTierOneEnemy.completed) return false;

            const quests = [startQuest('killTierOneEnemy')];
            if (quests.length) {
                quests.push(finishQuest('talkToGuildMaster'));
            }

            return [
                `${npc.getName(rm)[1]} leans forward from behind his polished oak desk, his eyes narrowing thoughtfully.

"The dark forest to the south of the village isn't safe," he warns, his voice low and steady. "Monsters and bandits have made their homes there, and it's only a matter of time before they start troubling the village. If you're willing, we need brave hands to clear it out and make the roads safe again. Think you're up to the task?"`,
                ...quests,
            ];
        },
        (npc, rm) => {
            if (!Quests.killTierOneEnemy.completed) return false;
            if (Quests.killTierTwoEnemy.completed) return false;

            const quests = [startQuest('killTierTwoEnemy')];
            if (quests.length) {
                quests.push(finishQuest('talkToGuildMaster'));
            }

            return [
                `${npc.getName(rm)[Names.FirstName]}'s expression hardens as he leans back in his chair, steepling his fingers.

"South of the Dark Forest lies a cave," he says gravely. "It's far more dangerous than anything you'll find among the trees. The creatures within are cunning, fierce, and relentless. Only the most skilled adventurers should even think of venturing there. If you take on this task, know it will test every ounce of your strength and wit - but the village will be safer for it... if you survive."`,
                ...quests,
            ];
        },
        (npc, rm) => {
            if (!Quests.killTierTwoEnemy.completed) return false;
            if (Quests.killTierThreeEnemy.completed) return false;

            const quests = [startQuest('killTierThreeEnemy')];
            if (quests.length) {
                quests.push(finishQuest('talkToGuildMaster'));
            }

            return [
                `Behind his polished oak desk, ${npc.getName(rm)[Names.FirstName]} leans forward, his eyes serious and intent.

"The wastelands to the far west are no place for the unprepared," he says. "Terrible enemies roam there - creatures and brigands that have driven travelers from the road. Every so often, one even finds its way to the village, though how they pass through the thick forest remains a mystery."

He gestures toward the southwest beyond the village. "If you intend to rid the wastelands of these threats, you'll need to find a way through that dense forest. It won't be easy, but it's the only path that will get you there."`,
                startQuest('findWayToPond'),
                ...quests,
            ];
        },
        (npc, rm) => {
            if (!Quests.killTierThreeEnemy.completed) return false;
            if (Quests.killTierFourEnemy.completed) return false;

            const quests = [startQuest('killTierFourEnemy')];
            if (quests.length) {
                quests.push(finishQuest('talkToGuildMaster'));
            }

            return [
                `${npc.getName(rm)[Names.FirstName]} leans back in his chair, fingers steepled, his gaze steady as he considers you.

"The source of the enemies troubling the wastelands appears to be an old stone fortification far to the west," he says quietly. "Its origins are a mystery - no one knows who built it or for what purpose. What is certain is that centuries have passed since anyone last set foot inside its walls."

He fixes you with a sharp look. "Whatever lurks there now, it has grown unchecked, and it's from there these threats spill into the land.  I think it's about time someone put that something in check, do you agree?"`,
                ...quests,
            ];
        },
        (npc, rm) => {
            if (!Quests.killTierFourEnemy.completed) return false;
            if (Quests.defeatBoss.completed) return false;

            const quests = [startQuest('defeatBoss')];
            if (quests.length) {
                quests.push(finishQuest('talkToGuildMaster'));
            }

            return [
                `${npc.getName(rm)[Names.FirstName]} leans heavily on the war table, the dim lantern light carving deep lines into his weathered face. His voice is steady, but there's urgency beneath it.

"The time for small victories is over," he says, eyes fixed on you. "West of the wastelands stands the old stone fort - we now know what has taken root inside it. A sorcerer warlord now commands it... and every day he grows stronger."`,
                `He straightens, placing a sealed map in your hands.

"You've done what no one else could. That's why I'm asking this of you - no, trusting you with it. Go to that fort. End him. If he marches, there won't be a realm left to defend."

"Come back alive... if you can."`,
                ...quests,
            ];
        },
        (npc, rm) => `${npc.getName(rm)[0].split(' ')[0]} leans back in his chair, a sly smile tugging at the corners of his mouth.

"You know," he says, tapping a finger against a stack of ledgers, "there's a surprising amount of useful things left behind in this world if you keep your eyes open. A forgotten pouch here, a loose arrow there - sometimes it's the observant adventurers who find the best rewards, long before anyone else even notices."`,
        (npc, rm) => `${npc.getName(rm)[1]} looks up from a stack of papers and studies you for a moment.

"You'll find your own way out there," they say calmly. "But here's a bit of advice some adventurers overlook. Fighting from a distance can make it easier to avoid an enemy's strikes. If you keep space between you and your foe, you'll often have more room to dodge when things get dangerous."

He folds his hands on the desk.

"Of course, that path has its own demands. Anyone relying on ranged weapons needs to carry enough ammunition. Running out in the middle of a fight tends to end poorly."`,
        (
            npc,
            rm
        ) => `"Another small piece of advice," ${npc.getName(rm)[0].split(' ')[0]} says, resting his hands on the desk. "Don't rush from one fight straight into the next. Take a moment after a battle to steady yourself."

He nods toward your pack.

"Use that time to apply any medical supplies you're carrying and recover a bit. And if you rely on ranged weapons, make sure you re-equip them once you've replenished your ammunition. Many promising fighters have fallen simply because they charged ahead before they were ready."`,
        () => `"When you defeat an enemy, you'll have the chance to search the battlefield. That means collecting whatever valuables they carried and recovering any ammunition you spent during the fight."

He closes a ledger with a soft thud.

"But if you're forced to flee, consider anything you fired gone for good. Arrows lost in the brush, bolts buried in armor... none of it will be waiting for you. Sometimes retreat is the wise choice - but it does come at a cost.`,
    ],
    {
        introduction: (npc, rm) => {
            npc.met = true;
            Knowledge.guildMasterName = true;
            return [
                `"Ah, welcome," he says, extending a hand. "Name's ${npc.getName(rm)[0]}, though most call me ${npc.getName(rm)[1]}. This is the guild hall - your one-stop for work around the village. Pick up requests, complete your tasks, and bring them back here. We'll make sure a fair coin finds its way into your purse."`,
                progressQuest('guildIntroduction', 2, undefined, true),
            ];
        },
    },
    (npc) => {
        if (!npc.met) return 'introduction';
        return null;
    }
);
