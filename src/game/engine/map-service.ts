import { MapList } from '../rooms/map-list';

export class MapService {
    static getRoom(mapId: string, coordinates: { x: number; y: string; }) {
        const map = MapList.find((map) => map.id === mapId);
        if (!map) return null;

        return map.cells[coordinates.y][coordinates.x];
    }
}
