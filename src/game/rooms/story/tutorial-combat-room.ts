import { startCombatEncounter } from '../../combat/start-combat-encounter';
import type { RoomLike } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { GuardHall } from '../mermaid-city/guard-hall';
import { resultRoom } from '../utility-rooms/result-room';

export function tutorialCombatRoom(): RoomLike {
    return startCombatEncounter(
        GuardHall,
        [
            {
                level: 1,
                defense: 0,
                speed: 0,
                effects: [],
                health: 10,
                stamina: 100,
                strength: 0,
                moves: [
                    {
                        attack: 0,
                        coolDown: 2,
                        coolDownCompleteText: '',
                        inCoolDown: 0,
                        level: 1,
                        name: 'Taunt',
                        actionDescription: 'taunts you',
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
            onComplete: (rm) =>
                resultRoom(
                    () => Quests.progress(rm, 'mainQuest', 'train-tail-kick'),
                    `You have finished training with ${Thalor.getName()[Names.FirstName]}.`
                ),
        }
    );
}
