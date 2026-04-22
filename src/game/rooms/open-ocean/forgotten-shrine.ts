import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import { FastTravel } from '../../fast-travel';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { fastTravelRoom } from '../utility-rooms/fast-travel-room';
import { OpenOceanMap } from './map';

export const Wastelands = new Room(
    {},
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        if (rm.map && rm.coordinates) {
            if (!FastTravel.isUnlocked(rm.map.id, rm.coordinates)) {
                options.push({
                    code: 'fast-travel-unlock',
                    text: 'Examine the statue',
                });
            } else if (FastTravel.isAvailable()) {
                options.push({
                    code: 'fast-travel',
                    text: 'Touch the statue',
                });
            }
        }

        return {
            options,
            select: (code) => {
                if (code === 'fast-travel-unlock') {
                    if (rm.map && rm.coordinates) FastTravel.unlockLocation('The Forgotten Shrine', rm.map.id, rm.coordinates);
                    return resultRoom(rm, [
                        `You reach out and touch the statue in the middle of the shrine. The soft glow increases into a beam that shoots straight up to the surface.\n\nYou can feel a pull from the statue out in several directions.`,
                        `You have unlocked fast travel to and from the Forgotten Shrine.`,
                    ]);
                } else if (code === 'fast-travel') {
                    return fastTravelRoom(rm);
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north into the dark waters',
            },
            {
                code: 'travel-east',
                text: 'Go east to the city outskirts',
            },
            {
                code: 'travel-south',
                text: 'Go south into Stonejaw Brood territory',
            },
            {
                code: 'travel-west',
                text: 'Go west to the sealed cavern',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 3)
    .withName(RoomNames.openOcean.forgottenShrine)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `You drift into the Forgotten Shrine, and the water around you grows still - unnaturally so, as if even the currents refuse to disturb this place. 
    
Ancient stone pillars, worn smooth by time, rise from the seabed in a wide circle.`,
    `At the center stands a weathered statue, its form barely recognizable, yet unmistakably important. 
    
A faint, steady glow seeps from within it, pulsing softly like a distant heartbeat.`,
];

const VisitedDescription = `You drift into the Forgotten Shrine.

To the north, the ocean deepens into dark, foreboding waters.

To the east, the water lightens toward the safer edges of the city outskirts.

To the south, the currents grow tense, leading into Stonejaw Brood territory.

To the west, a sealed cavern rests behind layers of stone and age.`;


