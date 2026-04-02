import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const Shops = new Room(
    {},
    () => `You are in the Shops`,
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
                text: "Go north to Fred's Fish Fry",
            },
            {
                code: 'travel-east',
                text: 'Go east to the main plaza',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'D', 2)
    .withName(RoomNames.mermaidCity.shops)
    .withInventoryAccess();
