import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const DarkWaters = new Room(
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
                code: 'travel-south',
                text: 'Go north to the forgotten shrine',
            },
            {
                code: 'travel-west',
                text: 'Go east to crab work yards',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'C', 3)
    .withName(RoomNames.openOcean.darkWaters)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You enter the dark waters`,
];

const VisitedDescription = `You are in the dark waters.

To the south is the Forgotten Shrine.

To the west is the crab workyard.
`;
