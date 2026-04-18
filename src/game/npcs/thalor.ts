import { Npc, type SpecialRemark } from '../engine/npc';
import { Factions } from '../factions';
import { Quests } from '../quests';
import { GuardHall } from '../rooms/mermaid-city/guard-hall';
import { dialogueRoom } from '../rooms/utility-rooms/dialogue-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Skills } from '../skills';
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
    (npc, rm, remark?: 'firstClue' | 'learnBubbleBlast' | 'turnInCrownFragments') => {
        if (remark === 'firstClue' || Quests.getStage('mainQuest') === 'learn-first-clue-location') return firstClue(npc, rm);
        if (remark === 'learnBubbleBlast' || (Quests.checkStage('mainQuest', 'fight-for-crown') && Skills.skills.bubbleBlast.level === 0))
            return learnBubbleBlast(npc, rm);
        if (remark === 'turnInCrownFragments' || Quests.getStage('mainQuest') === 'learn-how-to-fix-crown')
            return turnInCrownFragments(npc, rm);
        return null;
    }
)
    .meet()
    .move(GuardHall);

const firstClue: SpecialRemark = (npc, room) => () => {
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
};
const learnBubbleBlast: SpecialRemark = (npc, room) => () => {
    return [
        `${npc.getName(room)[Names.FullName]} watches you in silence for a long moment.

Then he exhales slowly.

"You rely too much on proximity."

He steps forward into the training circle, raising one hand.`,
        `"Out there, you won't always have the luxury of closing the distance. Some enemies won't let you."

He shifts his stance, planting himself firmly as the current around him seems to still.

"So you make distance... your weapon."`,
        `His arms draw back - then strike forward in a rapid, controlled series of punches. Too fast to follow cleanly. The water in front of him compresses, tightening unnaturally - and then releases.

A focused burst surges outward, a visible wave of force cutting through the arena. In its wake, a spiraling trail of bubbles lingers, drifting and popping as the energy dissipates.

The strike hits the far wall with a dull, echoing impact.`,
        `Thalor lowers his arms.

"Bubble Blast."

He glances back at you.

"Speed. Control. Precision."

A brief pause.

"Your body doesn't just move through the water. It shapes it."`,
        `He steps aside, giving you space.

"Now show me you understand that."`,
        (backTo) =>
            resultRoom(
                backTo,
                [Skills.levelSkill('bubbleBlast', 1)].filter((x) => x !== null)
            ),
    ];
};

const turnInCrownFragments: SpecialRemark = (npc, room) => () => {
    return [
        `${npc.getName(room)[Names.FirstName]} stands near the training grounds, arms folded as you approach. His gaze sharpens immediately, as if he already senses something has changed.
        
"You've been gone longer than expected."

`,
        (backTo) =>
            dialogueRoom(
                backTo,
                `A brief pause. His eyes narrow slightly.

"Tell me... did you find something?"`,
                {
                    [`"Yes. I found the Abyssal Crown... but it's broken."`]: (backTo) =>
                        resultRoom(
                            () => Quests.progress(backTo, 'mainQuest', 'learn-how-to-fix-crown'),
                            [
                                `${npc.getName(room)[Names.FirstName]} exhales slowly, some tension leaving his posture - but not all.

“Then the stories were true... the Abyssal crown is real.”

His gaze shifts briefly, thoughtful - calculating.

“Broken, you say.”

He steps closer, his tone sharpening again.

“That may be a blessing. A whole crown in the wrong hands would be... catastrophic.”

A pause.

Thalor: “But if it can be restored, it can still serve its purpose.”

He gestures slightly toward the city.

Thalor: “Take it to Garron Reefguard. If anyone in this city can stabilize something like that, it's him.”

Thalor: “Go. And be careful who sees what you're carrying.”`,
                            ]
                        ),
                    [`"Not yet."`]: (backTo) =>
                        resultRoom(backTo, [
                            `${npc.getName(room)[Names.FirstName]} studies you for a moment longer than expected.

"Then keep looking."

A pause.

"You're close. I can tell. Don't lose focus now."`,
                        ]),
                }
            ),
    ];
};
