import { Quests } from './quests';
import { MapList } from './rooms/map-list';
import { MapNames, RoomNames } from './rooms/names';

export const Compass = {
    destination: null as string | null,
    getDestination: () => {
        const mainQuest = Quests.getStage('mainQuest');
        if (
            (
                [
                    'follow-compass-to-crown',
                    'find-crown-piece-1',
                    'find-crown-piece-2',
                    'find-crown-piece-3',
                    'fight-for-crown',
                ] as (typeof mainQuest)[]
            ).includes(mainQuest)
        ) {
            return MapList.find((map) => map.id === MapNames.openOcean)?.find(RoomNames.openOcean.massWreckage) ?? null;
        } else if ((['find-jewel-1'] as (typeof mainQuest)[]).includes(mainQuest)) {
            return MapList.find((map) => map.id === MapNames.openOcean)?.find(RoomNames.openOcean.darkWaters) ?? null;
        } else if (Compass.destination) {
            return MapList.map((map) => map.find(Compass.destination ?? ''))[0] ?? null;
        }
        return null;
    },
};
