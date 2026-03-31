import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { Inventory } from '../inventory/inventory';
import { progressQuest } from '../quests';
import { Room } from '../engine/room';
import { campRoom } from './utility-rooms/camp-room';
import { fishingRoom } from './utility-rooms/fishing-room';

const RoomDescription =
    () => `You find yourself at a lake that rests in a quiet basin.  Its dark surface often still except for the slow ripple of wind across the water. 

To the northwest, a steep incline rises sharply from the shoreline up toward the village perched along the ridge above. From the heights, the clustered rooftops overlook the lake like watchful sentinels. 

The land softens into the broad fields of farmland to the south, neat rows of crops stretching across the gentle plain and catching the sun in wide bands of green and gold. 

The scent of damp earth and distant harvest often drifts across the lakeshore.`;

export const Lake = new Room(
    {
        timesFished: 0,
        looted: false,
    },
    (rm) => {
        return [
            RoomDescription(),
            rm.investigated && !rm.state.looted ? 'Some fishing tackle lays on the shore.' : null,
            progressQuest('fish', 2, 1),
        ];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'camp',
                text: 'Make camp',
            },
        ];

        if (Inventory['Fishing Pole'].count > 0) {
            options.push({
                code: 'fish',
                text: 'Fish',
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
                text: 'Pick up the fishing tackle',
            });
        }

        options.push({
            text: 'Go south to the farmland',
            code: 'travel-south',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate('You look around and notice that somebody has left some fishing tackle on the shore.');
            } else if (choice === 'loot') {
                rm.state.looted = true;
                return addToInventory('Fishing Tackle', rm, undefined, 2);
            } else if (choice === 'camp') {
                return campRoom(
                    rm,
                    50,
                    30,
                    `You make camp at the edge of the lake just as the last of the light fades, the water turning from gold to a dull, glassy black. The air smells clean - wet earth, reeds, and the faint mineral scent of still water - and for a moment, it feels like the kind of place where sleep should come easily. Your fire crackles low, its glow reflecting in broken ripples along the shoreline.

From the farmland stretching unseen in the dark, come the restless sounds of life that refuses to sleep. A distant cow bellows, long and low, answered by another further off. Wooden structures creak in the wind, followed by the sharp clatter of something loose -perhaps a gate, or a shutter not properly latched. Now and then, a dog barks, sudden and insistent, setting off a chain of answering calls that ripple across the fields before fading again.

You lie back, staring up at the stars, waiting for the noises to blur into something ignorable - but they never quite do.

Sleep, when it finally comes, is shallow and easily broken.`
                );
            } else if (choice === 'fish') {
                return fishingRoom(rm);
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
    .atLocation('C', 6);
