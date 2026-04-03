import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const FredsFish = new Room(
    {},
    () => [...VisitedDescription],
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
                text: 'Go south to the shops',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'C', 2)
    .withName(RoomNames.mermaidCity.freds)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The door parts as you slip inside and the familiar hum of the diner wraps around you like a second current.

Fred's Fish Fry sits carved into the same smooth, pale stone as the rest of the city, its arched ceilings and curved walls unmistakably Atlantean - but everything else feels... different. Less refined. More lived-in.

Rows of polished shell booths line the walls, their surfaces scratched and worn from years of use. A long counter curves along the far side of the room, backed by shelves of mismatched cookware - iron pans, chipped coral plates, and hanging nets filled with today's catch. Soft blue lanterns drift overhead, but here they flicker a little more unevenly, casting a warmer, almost cozy glow.`,
    `The air carries a rich, savory scent - fried fish, spiced kelp, and something smoky that clings to the back of your senses.

A few regulars lounge in their usual spots, speaking in low voices or simply watching the room. Someone taps a rhythm against a glass. Another nods as you enter.

Behind the counter, Fred barely looks up.

"You're late," he mutters, though you're not.

Your apron is already hanging where you left it.`,
];

const VisitedDescription = [
    `You are inside Fred's Fish Fry.`,
    `The rows of polished shell booths surround you, and several regulars greet you with a nod as you make eye-contact.`,
    `Just outside the diner to the south lies the shopping district.`,
];
