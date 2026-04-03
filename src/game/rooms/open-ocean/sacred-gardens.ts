import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const SacredGarden = new Room(
    {},
    () => `You are in the sacred garden`,
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
                text: 'Go south towards the coral reef',
            },
            {
                code: 'travel-west',
                text: 'Go west to the old shipwreck',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'B', 5)
    .withName(RoomNames.openOcean.sacredGarden)
    .withInventoryAccess();
