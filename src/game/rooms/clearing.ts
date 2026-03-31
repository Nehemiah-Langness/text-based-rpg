import type { InputOption } from '../input-option';
import { Inventory } from '../inventory/inventory';
import { Stats } from '../stats';
import { Room } from '../engine/room';
import { campRoom } from './utility-rooms/camp-room';
import { resultRoom } from './utility-rooms/result-room';

const OpeningText = `Damp grass presses against your back, and the scent of soil and crushed leaves fills your lungs as you draw a slow breath. For a moment you lie still, staring upward. Pale daylight filters through a thin canopy of trees, their branches swaying gently in a breeze you can't quite feel.

You stand up and look down at yourself.

Basic clothing. Simple, rough fabric. No tools. No weapons. Empty pack.`;

const RoomDescription = `A small clearing stretches around you - no more than a rough circle in the forest, bordered by dense trees and tangled undergrowth. Shafts of light cut through the leaves and fall across the ground in shifting patterns. Somewhere in the distance, a bird calls.

The area around you is peaceful and open - a great place to make camp should you need to.

To the north you see a path cutting through the forest.`;

export const Clearing = new Room(
    {
        goldLooted: false,
    },
    (rm) => {
        if (!rm.visited) return [OpeningText, RoomDescription];
        return [RoomDescription, rm.investigated && !rm.state.goldLooted ? 'Several gold coins shimmer between the blades of grass.' : ''];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'camp',
                text: 'Make camp',
            },
        ];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        } else {
            if (!rm.state.goldLooted) {
                options.push({
                    code: 'loot-coins',
                    text: 'Pick up the gold coins',
                });
            }
        }

        options.push({
            text: 'Go north into the forest',
            code: 'travel-north',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(
                    'You notice shimmering light in the grass close by.  6 gold coins dropped by some unfortunate passerby are now free for the taking.'
                );
            } else if (choice === 'loot-coins') {
                rm.state.goldLooted = true;
                Inventory['Gold Coin'].count += 6;
                Stats.goldEarned = (Stats.goldEarned ?? 0) + 6;

                return resultRoom(rm, `You have picked up 6 gold coins`);
            } else if (choice === 'camp') {
                return campRoom(
                    rm,
                    50,
                    50,
                    `The ground is soft with the warm grass beneath you, and a ring of stones suggests other travelers have rested here before. After gathering a few dry branches, you strike a spark and coax a small fire to life. Its warm glow pushes back the creeping shadows of the woods.

You sit beside the crackling flames, letting the quiet settle in. The night air is cool, carrying the distant calls of unseen creatures somewhere beyond the trees. For now, the fire holds the darkness at bay, and the clearing offers a brief refuge before the journey continues.`
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
    .atLocation('E', 4);
