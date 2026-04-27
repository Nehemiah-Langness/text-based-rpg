import { startCombatEncounter } from '../../combat/start-combat-encounter';
import type { RoomLike } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { GuardHall } from './guard-hall';
import { resultRoom } from '../utility-rooms/result-room';
import { Player } from '../../player';
import { Mood } from '../moods/mood';

export function trainingCombatRoom(): RoomLike {
    return startCombatEncounter(
        GuardHall,
        [
            {
                level: Player.skillSet.getSkills(true).reduce((c, n) => Math.max(c, n.skill.level), 1),
                defense: 1,
                speed: 30,
                effects: [],
                health: Player.skillSet.getSkills(true).reduce((c, n) => c + n.skill.level * 10, 10),
                stamina: 100,
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
                        .filter(
                            ([name, x]) =>
                                x.level > 0 &&
                                !(
                                    ['starfishThrow', 'starfishThrowDiminished', 'sirensCall'] as (keyof typeof Player.skillSet.skills)[]
                                ).includes(name as keyof typeof Player.skillSet.skills)
                        )
                        .map(([, x]) => ({ ...x, coolDownCompleteText: '', xp: -100000 })),
                ],
                specificName: Thalor.getName()[Names.FirstName],
                genericName: Thalor.getName()[Names.FullName],
            },
        ],
        {
            nonLethal: true,
            onComplete: (rm) =>
                resultRoom(rm, `You have finished training with ${Thalor.getName()[Names.FirstName]}.`, undefined, Mood.battle),
            onFailure: (rm) => resultRoom(rm, `You are forced to yield to ${Thalor.getName()[Names.FirstName]}.`, undefined, Mood.dead),
        }
    );
}
