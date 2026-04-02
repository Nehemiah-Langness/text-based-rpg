import { Room } from '../../engine/room';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const GuardHall = new Room({}, () => 'You are at Guard Hall')
    .atLocation(MermaidCityMap, 'C', 3)
    .withName(RoomNames.mermaidCity.guardHall)
    .withInventoryAccess();
