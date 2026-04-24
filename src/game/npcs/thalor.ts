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
    (npc, rm) => {
        if (Quests.getStage('mainQuest') === 'learn-first-clue-location') return firstClue(npc, rm);
        if (Quests.checkStage('mainQuest', 'fight-for-crown') && Skills.skills.bubbleBlast.level === 0) return learnBubbleBlast(npc, rm);
        if (Quests.getStage('mainQuest') === 'learn-how-to-fix-crown') return turnInCrownFragments(npc, rm);
        if (Quests.checkStage('mainQuest', 'fix-crown') && Skills.getSkills(true).every(({ skill }) => skill.level > 1)) {
            return learnKineticWave(npc, rm);
        }
        if (Quests.checkStage('mainQuest', 'fix-crown') && Skills.getSkills(true).every(({ skill }) => skill.level > 2)) {
            return learnOceanTwister(npc, rm);
        }
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
        (rm) => resultRoom(rm, Quests.progress('mainQuest', 'learn-first-clue-location')),
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

const learnKineticWave: SpecialRemark = (npc, room) => () => {
    return [
        `The training room inside the Guard Hall hums with controlled currents as ${npc.getName(room)[Names.FullName]} circles you, arms folded behind his back. 
        
The water here feels denser than usual - intentionally so.`,
        `"You've learned to strike," he says, nodding. "Tail Kick for power. Bubble Blast for distance. But both rely on direct force."

He stops in front of you, raising one hand slowly. The water around it begins to ripple - not violently, but with gathering pressure.

"This," Thalor continues, "is control."`,
        `With a sharp motion, he thrusts his arm forward. The surrounding water compresses, then erupts outward in a wide, surging wave that rushes across the room before dissipating against the far wall.

"Kinetic Wave," he says. "You're not just attacking - you're moving the ocean itself."

He gestures for you to try.`,
        `As you focus, you feel it - the same pressure building, not in your muscles, but in the water around you. When you release it, a broad wave surges forward, larger and less focused than his, but unmistakably powerful.

Thalor gives a small nod.`,
        `"Good. It'll improve. Just remember - this move costs more than your others. Use it when you need to control the fight, not just win it.`,
        (backTo) =>
            resultRoom(
                backTo,
                [Skills.levelSkill('kineticWave', 1)].filter((x) => x !== null)
            ),
    ];
};

const learnOceanTwister: SpecialRemark = (npc, room) => () => {
    return [
        `The training room shifts at ${npc.getName(room)[Names.FullName]}'s command. 
        
The currents that once moved in steady lines now begin to spiral, slow at first, then tightening into controlled rotations around the chamber.`,
        `"You've learned to push the ocean," Thalor says, watching you carefully. "Now you'll learn to command its chaos."

He raises both hands, and the water around him begins to twist. What starts as a gentle swirl rapidly sharpens into a tightening vortex. The spiral deepens, pulling sand and loose particles upward into a spinning column.

With a sudden motion, he drives the vortex forward. It roars across the room like a living force - an underwater tornado - before collapsing in a burst of scattered current.`,
        `"Ocean Twister," he says, his voice steady despite the lingering turbulence. "Not just force. Not just control. This is dominance."

He turns to you.

"Focus on rotation. Don't fight the pull - guide it."`,
        `You gather the surrounding currents, feeling them resist at first, slipping through your grasp. 

Then, slowly, they begin to turn. A small spiral forms, unstable and uneven, but growing. 

With effort, you push it forward - the vortex surges ahead, wild and imperfect, but undeniably powerful.`,
        `The room settles as the currents calm.

Thalor nods once.

"Dangerous. Costly. But devastating when it lands. Use it wisely... or it will use you."`,
        (backTo) =>
            resultRoom(
                backTo,
                [Skills.levelSkill('oceanTwister', 1)].filter((x) => x !== null)
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
                            () => resultRoom(backTo, Quests.progress('mainQuest', 'learn-how-to-fix-crown')),
                            [
                                `${npc.getName(room)[Names.FirstName]} exhales slowly, some tension leaving his posture - but not all.

"Then the stories were true... the Abyssal crown is real."

His gaze shifts briefly, thoughtful - calculating.

"Broken, you say."`,
                                `He steps closer, his tone sharpening again.

"That may be a blessing. A whole crown in the wrong hands would be... catastrophic."

A pause.

"But if it can be restored, it can still serve its purpose."`,
                                `He gestures slightly toward the city.

"Take it to Garron Reefguard at Reefguard Armory. If anyone in this city can stabilize something like that, it's him."

"Go. And be careful who sees what you're carrying."`,
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
