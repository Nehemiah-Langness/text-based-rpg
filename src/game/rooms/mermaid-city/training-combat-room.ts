import { startCombatEncounter } from '../../combat/start-combat-encounter';
import type { RoomLike } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { GuardHall } from './guard-hall';
import { resultRoom } from '../utility-rooms/result-room';
import { Player } from '../../player';

export function trainingCombatRoom(): RoomLike {
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
                        level: 1,
                        name: 'Taunt',
                        actionDescription: 'taunts you',
                        modifiers: [
                            {
                                duration: 1,
                                effect: 'distract',
                            },
                        ],
                        attack: 0,
                        coolDown: 2,
                        coolDownCompleteText: '',
                        inCoolDown: 0,
                        xp: -100000,
                    },
                    ...Object.values(Player.skillSet.skills)
                        .filter((x) => x.level > 0)
                        .map((x) => ({ ...x, xp: -100000 })),
                ],
                specificName: Thalor.getName()[Names.FirstName],
                genericName: Thalor.getName()[Names.FullName],
            },
        ],
        {
            nonLethal: true,
            onComplete: (rm) => resultRoom(rm, `You have finished training with ${Thalor.getName()[Names.FirstName]}.`),
        }
    );
}
