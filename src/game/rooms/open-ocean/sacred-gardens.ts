import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { OpenOceanMap } from './map';

export const SacredGarden = new Room(
    {},
    () => [VisitedDescription],
    (rm) => {
        const options: InputOption[] = [];

        return {
            options,
            select: () => {
                return rm;
            },
        };
    },
    () => {
        return [
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

const VisitedDescription = `The ocean is quiet around you as you rest in the Sacred Gardens.

To the west, the silhouette of an old shipwreck looms faintly, its broken frame a distant contrast to the harmony here.

To the south, the light fades into the open wasteland, where the seafloor stretches bare before rising again into the vibrant coral reef beyond.`;
