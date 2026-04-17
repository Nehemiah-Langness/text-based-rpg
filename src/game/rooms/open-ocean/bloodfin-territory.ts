import { bloodFinLootTable } from '../../combat/bloodfin-loot-table';
import { createBloodfin } from '../../combat/create-bloodfin';
import { lootRoom } from '../../combat/loot-room';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const BloodfinTerritory = new Room(
    {
        requiresCombat: true,
    },
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'fight',
                text: 'Attack a Bloodfin patrol',
            },
        ];

        return {
            options,
            select: (code) => {
                const combat = () => {
                    const enemies = rollDice(3);
                    return startCombatEncounter(
                        rm,
                        new Array(enemies).fill(0).map(() => createBloodfin(4)),
                        {
                            onComplete: (rm) => {
                                const loot = bloodFinLootTable.roll(enemies);
                                return lootRoom(rm, `After scavenging the area, you find the following items:`, loot);
                            },
                        }
                    );
                };

                if (code === 'fight') {
                    return combat();
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-south',
                text: 'Go south to the sacred garden',
            },
            {
                code: 'travel-west',
                text: 'Go west to the old battlefield',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'A', 5)
    .withName(RoomNames.openOcean.bloodfinTerritory)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The water grows tense as you cross into the outskirts of Bloodfin territory.

The open ocean here feels watched. Currents shift in uneasy patterns, disturbed by constant movement.`,
    `Shapes glide through the distance - sleek, controlled, never still for long. Bloodfin patrols. Some move in groups of two or three, others alone, circling wide arcs before cutting sharply in new directions. 

None drift aimlessly.

They are hunting.`,
    `The seafloor below is scarred and uneven, marked by old conflict and fresh disturbance alike. 
    
Faint trails carve through the sand where patrols have passed again and again, wearing their presence into the terrain itself.`,
];

const VisitedDescription = `You are on the outskirts of Bloodfin territory.

To the west, the water darkens around the scattered remains of the forgotten battleground, its broken silhouettes barely visible through the shifting currents.

To the south, a soft, distant glow pushes against the tension - the Sacred Gardens, calm and untouched by the aggression that defines this place.`;
