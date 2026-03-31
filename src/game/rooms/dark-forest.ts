import { EnemyLevels } from '../enemies/enemy-level';
import { getEnemy } from '../enemies/get-enemy';
import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { LargeStick } from '../items/large-stick';
import { Quests } from '../quests';
import { Room } from '../engine/room';
import { encounterRoom } from './utility-rooms/encounter-room';
import { resultRoom } from './utility-rooms/result-room';

const RoomDescription = `Tall, ancient trees crowd close together here, their thick canopies dimming the sunlight to a green twilight. The air is cool and damp, and the forest floor is soft with moss and fallen leaves. Every sound seems muffled beneath the weight of the woods.

To the north, the ground rises sharply up a steep, root-covered slope leading toward a grassy clearing above.

To the south, the trees thin just enough to reveal a dark cave entrance set into a rocky outcrop, its interior swallowing what little light reaches it.`;

export const DarkForest = new Room(
    {
        stickLooted: false,
        encountered: false,
    },
    (rm) => {
        return [RoomDescription, rm.investigated && !rm.state.stickLooted ? LargeStick.investigationLanguage : null];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.killTierOneEnemy.active || Quests.killTierOneEnemy.completed) {
            options.push({
                text: 'Go off the main path and deeper into the forest',
                code: 'deeper',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else if (!rm.state.stickLooted) {
            options.push({
                code: 'loot-stick',
                text: 'Pick up stick',
            });
        }

        options.push(
            {
                text: 'Go north up the steep slope',
                code: 'travel-north',
            },
            {
                text: 'Go south to the cave entrance',
                code: 'travel-south',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(LargeStick.investigationLanguage);
            } else if (choice === 'loot-stick') {
                rm.state.stickLooted = true;
                return addToInventory('Large Stick', rm);
            } else if (choice === 'deeper') {
                if (rm.state.encountered) {
                    return resultRoom(rm, 'You do not want to head down that path again today.');
                }
                rm.state.encountered = true;
                return encounterRoom(
                    rm,
                    `The forest thickens with every step, the worn path fading into tangled roots and shadow. Towering oaks and twisted pines crowd together overhead, their branches choking out what little daylight remains. The air grows cooler and damp, heavy with the scent of moss and old leaves. Somewhere in the distance, a crow calls once before falling silent.

Your boots press into soft earth as the sounds of the village fade far behind you. The woods here feel older... watchful. A branch snaps somewhere off the path. The brush shifts.

You are no longer alone.`,
                    getEnemy(EnemyLevels.Weak),
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
    .atLocation('E', 5);
