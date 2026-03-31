import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { finishQuest, progressQuest, Quests } from '../quests';
import { Room } from '../engine/room';
import { campRoom } from './utility-rooms/camp-room';
import { fishingRoom } from './utility-rooms/fishing-room';

const RoomDescription =
    () => `You arrive at a quiet clearing where a broad pond lies still beneath the open sky. The water reflects the light softly, its edges ringed with reeds and smooth stones. To the north and south, steep rocky inclines rise sharply, their tops crowned with dense forest that rustles gently in the breeze.

The ground here is level and sheltered, making it a peaceful place where a traveler could easily set up camp for the night.

Beyond the clearing, the land changes. 

To the west stretches a bleak wasteland, dry and open as far as the eye can see. 

To the east, thick forest presses close together - dense enough to slow your steps, though determined travelers could push their way through if needed.`;

export const Pond = new Room(
    {
        looted: false,
        timesFished: 0,
    },
    (rm) => {
        return [
            RoomDescription(),
            rm.investigated && !rm.state.looted ? `Some preserved food lays in an explorer's bundle by the pond.` : null,
            progressQuest('fish', 2, 1),
            finishQuest('findWayToPond'),
        ];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'camp',
                text: 'Make camp',
            },
        ];

        if (Quests.fish.completed || (Quests.fish.active && Quests.fish.progress >= 2)) {
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
                text: 'Pick up the abandoned pouch of preserved foods',
            });
        }

        options.push(
            {
                text: 'Go east into the forest',
                code: 'travel-east',
            },
            {
                text: 'Go west to the wasteland',
                code: 'travel-west',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(
                    `You spot an abandoned pouch by the pond.  It is filled with several preserved foods.  Probably the rations from an adventurer who previously passed through.`
                );
            } else if (choice === 'loot') {
                rm.state.looted = true;

                return addToInventory(
                    'Pickled Vegetables Jar',
                    addToInventory('Dried Fruit Mix', addToInventory('Dried Meat Jerky', rm, undefined, 2))
                );
            } else if (choice === 'fish') {
                return fishingRoom(rm);
            } else if (choice === 'camp') {
                return campRoom(
                    rm,
                    75,
                    75,
                    `You kneel by the edge of the quiet pond, carefully setting up your modest camp. The gentle ripples of water catch the last rays of sunlight, while the soft rustle of leaves and distant bird calls fill the air. A calm washes over you, a rare moment of peaceful solitude before your journey continues.`
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
    .atLocation('D', 3);
