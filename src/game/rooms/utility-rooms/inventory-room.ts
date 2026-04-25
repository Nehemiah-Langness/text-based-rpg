import { Inventory, type InventoryKey } from '../../inventory';
import { Player } from '../../player';
import { Room, type RoomLike } from '../../engine/room';
import { resultRoom } from './result-room';
import { Mood } from '../moods/mood';
import { healthToDescription } from '../../utility-functions/health-to-description';
import { staminaToDescription } from '../../utility-functions/stamina-to-description';
import { oxfordComma } from '../../utility-functions/oxford-comma';
import { modifierToPastTenseVerb } from '../../utility-functions/modifier-to-past-tense-verb';
import { choiceRoom } from './choice-room';
import type { Store } from '../../engine/store';
import type { InventoryItemMeta } from '../../inventory/types/inventory-item';
import { compare } from '../../../helpers/compare';
import type { Category } from '../../engine/category';
import type { InputOption } from '../../input-option';

export function shopInventoryRoom(
    mainShopScreen: RoomLike,
    text: string,
    store: Store,
    mode: 'buy' | 'sell',
    continueText = 'Done'
): RoomLike {
    const items = () => (mode === 'buy' ? store.getItemsPlayerCanBuy() : store.getItemsPlayerCanSell());

    return choiceRoom(
        () => {
            const currency = Inventory.get('coralShard');
            return `${text}\n\nYou currently have ${currency.count} coral shards.`;
        },
        () => {
            return [
                ...items()
                    .sort(compare((x) => x.price))
                    .map(({ item, price, itemKey }) => {
                        return {
                            text: `View ${item.name} ${mode === 'sell' ? `x${item.count} ` : ''}(${price} coral shards each) `,
                            code: itemKey,
                        };
                    }),
                {
                    code: 'back',
                    text: continueText,
                },
            ];
        },
        (code, itemListRoom) => {
            if (code === 'back') {
                return mainShopScreen;
            } else {
                const selectedItem = items().find((item) => item.itemKey === code);
                if (selectedItem) {
                    return choiceRoom(
                        () => {
                            const selectedItem = items().find((item) => item.itemKey === code);
                            if (!selectedItem) return `This item is longer available to ${mode}.`;
                            return (
                                getItemDescription(selectedItem.item) +
                                `\n\n${mode === 'buy' ? 'Costs ' : 'Sells for '}${selectedItem.price} coral shards.${mode === 'sell' ? `\n\nYou have ${selectedItem.item.count}.` : ''}`
                            );
                        },
                        () => {
                            const selectedItem = items().find((item) => item.itemKey === code);
                            const canBuy = selectedItem && Inventory.items.coralShard.count >= selectedItem.price;
                            const canSell = selectedItem && selectedItem.item.count > 0;
                            return [
                                (mode === 'buy' && canBuy) || (mode === 'sell' && canSell)
                                    ? {
                                          code: 'transaction',
                                          text: mode === 'buy' ? 'Buy' : `Sell${selectedItem.item.equipped ? ` (EQUIPPED)` : ''}`,
                                      }
                                    : null,
                                mode === 'sell' && canSell && selectedItem.item.count > 1
                                    ? {
                                          code: 'sell-all',
                                          text: `Sell All${selectedItem.item.equipped ? ` (EQUIPPED)` : ''}`,
                                      }
                                    : null,
                                {
                                    code: 'back',
                                    text: 'Back',
                                },
                            ];
                        },
                        (transactionCode, transactionRoom) => {
                            if (transactionCode === 'back') {
                                return shopInventoryRoom(mainShopScreen, text, store, mode, continueText);
                            } else if (transactionCode === 'transaction') {
                                if (mode === 'buy') {
                                    if (Inventory.items.coralShard.count >= selectedItem.price) {
                                        const onAdd = Inventory.add(selectedItem.itemKey as InventoryKey, 1, Player);
                                        Inventory.add('coralShard', -selectedItem.price, Player);
                                        const itemCheck = items().find((item) => item.itemKey === code);

                                        return resultRoom(
                                            itemCheck ? transactionRoom : itemListRoom,
                                            [
                                                `You buy the ${selectedItem.item.name} for ${selectedItem.price} coral shards.`,
                                                ...(onAdd ?? []),
                                            ],
                                            undefined,
                                            Mood.menu
                                        );
                                    }
                                } else {
                                    const toSell = Inventory.get(selectedItem.itemKey as InventoryKey);
                                    if (toSell.count > 0) {
                                        const onRemove = Inventory.add(selectedItem.itemKey as InventoryKey, -1, Player);
                                        Inventory.add('coralShard', selectedItem.price, Player);
                                        const itemCheck = items().find((item) => item.itemKey === code);

                                        return resultRoom(
                                            itemCheck ? transactionRoom : itemListRoom,
                                            [
                                                `You sell the ${selectedItem.item.name} for ${selectedItem.price} coral shards.`,
                                                ...(onRemove ?? []),
                                            ],
                                            undefined,
                                            Mood.menu
                                        );
                                    }
                                }
                            } else if (transactionCode === 'sell-all') {
                                const toSell = Inventory.get(selectedItem.itemKey as InventoryKey);
                                const count = toSell.count;
                                if (count > 0) {
                                    const onRemove = Inventory.add(selectedItem.itemKey as InventoryKey, -count, Player);
                                    Inventory.add('coralShard', selectedItem.price * count, Player);
                                    const itemCheck = items().find((item) => item.itemKey === code);

                                    return resultRoom(
                                        itemCheck ? transactionRoom : itemListRoom,
                                        [
                                            `You sell ${count} ${selectedItem.item.name}${count === 1 ? '' : (selectedItem.item.pluralSuffix ?? 's')} for ${selectedItem.price * count} coral shards.`,
                                            ...(onRemove ?? []),
                                        ].filter((x) => x !== null),
                                        undefined,
                                        Mood.menu
                                    );
                                }
                            }

                            return transactionRoom;
                        }
                    ).withColor(Mood.menu);
                }
            }

            return itemListRoom;
        }
    ).withColor(Mood.menu);
}

export function inventoryRoom(
    onSelect: (selectedItem: InventoryKey | 'back', currentRoom: RoomLike) => RoomLike,
    continueText = 'Continue',
    action = 'Examine',
    filter?: (item: InventoryKey) => boolean
) {
    const getItems = () => Inventory.list((x) => x.count > 0).filter((item) => filter?.(item.key) ?? true);
    const filtering = {
        category: [] as Category<typeof Inventory.items>[],
    };

    return new Room(
        null,
        () => {
            if (filtering.category.length) {
                return getItems().filter((x) => filtering.category.includes(x.item.category)).length
                    ? `You rummage through your pouch and find the following items:`
                    : filter
                      ? 'Nothing in your pouch is useful at this time.'
                      : "You don't have any items of that type.";
            } else {
                return getItems().length
                    ? `You rummage through your pouch and find the following items:`
                    : filter
                      ? 'Nothing in your pouch is useful at this time.'
                      : 'Your pouch is empty.';
            }
        },
        (rm) => {
            const options: InputOption[] = [];

            const items = getItems();

            if (filtering.category.length) {
                options.push(
                    ...getItems()
                        .filter((x) => filtering.category.includes(x.item.category))
                        .map(({ key, item }) => {
                            return {
                                text: `${action} ${item.name}${item.equipped ? ' (Equipped)' : ''} ${item.count > 1 ? `(x${item.count})` : ''}`,
                                code: key,
                            };
                        })
                );
            } else {
                const allOptions = [
                    {
                        code: 'currency',
                        text: `Currency`,
                        count: items.filter(({ item }) => item.category === 'currency').reduce((c, n) => c + n.item.count, 0),
                    },
                    {
                        code: 'trinket',
                        text: `Trinkets`,
                        count: items.filter(({ item }) => item.category === 'trinket').reduce((c, n) => c + n.item.count, 0),
                    },
                    {
                        code: 'armor',
                        text: `Armor`,
                        count: items
                            .filter(
                                ({ item }) =>
                                    item.category === 'armor' || item.category === 'enchanted-armor' || item.category === 'ointment'
                            )
                            .reduce((c, n) => c + n.item.count, 0),
                    },
                    {
                        code: 'enchantment',
                        text: `Enchantments`,
                        count: items.filter(({ item }) => item.category === 'enchantment').reduce((c, n) => c + n.item.count, 0),
                    },
                    {
                        code: 'food',
                        text: `Food`,
                        count: items
                            .filter(({ item }) => item.category === 'food' || item.category === 'food-fine' || item.category === 'potion')
                            .reduce((c, n) => c + n.item.count, 0),
                    },
                ];

                options.push(
                    ...allOptions
                        .filter((x) => x.count > 0)
                        .map((x) => ({
                            code: x.code,
                            text: `${x.text} (${x.count})`,
                        }))
                );
            }

            options.push({
                code: 'back',
                text: filtering.category.length ? 'Back' : continueText,
            });

            return {
                options,
                select: (code) => {
                    if (filtering.category.length) {
                        if (code === 'back') {
                            filtering.category = [];
                            return rm;
                        }
                        return onSelect(code as InventoryKey | 'back', rm);
                    } else {
                        if (code === 'back') {
                            return onSelect('back', rm);
                        } else if (code === 'currency') {
                            filtering.category = ['currency'];
                        } else if (code === 'trinket') {
                            filtering.category = ['trinket'];
                        } else if (code === 'armor') {
                            filtering.category = ['armor', 'enchanted-armor', 'ointment'];
                        } else if (code === 'enchantment') {
                            filtering.category = ['enchantment'];
                        } else if (code === 'food') {
                            filtering.category = ['food', 'food-fine', 'potion'];
                        }
                        return rm;
                    }
                },
            };
        }
    ).withColor(Mood.menu);
}

function getItemDescription(item: InventoryItemMeta) {
    return [
        `${item.name}\n${item.description}`,
        item.category === 'armor' ? `Armor for your ${item.equippable?.subCategory ?? 'body'}.` : null,
        item.equippable?.requirement
            ? `Requires ${item.equippable.requirement.type === 'has' ? 'you have at least one' : 'equipped'} ${item.equippable.requirement.subCategory ? `${item.equippable.requirement.subCategory}` : ''} ${item.equippable.requirement.category}.`
            : null,
        item.equippable?.defense ? `Adds ${item.equippable.defense} defense when equipped.` : null,
        item.equippable?.health ? `Adds ${item.equippable.health} max health when equipped.` : null,
        item.equippable?.speed ? `Adds ${item.equippable.speed} speed when equipped.` : null,
        item.equippable?.stamina ? `Adds ${item.equippable.stamina} stamina when equipped.` : null,
        item.equippable?.strength ? `Adds ${item.equippable.strength} strength when equipped.` : null,
        item.consumable?.health
            ? `Heals ${item.consumable.health} health point${item.consumable.health === 1 ? '' : 's'} when consumed.`
            : null,
        item.consumable?.stamina
            ? `Energizes ${item.consumable.stamina} stamina point${item.consumable.stamina === 1 ? '' : 's'} when consumed.`
            : null,
        item.consumable?.effects
            ? `Makes you ${oxfordComma(...item.consumable.effects.map((effect) => `${modifierToPastTenseVerb(effect.effect)} (${effect.duration} turn${effect.duration === 1 ? '' : 's'})`))} when consumed.`
            : null,
    ]
        .filter((x) => x)
        .join('\n\n');
}

export function openInventoryRoom(backTo: RoomLike, itemLimit: number | null = null): Room {
    return inventoryRoom((code, rm) => {
        if (code === 'back') {
            return backTo;
        }

        const nextScreen = () => (itemLimit === 1 ? backTo : openInventoryRoom(backTo, itemLimit === null ? null : itemLimit - 1));

        const selectedItem = Inventory.get(code);

        const equip = (code: InventoryKey) => {
            let success = true;
            const item = Inventory.get(code);
            if (item.equipped) {
                success = !Inventory.unEquip(code, Player).equipped;
            } else {
                success = Inventory.equip(code, Player).equipped;
            }

            if (success) {
                return resultRoom(nextScreen, `You ${item.equipped ? 'equip' : 'unequip'} your ${item.name}`, undefined, Mood.menu);
            }
            return resultRoom(
                nextScreen,
                `You are unable to ${!item.equipped ? 'equip' : 'unequip'} your ${item.name}`,
                undefined,
                Mood.menu
            );
        };

        return choiceRoom(
            getItemDescription(selectedItem),
            [
                selectedItem.equippable
                    ? {
                          code: 'equip',
                          text: selectedItem.equipped ? 'Unequip' : 'Equip',
                      }
                    : null,
                selectedItem.consumable
                    ? {
                          code: 'consume',
                          text: 'Consume',
                      }
                    : null,
                {
                    code: 'back',
                    text: 'Back',
                },
            ].filter((x) => x !== null),
            (action) => {
                if (action === 'back') {
                    return rm;
                } else if (action === 'equip') {
                    const success = equip(code);
                    if (success) return success;
                } else if (action === 'consume') {
                    const { effects, energized, healed, text } = Inventory.consume(code, Player);

                    return resultRoom(
                        nextScreen,
                        [
                            text ?? `You consume your ${selectedItem.name}.`,
                            healed
                                ? `You gain ${Math.round(healed)} health points.  You are ${healthToDescription(
                                      Player.health.current / Player.health.max
                                  )}.`
                                : null,
                            energized
                                ? `You gain ${Math.round(energized)} stamina points.  You are ${staminaToDescription(
                                      Player.stamina.current / Player.stamina.max
                                  )}.`
                                : null,
                            effects?.length ? `You are ${oxfordComma(...effects.map((e) => modifierToPastTenseVerb(e.effect)))}.` : null,
                        ].filter((x) => x !== null),
                        undefined,
                        Mood.menu
                    );
                }
                return resultRoom(rm, `You cannot use your ${selectedItem.name} right now.`, undefined, Mood.menu);
            }
        ).withColor(Mood.menu);
    }, 'Close pouch');
}
