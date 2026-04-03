import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const Wastelands = new Room(
    {},
    () => `You are in the wastelands`,
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
                text: 'Go north to the sacred garden',
            },
            {
                code: 'travel-south',
                text: 'Go south to the coral reef',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'C', 5)
    .withName(RoomNames.openOcean.wastelands)
    .withInventoryAccess();
