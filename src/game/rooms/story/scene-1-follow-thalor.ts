import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Player } from '../../player';
import { resultRoom } from '../utility-rooms/result-room';
import { tutorialCombatRoom } from './tutorial-combat-room';

export const Scene1 = resultRoom(() => {
    return resultRoom(
        tutorialCombatRoom,
        [Player.skillSet.levelSkill('tailKick')].filter((x) => x !== null)
    );
}, [
    `You follow ${Thalor.getName()[Names.FullName]} through the arched passageway, leaving the open plaza behind.

The light dims as you move deeper into the city's inner structures. The walls around you shift from smooth white stone to intricately carved marble, inlaid with flowing patterns of silver and pearl. Spirals, waves, and ancient symbols twist across every surface - architecture that feels alive, as though shaped by the ocean itself rather than built by hand.

The corridor opens into the Guard Hall.

It is vast.`,
    `Tall, columned pillars rise toward a domed ceiling, each one wrapped in sculpted currents and figures of mermaid warriors locked in eternal battle. Between them, glowing orbs of soft blue light drift lazily, illuminating racks of spears, bladed fins, and reinforced armor crafted from shell and coral. The floor beneath you is polished stone, etched with concentric rings like ripples frozen in time.

At the center of the hall lies a wide, circular arena.

This is where mermaids learn to fight.`,
    `${
        Thalor.getName()[Names.FirstName]
    } moves to its edge and turns to face you, his expression already shifting from ceremony to discipline.

"Out there," he says, gesturing vaguely toward the distant ocean beyond the city walls, "you won't have the luxury of distance."

He swims into the arena and motions for you to join him.

"Your body is your first weapon. Learn to use it properly, or it will fail you."

You take your place across from him. The space suddenly feels smaller.`,
    `${Thalor.getName()[Names.FirstName]} lowers his stance slightly, his powerful tail coiling beneath him.

"Watch carefully."

In a single, fluid motion, he pivots - his tail whipping through the water with explosive force. The movement is fast, precise, and controlled, sending a sharp current rippling across the arena.

"Tail Kick," he says, "Simple. Fast. Effective."

He straightens, eyes locking onto yours.`,
    `${Thalor.getName()[Names.FirstName]}'s voice cuts through the silence.

"Now you try."`,
]);
