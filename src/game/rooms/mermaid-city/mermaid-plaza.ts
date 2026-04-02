import { Room } from '../../engine/room';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const MermaidPlaza = new Room(
    {},
    () => 'You are at Mermaid Plaza',
    undefined,
    (rm) => {

        let followThalorNorth = false

        if (Quests.getStage('mainQuest') === 'go-to-training') {
            followThalorNorth = true;
        }

        return [
        {
            code: 'travel-north',
            text: followThalorNorth ? `Follow ${Thalor.getName(rm)[Names.FirstName]} north to the guild hall` : 'Go north to the guild hall'
        },
        {
            code: 'travel-east',
            text: 'Go east to your apartment'
        },
        {
            code: 'travel-south',
            text: 'Go south to the city gate'
        },
        {
            code: 'travel-west',
            text: 'Go south to the shops'
        },
    ]
    }
)
    .atLocation(MermaidCityMap, 'D', 3)
    .withName(RoomNames.mermaidCity.mermaidPlaza)
    .withInventoryAccess();
