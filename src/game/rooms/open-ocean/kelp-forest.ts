import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const KelpForest = new Room(
    {},
    () => `You are in the kelp forest`,
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
                code: 'travel-east',
                text: 'Go east to the old shipwreck',
            },
            {
                code: 'travel-west',
                text: 'Go west to the dolphin city',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'B', 3)
    .withName(RoomNames.openOcean.kelpForest)
    .withInventoryAccess();
