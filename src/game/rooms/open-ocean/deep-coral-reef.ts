import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const DeepCoralReef = new Room(
    {},
    () => `You are in the deep coral reef`,
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
                code: 'travel-west',
                text: 'Go west to the coral reef',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 6)
    .withName(RoomNames.openOcean.deepCoralReef)
    .withInventoryAccess();
