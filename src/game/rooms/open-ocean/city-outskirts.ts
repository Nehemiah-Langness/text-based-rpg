import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { MermaidCityMap } from '../mermaid-city/map';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const CityOutskirts = new Room(
    {},
    () => `You are outside the city`,
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: (code) => {
                if (code === 'travel-north-custom') {
                    return MermaidCityMap.entrance ?? rm;
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north-custom',
                text: 'Enter the city',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 2)
    .withName(RoomNames.openOcean.cityOutskirts)
    .withInventoryAccess();

OpenOceanMap.entrance = CityOutskirts;
