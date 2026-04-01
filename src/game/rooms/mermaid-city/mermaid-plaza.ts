import { Room } from '../../engine/room';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const MermaidPlaza = new Room({})
    .atLocation(MermaidCityMap, 'D', 3)
    .withName(RoomNames.mermaidCity.mermaidPlaza)
    .withInventoryAccess();
