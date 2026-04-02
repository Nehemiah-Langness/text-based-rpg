import { startCombatEncounter } from '../../combat/start-combat-encounter';
import type { Room } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { GuardHall } from '../mermaid-city/guard-hall';

export function tutorialCombatRoom(): Room {
    return startCombatEncounter(
        GuardHall,
        [
            {
                level: 1,
                defense: 0,
                dodge: 0,
                effects: [],
                health: {
                    current: 10,
                    max: 10,
                },
                moves: [
                    {
                        attack: 0,
                        coolDown: 2,
                        coolDownCompleteText: '',
                        inCoolDown: 0,
                        level: 1,
                        name: 'Taunt',
                        modifiers: [
                            {
                                duration: 1,
                                effect: 'distract',
                            },
                        ],
                    },
                ],
                specificName: Thalor.getName()[Names.FirstName],
                genericName: Thalor.getName()[Names.FullName],
            },
        ],
        {
            nonLethal: true,
            completeText: `You have finished training with ${Thalor.getName()[Names.FirstName]}.`,
            onComplete: (rm) => Quests.progress(rm, 'mainQuest', 'train-tail-kick'),
        }
    );
}
