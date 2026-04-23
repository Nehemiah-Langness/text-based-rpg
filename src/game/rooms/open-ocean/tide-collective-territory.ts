import { createTidecaller } from '../../combat/create-tidecaller';
import { lootRoom } from '../../combat/loot-room';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { tidecallerLootTable } from '../../combat/tidecaller-loot-table';
import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const TideCollectiveTerritory = new Room(
    {
        requiresCombat: true,
    },
    () => [VisitedDescription],
    (tideTerritory) => {
        const options: InputOption[] = [
            {
                code: 'fight',
                text: 'Attack a Tidecaller Collective patrol',
            },
        ];

        return {
            options,
            select: (code) => {
                const combat = (backTo?: RoomLike) => {
                    const enemies = rollDice(2, 3);
                    return startCombatEncounter(
                        backTo ?? tideTerritory,
                        new Array(enemies).fill(0).map(() => createTidecaller(9)),
                        {
                            onComplete: (rm) => {
                                tideTerritory.state.requiresCombat = false;
                                const loot = tidecallerLootTable.roll(enemies);
                                return lootRoom(rm, `After scavenging the area, you find the following items:`, loot);
                            },
                        }
                    );
                };

                if (code === 'fight') {
                    return combat();
                }

                return tideTerritory;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-west',
                text: 'Go south to the forgotten shrine',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'C', 6)
    .withName(RoomNames.openOcean.tideTerritory)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You glide into Tidecaller Collective territory, and the ocean shifts into something calmer - almost sacred. 
    
The currents here move with quiet intention, brushing past you in gentle, spiraling patterns as if guiding unseen paths.`,
    `Soft light filters through the water, refracting into slow, dancing ribbons that ripple across the seafloor.

Tall, swaying formations of coral and stone rise like natural pillars, arranged in ways that feel purposeful rather than random.`,
    `There's a presence here - not fully hostile, but deeply aware. It feels as though the ocean itself is watching... listening.`,
];

const VisitedDescription = `You are on the outskirts of Tidecaller territory. Tidecaller patrols circle the area.

To the west, the currents weaken and scatter, fading into an underwater barren wasteland, where life and motion give way to empty, exposed seafloor.`;
