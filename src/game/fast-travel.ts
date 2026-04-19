import { MapService } from './engine/map-service';
import type { Room } from './engine/room';

export class FastTravel {
    private static locations: { name: string; mapId: string; coordinates: { x: number; y: string } }[];

    static save() {
        return this.locations;
    }

    static load(data: ReturnType<(typeof FastTravel)['save']>) {
        this.locations = data;
    }

    static getUnlockedLocations() {
        return this.locations
            .map((location) => ({
                option: location.name,
                room: MapService.getRoom(location.mapId, location.coordinates),
            }))
            .filter((x) => x.room !== null) as { option: string; room: Room }[];
    }

    static unlockLocation(name: string, mapId: string, coordinates: { x: number; y: string }) {
        const existing = this.locations.find(
            (l) => l.mapId === mapId && l.coordinates.x === coordinates.x && l.coordinates.y === coordinates.y
        );
        if (existing) {
            existing.name = name;
        } else {
            this.locations.push({
                coordinates,
                mapId,
                name,
            });
        }
    }

    static isUnlocked(mapId: string, coordinates: { x: number; y: string }) {
        return !!this.locations.find((l) => l.mapId === mapId && l.coordinates.x === coordinates.x && l.coordinates.y === coordinates.y);
    }
}
