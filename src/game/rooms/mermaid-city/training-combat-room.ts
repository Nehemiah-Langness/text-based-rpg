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
                speed: 30,
                effects: [],
                health: Player.health.max,
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
                    ...Object.entries(Player.skillSet.skills)
                        .filter(([name, x]) => x.level > 0 && (name as keyof typeof Player.skillSet.skills) !== 'starfishThrow')
                        .map(([, x]) => ({ ...x, xp: -100000 })),
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
