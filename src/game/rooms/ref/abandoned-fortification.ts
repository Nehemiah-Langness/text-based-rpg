import { EnemyLevels } from '../../enemies/enemy-level';
import { getEnemy } from '../../enemies/get-enemy';
import type { InputOption } from '../../input-option';
import { Nothing } from '../../items/nothing';
import { Quests } from '../../quests';
import { Room } from '../../engine/room';
import { encounterRoom } from '../utility-rooms/encounter-room';
import { resultRoom } from '../utility-rooms/result-room';
import { Map } from '../../engine/map';

const RoomDescription =
    () => `You stand at the base of a massive stone fortification, its walls cracked and weathered by time. Broken battlements loom overhead, and the remains of old towers stand like silent sentinels against the sky. The place carries a heavy stillness, the kind that makes every sound feel unwelcome.

The air here feels different - tense and watchful. Dark gaps in the stonework hint at passages within, and the ruined gate stands half open, as though something passed through not long ago. It's the sort of place where danger could be waiting just out of sight.

${
    Quests.killTierFourEnemy.active || Quests.killTierFourEnemy.completed
        ? ''
        : `You should not proceed into the fort without a very good reason. Whatever has claimed these ruins is unlikely to welcome visitors.\n\n`
}Behind you to the east stretch the open wastelands you crossed to reach this place, offering the only clear path back.`;

export const AbandonedFortification = new Room(
    {
        encountered: false,
    },
    (rm) => {
        if (!rm.investigated) return [RoomDescription()];
        return [RoomDescription()];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.killTierFourEnemy.active || Quests.killTierFourEnemy.completed) {
            options.push({
                text: 'Enter the fortification',
                code: 'deeper',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        }

        options.push({
            text: 'Go east into the wastelands',
            code: 'travel-east',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Nothing.investigationLanguage);
            } else if (choice === 'deeper') {
                if (rm.state.encountered) {
                    return resultRoom(rm, 'You do not want to enter the fortification again today.');
                }
                rm.state.encountered = true;
                return encounterRoom(
                    rm,
                    `You step cautiously through the half-collapsed hallways, the air growing colder and heavier with each step. Broken stone littered across the floor crunches underfoot, and shadows stretch long across the ruined halls. Faded banners flap weakly in the draft, remnants of a fortress that once held pride and power.

As you move deeper, the silence thickens, broken only by distant, unsettling sounds - scrapes and low, guttural noises echoing from the darkened corridors ahead.

Something stirs in the gloom. Your hand tightens on your weapon as the shapes shift, signaling that whatever lurks here has noticed you.`,
                    getEnemy(EnemyLevels.Legendary),
                    EnemyLevels.Boss
                );
            }

            return rm;
        };

        return {
            options: options,
            select: select,
        };
    }
)
    .withInventoryAccess()
    .atLocation(new Map('Ref', 1, 'A'), 'D', 1);
