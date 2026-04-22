import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import { FastTravel } from '../../fast-travel';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { fastTravelRoom } from '../utility-rooms/fast-travel-room';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const SacredGarden = new Room(
    {},
    (rm) => VisitedDescription(rm),
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
                    if (rm.map && rm.coordinates) FastTravel.unlockLocation('The Sacred Garden', rm.map.id, rm.coordinates);
                    return resultRoom(rm, [
                        `You reach out and touch the statue. The soft glow flowing along the details of the ocean flora intensifies as you feel a pull from the statue out in several directions.`,
                        `You have unlocked fast travel to and from the The Sacred Garden.`,
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
                text: 'Go north into shark territory',
            },
            {
                code: 'travel-south',
                text: 'Go south through the wastelands to the coral reef',
            },
            {
                code: 'travel-west',
                text: 'Go west to the old shipwreck',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'B', 5)
    .withName(RoomNames.openOcean.sacredGarden)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The water softens as you enter the Sacred Gardens, as if the ocean itself has chosen to grow quiet here.

Gentle light pours down in steady, golden shafts, illuminating wide terraces of living coral arranged in natural harmony rather than wild growth. Pale stone pathways wind between them, smoothed by time and careful tending. Soft, bioluminescent flora bloom in clusters - petal-like fronds that glow in calming hues of blue, gold, and soft violet, swaying in slow, rhythmic motion.`,
    `The currents are lighter here, almost guided, carrying the faint scent of something clean and ancient. Small, delicate creatures drift peacefully through the water, unafraid, untouched by the harsher currents beyond.

There is a stillness to the Gardens - not empty, but protected.

Reverent.`,
    `Here, the ocean does not feel wild.

It feels watched over.`,
];

const VisitedDescription = (rm: Room) => `The ocean is quiet around you as you rest in the Sacred Gardens.

${rm.map && rm.coordinates && !FastTravel.isUnlocked(rm.map.id, rm.coordinates) ? `At the center of the garden, there is a faintly glowing statue depicting ocean flora.\n\n` : ''}To the north, you see the rough shapes of swimming sharks against the backdrop of the ocean.

To the west, the silhouette of an old shipwreck looms faintly, its broken frame a distant contrast to the harmony here.

To the south, the light fades into the open wasteland, where the seafloor stretches bare before rising again into the vibrant coral reef beyond.`;
