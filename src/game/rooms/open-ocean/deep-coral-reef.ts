import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { startSearchRoom } from '../../search/start-search-room';
import { Mood } from '../moods/mood';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const DeepCoralReef = new Room(
    {},
    () => `You are in the deep coral reef`,
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.getStage('seaCucumber') === 'find-sea-cucumber') {
            options.push({
                code: 'search-cucumber',
                text: 'Search for striped reef cucumber'
            })
        }

        return {
            options,
            select: (code) => {
                if (code === 'search-cucumber') {

                    return startSearchRoom(rm, {
                        gridSize: 5,
                        maxAttempts: 8,
                        playerStart: { x: 2, y: 2 },
                        onComplete: (rm) => resultRoom(() => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber'), `You found a striped reef cucumber.`, undefined, Mood.miniGame),
                        onFailure: (rm) => resultRoom(rm, `You were unable to find the special sea cucumber.`, undefined, Mood.miniGame)
                    })
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-west',
                text: 'Go west to the coral reef',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 6)
    .withName(RoomNames.openOcean.deepCoralReef)
    .withInventoryAccess();
