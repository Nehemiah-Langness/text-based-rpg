import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Names } from '../../npcs/npc-names';
import { Thalor } from '../../npcs/thalor';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { tutorialCombatRoom } from '../story/tutorial-combat-room';
import { MermaidCityMap } from './map';

export const GuardHall = new Room(
    {},
    () => 'You are at Guard Hall',
    (rm) => {
        const options: InputOption[] = [];

        if (rm.getNpcsInRoom().find((npc) => npc.id === Thalor.id)) {
            options.push({
                code: 'train',
                text: `Train with ${Thalor.getName(rm)[Names.FirstName]}`,
            });
        }

        return {
            options,
            select: (code) => {
                if (code === 'train') {
                    console.log(Quests)
                    if (Quests.getStage('mainQuest') === 'train-tail-kick') {
                        return tutorialCombatRoom()
                    }
                    return rm;
                }
                return rm;
            },
        };
    },
    () => [{
        code: 'travel-south',
        text: 'Go south to the mermaid plaza'
    }]
)
    .atLocation(MermaidCityMap, 'C', 3)
    .withName(RoomNames.mermaidCity.guardHall)
    .withInventoryAccess();
