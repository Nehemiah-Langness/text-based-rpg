import { EnemyLevels } from '../enemies/enemy-level';
import { getEnemy } from '../enemies/get-enemy';
import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { Quests } from '../quests';
import { Room } from '../engine/room';
import { encounterRoom } from './utility-rooms/encounter-room';
import { resultRoom } from './utility-rooms/result-room';

const RoomDescription = `You stand in an expansive wasteland where the ground is dry, cracked, and scattered with weathered stones. The wind moves freely across the open land, carrying dust and the faint whisper of shifting sand.

Far to the east, a small pond glimmers in the distance at the foothills of a thick forest, its waters a rare patch of calm in the harsh landscape.

To the west rise the crumbling ruins of a large stone fortification. Broken towers and shattered walls still stand against the sky, and the place has the uneasy look of something no longer abandoned - likely claimed by foes that would not welcome visitors.`;

export const Wasteland = new Room(
    {
        looted: false,
        encountered: false,
    },
    (rm) => {
        return [RoomDescription, rm.investigated && !rm.state.looted ? 'Several arrows in good condition litter the land.' : null];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.killTierThreeEnemy.active || Quests.killTierThreeEnemy.completed) {
            options.push({
                text: 'Go deeper into the wastelands',
                code: 'deeper',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.looted) {
            options.push({
                code: 'loot',
                text: 'Pick up the the arrows',
            });
        }

        options.push(
            {
                text: 'Go east to the pond',
                code: 'travel-east',
            },
            {
                text: 'Go west to the stone fortifications',
                code: 'travel-west',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(
                    'You stand in what appears to have been a battlefield at one time.  Several arrows, still in good condition, are stuck into the ground.'
                );
            } else if (choice === 'loot') {
                rm.state.looted = true;

                return addToInventory('Arrow', rm, undefined, 7);
            } else if (choice === 'deeper') {
                if (rm.state.encountered) {
                    return resultRoom(rm, 'You do not want to head deeper into the wastelands again today.');
                }
                rm.state.encountered = true;
                return encounterRoom(
                    rm,
                    `You press deeper into the wastelands, leaving the last hints of greener land far behind. The ground grows harsher underfoot, broken stone and dry earth stretching endlessly in every direction.

The wind picks up, carrying dust across the barren flats as silence settles over the empty landscape.

Then - movement.

Shapes begin to emerge through the drifting haze ahead, and it quickly becomes clear that something out here has noticed your approach.`,
                    getEnemy(EnemyLevels.Dangerous),
                    EnemyLevels.Legendary
                );
            }
            const traveled = rm.travel(choice);
            if (traveled) return traveled;

            return rm;
        };

        return {
            options: options,
            select: select,
        };
    }
)
    .withInventoryAccess()
    .atLocation('D', 2);
