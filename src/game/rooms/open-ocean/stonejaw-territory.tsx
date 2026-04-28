import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSharkLootTable } from '../../combat/create-shark-loot-table';
import { createStonejaw } from '../../combat/create-stonejaw';
import { lootRoom } from '../../combat/loot-room';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { rollDice } from '../../dice';
import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Player } from '../../player';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';
import { faSkull } from '@fortawesome/free-solid-svg-icons';

export const StonejawTerritory = new Room(
    {
        requiresCombat: true,
    },
    () => [VisitedDescription],
    (stonejawTerritory) => {
        const level = Player.getLevel();

        const options: InputOption[] = [
            {
                code: 'fight',
                text: (
                    <>
                        Fight a Stonejaw patrol {level.attack < 6 ? <FontAwesomeIcon icon={faSkull} /> : null}
                        {level.defense < 6 ? <FontAwesomeIcon icon={faSkull} /> : null}
                    </>
                ),
            },
        ];

        return {
            options,
            select: (code) => {
                const combat = () => {
                    const enemies = rollDice(2, 3);
                    return startCombatEncounter(
                        stonejawTerritory,
                        new Array(enemies).fill(0).map(() => createStonejaw(6)),
                        {
                            onComplete: (rm) => {
                                stonejawTerritory.state.requiresCombat = false;
                                const loot = createSharkLootTable(6).roll(enemies);
                                return lootRoom(rm, `After scavenging the area, you find the following items:`, loot);
                            },
                        }
                    );
                };

                if (code === 'fight') {
                    return combat();
                }

                return stonejawTerritory;
            },
        };
    },
    (stonejawTerritory) => {
        return [
            {
                code: 'travel-north',
                text: 'Go north to the forgotten shrine',
            },
            stonejawTerritory.state.requiresCombat
                ? null
                : {
                      code: 'travel-east',
                      text: 'Go east into the trench',
                  },
        ];
    }
)
    .atLocation(OpenOceanMap, 'E', 3)
    .withName(RoomNames.openOcean.stonejawTerritory)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You cross into Stonejaw Brood territory, and the ocean changes immediately. The water grows colder, heavier - pressing in around you like a warning. 
    
The seabed is jagged and uneven, littered with ancient rock formations that resemble broken teeth jutting from the earth.`,
    `Sparse light filters down, swallowed quickly by the murky depths.

There's a stillness here, but not a peaceful one - something old and watchful lingers beneath it.`,
];

const VisitedDescription = `You are on the outskirts of Stonejaw territory.

To the north, the faint glow of the Forgotten Shrine offers a distant sense of refuge.

To the east, the seafloor drops sharply into a vast deep trench, its darkness stretching endlessly downward but you will need to fight to get there.`;
