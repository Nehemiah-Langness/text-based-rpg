import type { InputOption } from '../input-option';
import { Rock } from '../items/rock';
import { Knowledge } from '../knowledge';
import { Names } from '../npcs/npc-names';
import { WizardNpc } from '../npcs/wizard-npc';
import { Room } from '../engine/room';
import { wizardShop } from './shops/wizard-shop';

const RoomDescription = (
    rm: Room
) => `The air inside ${Knowledge.wizardName ? WizardNpc.getName(rm)[Names.FullName] : 'the wizard'}'s home hums faintly with arcane energy, mingled with the scent of ink, metal, and burnt herbs. Shelves crowd every wall, stacked not just with spellbooks but with strange mechanical trinkets - ticking spheres, rotating rings, and half-assembled constructs that twitch when you pass. 

A central workbench dominates the room, cluttered with glowing crystals, brass instruments, and parchment covered in impossibly precise diagrams. Every so often, a device clicks or whirs to life on its own, as if the shop itself is quietly thinking.

${Knowledge.wizardName ? WizardNpc.getName(rm)[Names.FirstName] : 'A wizard'} stands at the workbench working on some sort of device that you can't tell what it does.`;

export const WizardHouse = new Room(
    null,
    (rm) => {
        return [RoomDescription(rm)];
    },
    (rm) => {
        const options: InputOption[] = [
            {
                code: 'talk-wizard',
                text: 'Talk to ' + (Knowledge.wizardName ? WizardNpc.getName(rm)[Names.FirstName] : 'the wizard'),
            },
            {
                code: 'shop',
                text: `Look at ${Knowledge.wizardName ? WizardNpc.getName(rm)[Names.FirstName] : 'the wizard'}'s merchandise`,
            },
        ];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        }
        options.push({
            text: 'Leave the shop',
            code: 'travel-west',
        });

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Rock.investigationLanguage);
            } else if (choice === 'talk-wizard') {
                return WizardNpc.getConversation(rm);
            } else if (choice === 'shop') {
                return wizardShop(rm);
            }
            const traveled = rm.travel(choice);
            if (traveled) return traveled;

            return rm;
        };

        return {
            options: options,
            select: select,
        };
    }
)
    .withInventoryAccess()
    .atLocation('B', 7);
