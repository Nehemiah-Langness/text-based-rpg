import type { InputOption } from '../input-option';
import { addToInventory } from '../inventory/add-to-inventory';
import { fullyClothed } from '../inventory/fully-clothed';
import { hasItemInCategory } from '../inventory/has-item-in-category';
import { Inventory } from '../inventory/inventory';
import { PriceTable } from '../inventory/tables/price-table';
import { Nothing } from '../items/nothing';
import { Knowledge } from '../knowledge';
import { CityGuardNpc } from '../npcs/city-guard-npc';
import { Names } from '../npcs/npc-names';
import { Stats } from '../stats';
import { Room } from '../engine/room';
import { resultRoom } from './utility-rooms/result-room';

const IntroDescription = (rm: Room) => {
    if (!fullyClothed()) return CityGuardNpc.getSpecialRemark('playerNeedsClothes', rm);

    return [
        `A broad-shouldered guard steps forward as you approach the village gate, his armor worn but well kept. He offers a firm nod.`,
        ...CityGuardNpc.getSpecialRemark('introduction', rm),
    ];
};

const RoomDescription = (
    intro: boolean,
    rm: Room
) => `You stand before the main gate of a rustic medieval village, its tall wooden palisade walls weathered by years of wind and rain. Smoke rises lazily from chimneys beyond the walls, and faint voices drift over the timber barricade. A pair of heavy wooden doors stand partly open, guarded but welcoming enough for travelers - if they have a reason to enter. 

${!intro ? `${CityGuardNpc.getName(rm)[Names.FullName]} patrols by the gate alert for any source of trouble.\n\n` : ''}The road to the south stretches back into the wilderness, while the life of the village waits just beyond the gate north of you.`;

export const MainGate = new Room(
    {
        debt: 0,
    },
    (rm) => {
        if (!rm.visited) {
            return [...IntroDescription(rm), RoomDescription(true, rm)];
        }
        return [...(!fullyClothed() ? CityGuardNpc.getSpecialRemark('playerNeedsClothes', rm) : []), RoomDescription(false, rm)];
    },
    (rm) => {
        const options: InputOption[] = [];

        options.push({
            code: 'talk-guard',
            text: 'Talk to ' + (Knowledge.guardName ? CityGuardNpc.getName(rm)[Names.FirstName] : 'the guard'),
        });

        if (rm.state.debt > 0) {
            options.push({
                code: 'pay-debt',
                text:
                    'Pay ' +
                    (Knowledge.guardName ? CityGuardNpc.getName(rm)[Names.FirstName] : 'the guard') +
                    ' back for giving you spare clothes',
            });
        }

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Look around',
            });
        }

        options.push(
            {
                text: 'Enter the village',
                code: 'travel-north',
            },
            {
                text: 'Go south into the wilderness',
                code: 'travel-south',
            }
        );

        const select = (choice: string) => {
            if (choice === 'investigate') {
                return rm.investigate(Nothing.investigationLanguage);
            } else if (choice === 'talk-guard') {
                if (!fullyClothed()) {
                    if (!hasItemInCategory('legArmor')) {
                        rm.state.debt += PriceTable['Cloth Pants'].buy;
                        return CityGuardNpc.getConversation(
                            addToInventory(
                                'Cloth Pants',
                                rm,
                                `You take the Cloth Pants, worth ${PriceTable['Cloth Pants'].buy} gold coins.`
                            ),
                            'givesPlayerPants'
                        );
                    }
                    if (!hasItemInCategory('chestArmor')) {
                        rm.state.debt += PriceTable['Cloth Shirt'].sell;
                        return CityGuardNpc.getConversation(
                            addToInventory(
                                'Cloth Shirt',
                                rm,
                                `You take the Cloth Shirt, worth ${PriceTable['Cloth Shirt'].buy} gold coins.`
                            ),
                            'givesPlayerShirt'
                        );
                    }
                }

                return CityGuardNpc.getConversation(rm);
            } else if (choice === 'pay-debt') {
                if (!Inventory['Gold Coin'].count) {
                    return resultRoom(
                        rm,
                        `You do not have any gold to pay back ${CityGuardNpc.getName(rm)[Names.FirstName]}.  You owe him ${rm.state.debt} gold.`
                    );
                }

                const debtPaid = Math.min(rm.state.debt, Inventory['Gold Coin'].count);

                rm.state.debt -= debtPaid;
                Inventory['Gold Coin'].count -= debtPaid;
                Stats.goldSpent = (Stats.goldSpent ?? 0) + debtPaid;
                return resultRoom(
                    rm,
                    `You pay ${debtPaid} gold coins to ${CityGuardNpc.getName(rm)[Names.FirstName]}${rm.state.debt > 0 ? `  You still owe him ${rm.state.debt} gold.` : ''}`
                );
            }

            if (choice === 'travel-north' && !fullyClothed()) {
                return CityGuardNpc.getConversation(rm, 'playerNeedsClothes');
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
    .atLocation('C', 5);
