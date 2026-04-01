import { MermaidPlaza } from '../mermaid-city/mermaid-plaza';
import { Mood } from '../mood';
import { resultRoom } from '../utility-rooms/result-room';

export const OpeningRoom = resultRoom(MermaidPlaza, [
    `The water is still.

Not calm - never calm - but heavy. As if the ocean itself is holding its breath.`,
    `Soft blue light filters down from far above, scattering across the white stone towers of the mermaid city. Bioluminescent coral flickers along the walls, casting slow, pulsing shadows that dance like ghosts of those long gone.

You are not alone in the plaza.`,
    `Dozens of mermaids gather in silence, their eyes fixed on the elevated dais at the city's center. No one speaks. No one needs to.

It is the Tenth Year.

It is the Choosing.`,
    `At the far end of the platform stands Commander Thalor, head of the mermaid guard.

He is older than most - his long, silver-streaked hair drifts like strands of moonlight in the current. Scars line his arms and shoulders, faint but numerous, each one a quiet testament to battles fought in waters far more dangerous than these. His gaze moves slowly across the crowd, sharp and unyielding.`,
    `He is not here to celebrate.

He is here to judge.

Behind him, carved into a towering slab of ancient stone, is the symbol of the lost artifact: a three-pronged spear encircled by spiraling currents.

The Trident of the Deep.`,
    {
        text: `A hush falls deeper still as Thalor steps forward.

"Every ten years," he begins, his voice steady, carrying effortlessly through the water,
"we send one of our own into the abyss... chasing a relic that has claimed every life that sought it."

His eyes sweep the gathered crowd again - then stop.

On you.

"None have returned."`,
        color: {
            primary: Mood.ominous,
            secondary: Mood.ominousBg
        },
    },
    `A ripple of unease spreads through the others. You feel it too - the weight of it pressing against your chest.

Thalor descends from the dais, each movement controlled, deliberate. He circles you once, silently, as if measuring something no one else can see.

Then he stops in front of you.

"Look at me."

You do.

His eyes are colder up close. Not cruel - but certain.`,
    `"Strength alone will not keep you alive out there," he says quietly.
"The ocean does not care how brave you are."

A pause.

"But hesitation will kill you faster than any shark."

He straightens, turning back toward the crowd.

"This one has been chosen."

The words hit harder than any blow.`,
    `A low murmur rises - shock, pity, perhaps even relief that it was not them.

Thalor raises a hand, and the noise dies instantly.

"From this moment forward, you belong to the tide."

He looks back at you one final time.

"And to me."`,
    `A flicker of something passes through his expression - approval, perhaps. Or expectation.

"If you are to survive even a single day beyond our borders," he continues, louder now,
"you will train under my command."

He gestures toward the deeper corridors of the city - toward the guard's domain.

"Your journey begins with learning how not to die."

The crowd begins to disperse, slowly, quietly, leaving you standing at the center of it all.`,
    `Chosen.

Alone.

Thalor lingers for a moment longer, then speaks again - this time only for you.

"Come," he says.
"We start immediately."

He turns and swims toward the shadowed archway without waiting to see if you follow.`,
]);
