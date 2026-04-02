import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from '../open-ocean/map';
import { MermaidCityMap } from './map';

export const CityGates = new Room(
    {},
    () => `You at the city gates`,
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: (code) => {

                if (code === 'travel-south-custom'){
                    return OpenOceanMap.entrance ?? rm;
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: "Go north to the main plaza",
            },
            {
                code: 'travel-south-custom',
                text: 'Leave the city',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'E', 3)
    .withName(RoomNames.mermaidCity.cityGates)
    .withInventoryAccess();

MermaidCityMap.entrance = CityGates;