import { Npc } from '../engine/npc';
import { addToInventory } from '../inventory/add-to-inventory';
import { Quests } from '../quests';
import { Apartment } from '../rooms/mermaid-city/apartment';
import { Names } from './npc-names';

export const Nerissa = new Npc(
    'nerissa',
    ['Nerissa Selune', 'Nerissa', 'roomie'],
    [
        `"Hey! You're back. You look... slightly less exhausted than usual. That's progress."`,
        `"Wait - don't move. Your skin looks terrible. I made something for that."`,
        `"Imagine being chosen for a legendary quest and still having to pay rent."`,
        () => {
            if (Quests.quests.mainQuest.progress < 3) return false;

            return `"If Thalor didn't break you today, I'm calling that a win."`;
        },
        () => {
            if (Quests.getStage('seaCucumber') !== 'completed') return false;

            return `"Have you tried out that sea-cucumber cream yet?  I use it every day and I feel like a new mermaid!`;
        },
        `"So... saving the ocean yet, or is that later this week?"`,
        `"I'm working on a kelp extract that's supposed to reduce stress. You... might need it."`,
        `"Careful out there, okay? I like having someone around to test my mixtures on."`,
        `"If you find any ancient artifacts, bring them back. I can probably turn them into a face serum."`,
        `"You've got that 'chosen one' look now. Very dramatic."`,
        `"Try not to die. It would really mess with my routine."`,
        `"Do you want something for muscle soreness? Or confidence? I've been experimenting."`,
    ],
    {
        startSeaCucumber: (npc, rm) => {
            return [
                `${npc.getName(rm)[Names.FirstName]} is hunched over a small coral table, carefully mixing a pale green paste. She glances up as you enter, eyes lighting up.
                
"Oh - perfect timing! I was just thinking about you."`,
                `"I'm working on a new formula for a scale cream! Sea-salt base with a binding agent from a very specific subspecies of sea cucumber.", she explains.

She gestures to a small, empty vial.

"The problem is... I don't have the cucumber."
`,
                `"And I don't need just any sea cucumber - I need the striped reef variant. They only grow along the deeper edges of the coral reef."

She leans in slightly.

"They're delicate. And... they tend to attract things that aren't."

A small pause.

${npc.getName(rm)[Names.FirstName]} continues, "I'd go myself, but I'm in the middle of stabilizing this mixture - and you're already heading out, right?"`,
                `She glances down at her tail, brushing a hand lightly over her scales.

"If this cream works," ${npc.getName(rm)[Names.FirstName]} explains, "it means stronger scales, faster recovery... protection against things that don't give second chances."

She looks back up at you, softer now.

"If I can make enough of it... it might help you out there, too."`,
                (nxtRm) => Quests.start(nxtRm, 'seaCucumber'),
            ];
        },
        seaCucumberHelp: () => {
            return [`"Having trouble finding that sea cucumber?  It's supposed to be more common the deeper in the coral reef you go."`];
        },
        finishSeaCucumber: (npc, rm) => {
            return [
                `${npc.getName(rm)[Names.FirstName]} looks up the moment you enter, immediately noticing what you're holding.
            
"Wait - is that? You actually found one!"`,
                `She gently takes the sea cucumber, already moving back to her workspace. Her hands work quickly and precisely - grinding, mixing, blending the ingredients into a smooth, shimmering cream.

You watch as the mixture shifts color slightly, settling into a soft, iridescent sheen.

After a moment, she turns back to you, holding a small sealed container.

Nerissa: "Here."`,
                `"This is a stabilized version of the cream. Not as strong as what I'll refine later... but it should help."

She presses it into your hand.

"Apply it before a fight - or after. You'll feel the difference."

A small smile.

`,
                `"And... thank you. Really."`,
                (nxtRm) =>
                    addToInventory(
                        'seaCucumberCream',
                        () => Quests.finish(nxtRm, 'seaCucumber'),
                        `${npc.getName(rm)[Names.FirstName]} hands you a bottle of her special cream.`
                    ),
            ];
        },
    },
    () => {
        const seaCucumberProgress = Quests.getStage('seaCucumber');

        if (seaCucumberProgress === null) {
            return 'startSeaCucumber';
        } else if (seaCucumberProgress === 'find-sea-cucumber') {
            return 'seaCucumberHelp';
        } else if (seaCucumberProgress === 'return-sea-cucumber') {
            return 'finishSeaCucumber';
        }

        return null;
    }
).move(Apartment);
