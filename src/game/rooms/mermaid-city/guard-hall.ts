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
    () => VisitedDescription,
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
                    console.log(Quests);
                    if (Quests.getStage('mainQuest') === 'train-tail-kick') {
                        return tutorialCombatRoom();
                    }
                    return rm;
                }
                return rm;
            },
        };
    },
    () => [
        {
            code: 'travel-south',
            text: 'Leave the Guard Hall',
        },
    ]
)
    .atLocation(MermaidCityMap, 'C', 3)
    .withName(RoomNames.mermaidCity.guardHall)
    .withInventoryAccess();

const VisitedDescription = `You drift in the large arena in the center of the guard hall.

Tall, columned pillars rise around you toward a domed ceiling, each one wrapped in sculpted currents and figures of mermaid warriors locked in eternal battle.

An arched passage way leads to the main plaza.`;
