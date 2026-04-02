import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const FredsFish = new Room(
    {},
    () => `You are in Fred's Fish Fry`,
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
                text: 'Go south to the shops',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'C', 2)
    .withName(RoomNames.mermaidCity.freds)
    .withInventoryAccess();
