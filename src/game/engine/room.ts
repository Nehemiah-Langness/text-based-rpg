import { healthToDescription, staminaToDescription } from '../descriptions';
import type { InputOption } from '../input-option';
import { getItemsEquipped } from '../inventory/get-items-equipped';
import { getPlayerDefense } from '../inventory/get-player-defense';
import { isCategory } from '../inventory/is-category';
import { criticalChance, Player } from '../player';
import { getActiveQuests } from '../quests';
import { Map } from './map';
import { choiceRoom } from '../rooms/utility-rooms/choice-room';
import { openInventoryRoom } from '../rooms/utility-rooms/inventory-room';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { isTravelOption, type TravelOption, type TravelOptions } from './travel-options';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Room<T = any> {
    name: string | undefined;
    changeIndicator = 0;
    inventoryAccess = false;
    coordinates: { y: string; x: number } | undefined;
    map: Map | undefined;
    roomColor:
        | string
        | {
              primary: string;
              secondary: string;
          }
        | undefined;

    investigated = false;
    visited = false;
    state: T;

    private getTextLogic: (room: Room<T>) => string | (string | null)[];
    private getOptionsLogic: (room: Room<T>) => {
        options: InputOption[];
        select: (code: string) => Room;
    };
    private getTravelOptions: (room: Room<T>) => { text: string; code: (typeof TravelOptions)[number] }[];

    constructor(
        state: T,
        getTextLogic?: (room: Room<T>) => string | (string | null)[],
        getOptionsLogic?: (room: Room<T>) => {
            options: InputOption[];
            select: (code: string) => Room;
        },
        getTravelOptions?: (room: Room<T>) => { text: string; code: (typeof TravelOptions)[number] }[],
        color?:
            | string
            | {
                  primary: string;
                  secondary: string;
              }
    ) {
        this.state = state;
        this.getTextLogic = getTextLogic ?? (() => []);
        this.getOptionsLogic =
            getOptionsLogic ??
            ((rm) => {
                return {
                    options: [],
                    select: () => {
                        return rm;
                    },
                };
            });
        this.getTravelOptions = getTravelOptions ?? (() => []);

        this.roomColor = color;
    }

    save() {
        return {
            investigated: this.investigated,
            visited: this.visited,
            state: this.state,
        };
    }

    load(data: ReturnType<Room['save']> | null) {
        if (data) {
            this.investigated = data.investigated ?? this.investigated;
            this.visited = data.visited ?? this.visited;
            if (this.state) Object.assign(this.state, data.state);
        }
    }

    getText() {
        const text = this.getTextLogic(this);
        if (typeof text === 'string') return text;
        return text.filter((x) => x).join('\n\n');
    }

    getOptions() {
        const roomOptions = this.getOptionsLogic(this);
        return {
            options: roomOptions.options.concat(this.getTravelOptions(this)).concat(
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
                                `You are ${healthToDescription(Player.health / Player.maxHealth)} and ${staminaToDescription(
                                    Player.stamina / Player.maxStamina
                                )}.`,
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

                if (isTravelOption(code)) {
                    const traveled = this.travel(code);
                    if (traveled) return traveled;
                }

                return roomOptions.select(code);
            },
        };
    }

    withInventoryAccess() {
        this.inventoryAccess = true;
        return this;
    }

    atLocation(map: Map, y: string, x: number) {
        this.coordinates = { y: y, x: x };
        this.map = map;
        map.setRoom(y, x, this);
        return this;
    }

    withName(name: string) {
        this.name = name;
        return this;
    }

    investigate(text: string) {
        this.investigated = true;
        return resultRoom(this, text);
    }

    travel(choice: TravelOption) {
        if (this.map) {
            switch (choice) {
                case 'travel-north':
                    return this.map.north(this);
                case 'travel-east':
                    return this.map.east(this);
                case 'travel-south':
                    return this.map.south(this);
                case 'travel-west':
                    return this.map.west(this);
            }
        }

        return null;
    }

    withColor(color: Room['roomColor']) {
        this.roomColor = color;
        return this;
    }
}
