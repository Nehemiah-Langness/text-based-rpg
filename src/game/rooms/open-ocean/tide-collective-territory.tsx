import { createSharkLootTable } from '../../combat/create-shark-loot-table';
import { createTidecaller } from '../../combat/create-tidecaller';
import { lootRoom } from '../../combat/loot-room';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';
import { DifficultyIndicator } from '../../difficulty-indicator';

export const TideCollectiveTerritory = new Room(
    {
        requiresCombat: true,
    },
    () => [VisitedDescription],
    (tideTerritory) => {
        const options: InputOption[] = [
            {
                code: 'fight',
                text: (
                    <>
                        Attack a Tidecaller Collective patrol
                        <DifficultyIndicator level={5} />
                    </>
                ),
            },
        ];

        if (!tideTerritory.state.requiresCombat && Quests.getStage('sirensSong') === 'find-resonant-pearl') {
            options.push({
                code: 'seek-pearl',
                text: 'Look for the Resonant Pearl',
            });
        }

        return {
            options,
            select: (code) => {
                const combat = (backTo?: RoomLike) => {
                    const enemies = rollDice(2, 3);
                    return startCombatEncounter(
                        backTo ?? tideTerritory,
                        new Array(enemies).fill(0).map(() => createTidecaller(5)),
                        {
                            onComplete: (rm) => {
                                tideTerritory.state.requiresCombat = false;
                                const loot = createSharkLootTable(5).roll(enemies);
                                return lootRoom(
                                    resultRoom(rm, `You have defeated the patrol, and are able to move around freely for the time being.`),
                                    `After scavenging the area, you find the following items:`,
                                    loot
                                );
                            },
                        }
                    );
                };

                if (code === 'fight') {
                    return combat();
                } else if (code === 'seek-pearl') {
                    tideTerritory.state.requiresCombat = true;
                    const success = rollDice(4) === 2;
                    return resultRoom(
                        () => {
                            if (success) {
                                return resultRoom(tideTerritory, [
                                    `Inside, you find a softly, glowing pearl emitting a faint harmonic vibration.  This matches the description you were given by the Siren.
                                
You grab the Resonant Pearl and make a quick escape.`,
                                    `Your movements attracted another patrol who swims towards your location.`,
                                    ...(Quests.progress('sirensSong', 'find-resonant-pearl') ?? []),
                                ]);
                            } else {
                                return resultRoom(tideTerritory, [
                                    `Inside, you find many old relics.  Some relics emit an energy from them, but you dare not get to close without knowing their purpose.
                                
Nothing matches the description of the Resonant Pearl.`,
                                    `Your movements attracted another patrol who swims towards your location.`,
                                ]);
                            }
                        },
                        [`You search the immediate area and spot a small structure nearby.`],
                        'Search structure'
                    );
                }

                return tideTerritory;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-south',
                text: 'Go south to the deep coral reef',
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

To the south, dark colors peirce the ocean as the deeper parts of the coral reef come into view.`;
