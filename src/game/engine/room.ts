import { healthToDescription, staminaToDescription } from '../descriptions';
import type { InputOption } from '../input-option';
import { getItemsEquipped } from '../inventory/get-items-equipped';
import { getPlayerDefense } from '../inventory/get-player-defense';
import { isCategory } from '../inventory/is-category';
import { criticalChance, Player } from '../player';
import { getActiveQuests } from '../quests';
import { east, Map, north, south, west } from './map';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { openInventoryRoom } from '../rooms/utility-rooms/inventory-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Room<T = any> {
    investigated = false;
    visited = false;
    changeIndicator = 0;
    inventoryAccess = false;

    coordinates: { y: string; x: number } | undefined;

    state: T;
    private getTextLogic: (room: Room<T>) => string | (string | null)[];
    private getOptionsLogic: (room: Room<T>) => {
        options: InputOption[];
        select: (code: string) => Room;
    };

    constructor(
        state: T,
        getTextLogic: (room: Room<T>) => string | (string | null)[],
        getOptionsLogic: (room: Room<T>) => {
            options: InputOption[];
            select: (code: string) => Room;
        }
    ) {
        this.state = state;
        this.getTextLogic = getTextLogic;
        this.getOptionsLogic = getOptionsLogic;
    }

    getText() {
        const text = this.getTextLogic(this);
        if (typeof text === 'string') return text;
        return text.filter((x) => x).join('\n\n');
    }

    getOptions() {
        const roomOptions = this.getOptionsLogic(this);
        return {
            options: roomOptions.options.concat(
                this.inventoryAccess
                    ? [
                          {
                              code: 'inventory-def',
                              text: 'Look in your pack',
                          },
                          {
                              code: 'health-def',
                              text: 'Check your physical well-being',
                          },
                          {
                              code: 'quests-def',
                              text: 'Review your current quests',
                          },
                      ]
                    : []
            ),
            select: (code: string) => {
                this.visited = true;
                this.changeIndicator += 1;

                if (this.inventoryAccess) {
                    if (code === 'inventory-def') {
                        return openInventoryRoom(this);
                    } else if (code === 'health-def') {
                        const defense = getPlayerDefense();
                        const farmingBonus = getItemsEquipped().filter((x) => isCategory('farmingBonus', x)).length;
                        const criticalPoints = criticalChance() - 5;
                        return resultRoom(
                            this,
                            [
                                `You are ${healthToDescription(Player.health / Player.maxHealth)} and ${staminaToDescription(Player.stamina / Player.maxStamina)}.`,
                                defense ? ` You have a defense of ${defense}.` : null,
                                criticalPoints > 0 ? `You have +${criticalPoints} luck points.` : null,
                                farmingBonus ? `You have a farming bonus of +${farmingBonus}.` : null,
                            ].filter((x) => x !== null && typeof x !== 'undefined')
                        );
                    } else if (code === 'quests-def') {
                        const currentQuests = getActiveQuests();
                        if (!currentQuests.length)
                            return resultRoom(
                                this,
                                "You have not been given any quests yet.  Perhaps if you talk to people, they'll have some quests for you."
                            );

                        return choiceRoom(
                            `You have been given the following quests:`,
                            currentQuests
                                .map((quest) => ({
                                    code: quest.name,
                                    text: `${quest.name}${quest.completed ? ' (COMPLETED)' : ''}`,
                                }))
                                .concat({
                                    code: 'done',
                                    text: 'Done',
                                }),
                            (choice, rm) => {
                                if (choice === 'done') {
                                    return this;
                                }

                                const quest = currentQuests.find((q) => q.name === choice);
                                if (!quest) {
                                    return resultRoom(this, `You have not been given the quest "${choice}" yet.`);
                                }

                                return resultRoom(
                                    rm,
                                    `${quest.name}${quest.completed ? ' (COMPLETED)' : ''}\n\n${quest.stages
                                        .filter((_stage, index) => index <= quest.progress)
                                        .map(
                                            (stage, stageIndex) =>
                                                `${stageIndex + 1}. ${stage} ${stageIndex < quest.progress ? '(COMPLETED)' : ''}`
                                        )
                                        .join('\n')}`
                                );
                            }
                        );
                    }
                }
                return roomOptions.select(code);
            },
        };
    }

    withInventoryAccess() {
        this.inventoryAccess = true;
        return this;
    }

    atLocation(y: string, x: number) {
        this.coordinates = { y: y, x: x };
        Map[y][x] = this;
        return this;
    }

    investigate(text: string) {
        this.investigated = true;
        return resultRoom(this, text);
    }

    travel(choice: string) {
        if (choice === 'travel-north') {
            return north(this);
        } else if (choice === 'travel-east') {
            return east(this);
        } else if (choice === 'travel-south') {
            return south(this);
        } else if (choice === 'travel-west') {
            return west(this);
        }
        return null;
    }
}
