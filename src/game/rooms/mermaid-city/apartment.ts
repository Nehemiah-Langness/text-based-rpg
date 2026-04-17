import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import { fullRest } from '../../full-rest';
import type { InputOption } from '../../input-option';
import { RoomNames } from '../names';
import { MermaidCityMap } from './map';

export const Apartment = new Room(
    {},
    () =>
        `You drift lazily inside your apartment - admiring the view of the plaza outside your open window.

Your roommate, Nerissa, is nearby, as usual - focused on mixing something in a shallow coral bowl, completely absorbed in her work.

She glances up as you enter and smiles.`,
    (rm) => {
        const options: InputOption[] = [];

        options.push({
            code: 'sleep',
            text: 'Sleep (Save progress)',
        });

        return {
            options,
            select: (code) => {
                if (code === 'sleep') {
                    return fullRest(rm);
                }

                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-west',
                text: 'Leave your apartment',
            },
        ];
    }
)
    .atLocation(MermaidCityMap, 'D', 4)
    .withName(RoomNames.mermaidCity.apartment)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `Your apartment is small, but it's yours.

Tucked just off the eastern edge of the plaza, the space is carved directly into the pale stone of the city wall, its curved architecture giving everything a soft, rounded feel.`,
    `A wide, open window - framed with drifting strands of sea silk - looks out over the plaza below. 

From here, you can see the gentle flow of mermaids passing through, the distant glow of the shopping district... and just across the way, the familiar, flickering sign of Fred's Fish Fry, where you've spent more hours working than you'd like to admit.`,
    `Inside, the space is modest. A simple sleeping alcove lined with woven kelp fibers. A low stone table scattered with small personal items. A rack for your belongings, mostly practical, nothing extravagant.

The only real splash of color comes from your roommate's side of the room.

Glass vials, polished shells, and bundles of dried sea plants are carefully arranged along a carved shelf. Faint scents drift through the water - something clean, something floral, something oddly refreshing. 

Small handwritten tags hang from many of them, labeled in neat script.`,
];
