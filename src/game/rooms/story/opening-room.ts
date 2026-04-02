import { Room } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { GuardHall } from '../mermaid-city/guard-hall';
import { MermaidPlaza } from '../mermaid-city/mermaid-plaza';
import { Mood } from '../moods/mood';
import { resultRoom } from '../utility-rooms/result-room';

export const OpeningRoom = resultRoom(() => {
    Thalor.move(GuardHall);
    return Room.resolve(Quests.start(MermaidPlaza, 'mainQuest'));
}, [
    `The water is still and heavy, as if the ocean itself is holding its breath.
    
Soft blue light filters down from far above, scattering across the white stone towers of the mermaid city. Bioluminescent coral flickers along the walls, casting slow, pulsing shadows that dance like ghosts of those long gone.

You float at the center of the main plaza - dozens of mermaids gather in silence, their eyes fixed on the elevated dais at the city's center.`,
    `No one speaks. It is the tenth year - time for The Choosing.

At the far end of the platform stands ${Thalor.getName()[Names.FullName]}, head of the mermaid guard.

He is older than most - his long, silver-streaked hair drifts like strands of moonlight in the current. Scars line his arms and shoulders, faint but numerous, each one a quiet testament to battles fought in waters far more dangerous than these. His gaze moves slowly across the crowd, sharp and unyielding.`,
    `Behind him, carved into a towering slab of ancient stone, is the symbol of the lost artifact: a three-pronged spear encircled by spiraling currents.

The Trident of the Deep.`,
    {
        text: `A hush falls deeper still as ${Thalor.getName()[Names.FirstName]} steps forward.

"Every ten years," he begins, his voice steady, carrying effortlessly through the water,
"we send one of our own into the abyss... chasing a relic that has claimed every life that sought it."

His eyes sweep the gathered crowd again - then stop on you.

"None have returned."`,
        color: Mood.ominous,
    },
    {
        text: `A ripple of unease spreads through the others. You feel it too - the weight of it pressing against your chest.

${
    Thalor.getName()[Names.FirstName]
} descends from the dais, each movement controlled, deliberate. He circles you once, silently, as if measuring something no one else can see.

Then he stops in front of you.`,
        color: Mood.ominous,
    },
    {
        text: `"Strength alone will not keep you alive out there," he says quietly. "The ocean does not care how brave you are."

"But hesitation will kill you faster than any shark."  

He straightens, turning back toward the crowd, "This one has been chosen."`,
        color: Mood.ominous,
    },
    {
        text: `A low murmur rises - shock, pity, perhaps even relief that it was not them.

${Thalor.getName()[Names.FirstName]} raises a hand, and the noise dies instantly.

"From this moment forward, you belong to the tide."`,
        color: Mood.ominous,
    },
    {
        text: `"If you are to survive even a single day on this quest," he continues, "you will train under my command."

He gestures toward the deeper corridors of the city - toward the guard's domain.

"Your journey begins with learning how not to die."`,
        color: Mood.ominous,
    },
    {
        text: `${Thalor.getName()[Names.FirstName]} lingers for a moment longer, then speaks again - this time only for you.

"Come," he says, "we start immediately."

He turns and swims toward the shadowed archway without waiting to see if you follow.`,
        color: Mood.ominous,
    },
]);
