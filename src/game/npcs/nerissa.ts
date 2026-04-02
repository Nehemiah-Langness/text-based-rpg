import { Npc } from '../engine/npc';
import { Quests } from '../quests';
import { Apartment } from '../rooms/mermaid-city/apartment';

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
        `"So... saving the ocean yet, or is that later this week?"`,
        `"I'm working on a kelp extract that's supposed to reduce stress. You... might need it."`,
        `"Careful out there, okay? I like having someone around to test my mixtures on."`,
        `"If you find any ancient artifacts, bring them back. I can probably turn them into a face serum."`,
        `"You've got that 'chosen one' look now. Very dramatic."`,
        `"Try not to die. It would really mess with my routine."`,
        `"Do you want something for muscle soreness? Or confidence? I've been experimenting."`,
    ],
    {},
    () => null
).move(Apartment);
