import { EnemyLevels } from '../enemies/enemy-level';
import { getEnemy } from '../enemies/get-enemy';
import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { Rock } from '../items/rock';
import { Quests } from '../quests';
import { Room } from '../engine/room';
import { encounterRoom } from './utility-rooms/encounter-room';
import { resultRoom } from './utility-rooms/result-room';

const RoomDescription = `You stand in a cold, lightless cave. The air smells of damp stone, and somewhere in the darkness you hear the slow drip of water echoing through unseen chambers. Faint light spills in from the passage behind you.

To the north, pale daylight marks the exit.

To the south, the cave descends deeper into darkness, where the narrow tunnel twists beyond the reach of the light.`;

export const Cave = new Room(
    {
        rockLooted: false,
        encountered: false,
    },
    (rm) => {
        return [RoomDescription, rm.investigated && !rm.state.rockLooted ? Rock.investigationLanguage : null];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.killTierTwoEnemy.active || Quests.killTierTwoEnemy.completed) {
            options.push({
                text: 'Go deeper into the cave',
                code: 'deeper',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.rockLooted) {
            options.push({
                code: 'loot-rock',
                text: 'Pick up rock',
            });
        }

        options.push({
            text: 'Exit the cave',
            code: 'travel-north',
        });

        const select = (choice: string) => {
            rm.visited = true;
            rm.changeIndicator += 1;

            if (choice === 'investigate') {
                return rm.investigate(Rock.investigationLanguage);
            } else if (choice === 'loot-rock') {
                rm.state.rockLooted = true;
                return addToInventory('Rock', rm);
            } else if (choice === 'deeper') {
                if (rm.state.encountered) {
                    return resultRoom(rm, 'You do not want to head deeper into the cave again today.');
                }
                rm.state.encountered = true;
                return encounterRoom(
                    rm,
                    "You descend deeper into the cave with every step, the light from the entrance fading into a distant memory. The air grows colder, thicker, and the walls close in around you. Dripping water echoes through the darkness - until another sound joins it. Slow. Uneven. Getting closer. Something is moving in the depths... and it knows you're here.",
                    getEnemy(EnemyLevels.Strong),
                    EnemyLevels.Dangerous
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
    .atLocation('F', 5);
