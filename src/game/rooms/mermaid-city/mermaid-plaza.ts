import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import { FastTravel } from '../../fast-travel';
import type { InputOption } from '../../input-option';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { Scene1 } from '../story/scene-1-follow-thalor';
import { fastTravelRoom } from '../utility-rooms/fast-travel-room';
import { resultRoom } from '../utility-rooms/result-room';
import { MermaidCityMap } from './map';

export const MermaidPlaza = new Room(
    {},
    (rm) => VisitedDescription(rm),
    (rm) => {
        const options: InputOption[] = [];

        if (Quests.getStage('mainQuest') === 'go-to-training') {
            options.push({
                code: 'go-to-training',
                text: `Follow ${Thalor.getName(rm)[Names.FirstName]} north to the guild hall`,
            });
        }

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
                if (code === 'go-to-training') {
                    return resultRoom(Scene1, Quests.progress('mainQuest', 'go-to-training'));
                } else if (code === 'fast-travel-unlock') {
                    if (rm.map && rm.coordinates) FastTravel.unlockLocation('The Mermaid City Plaza', rm.map.id, rm.coordinates);
                    return resultRoom(rm, [
                        `You reach out and touch the mermaid. The soft glow from the tail scales intensifies as you feel a pull from the statue out in several directions.`,
                        `You have unlocked fast travel to and from the Mermaid City Plaza.`,
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
            Quests.getStage('mainQuest') === 'go-to-training'
                ? null
                : {
                      code: 'travel-north',
                      text: 'Go north to the guild hall',
                  },
            {
                code: 'travel-east',
                text: 'Go east to your apartment',
            },
            {
                code: 'travel-south',
                text: 'Go south to the city gate',
            },
            {
                code: 'travel-west',
                text: 'Go west to the shops',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'D', 3)
    .withName(RoomNames.mermaidCity.mermaidPlaza)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The city rises around you in elegant tiers - arched balconies, spiraling towers, and sweeping bridges all carved in the flowing style of ancient Atlantean design. 
    
Veins of pearl and silver trace through the architecture like currents frozen in place, catching the soft blue glow of bioluminescent coral that blooms along every surface.`,
    `Above, the distant surface filters faint sunlight into wavering ribbons that dance across the plaza floor. 
    
Below, the stone is etched with concentric patterns, like ripples spreading outward from where you stand - as if the city itself recognizes this moment.`,
];

const VisitedDescription = (rm: Room) => `You drift at the center of the mermaid plaza as Mermaids pass along the outer edges.

A statue of regal mermaid sits in the center of the plaza, emitting ${rm.map && rm.coordinates && !FastTravel.isUnlocked(rm.map.id, rm.coordinates) ? 'a soft glow' : 'an intense glow'} from the lines etched around the scales of her tail.

At the northern archway, the path leads back toward the Guard Hall.

To the west, the city stretches into bustling districts of life and trade.

Your small apartment lies to the east.

And to the south... the open ocean waits just pass the city gates.`;
