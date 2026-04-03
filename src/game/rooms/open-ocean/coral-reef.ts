import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const CoralReef = new Room(
    {},
    () => `You are in the coral reef`,
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
                text: 'Go north towards the sacred garden',
            },
            {
                code: 'travel-west',
                text: 'Go west towards the city',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 5)
    .withName(RoomNames.openOcean.coralReef)
    .withInventoryAccess();
