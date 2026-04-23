import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const SealedCavern = new Room(
    {},
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: () => {
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north to the crab work yard',
            },
            {
                code: 'travel-east',
                text: 'Go east to forgotten shrine',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 2)
    .withName(RoomNames.openOcean.sealedCavern)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You enter the Sealed Cavern`,
];

const VisitedDescription = `You are outside a sealed cavern.

To the north is the crab workyard.

To the east is the Forgotten Shrine.
`;
