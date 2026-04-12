import { Quests } from './quests';
import { MapList } from './rooms/map-list';
import { MapNames, RoomNames } from './rooms/names';

export const Compass = {
    destination: null as string | null,
    getDestination: () => {
        const mainQuest = Quests.getStage('mainQuest');
        if (mainQuest === 'follow-compass') {
            return MapList.find((map) => map.id === MapNames.openOcean)?.find(RoomNames.openOcean.shipwreck) ?? null;
        } else if (Compass.destination) {
            return MapList.map((map) => map.find(RoomNames.openOcean.shipwreck))[0] ?? null;
        }
        return null;
    },
};
