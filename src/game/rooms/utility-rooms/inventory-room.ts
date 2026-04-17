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

export function shopInventoryRoom(backTo: RoomLike, text: string, store: Store, mode: 'buy' | 'sell', continueText = 'Done'): RoomLike {
    const currency = Inventory.get('coralShard');

    const items = () => (mode === 'buy' ? store.getItemsToSell() : store.getItemsToBuy());

    return choiceRoom(
        `${text}\n\nYou currently have ${currency.count} coral shards.`,
        [
            ...items().map(({ item, price, itemKey }) => {
                return {
                    text: `View ${item.name} (${price} coral shards)`,
                    code: itemKey,
                };
            }),
            {
                code: 'back',
                text: continueText,
            },
        ],
        (code, rm) => {
            if (code === 'back') {
                return backTo;
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
                            return [
                                selectedItem &&
                                ((mode === 'buy' && Inventory.items.coralShard.count >= selectedItem.price) || selectedItem.item.count > 0)
                                    ? {
                                          code: 'transaction',
                                          text: mode === 'buy' ? 'Buy' : 'Sell',
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
                                return shopInventoryRoom(backTo, text, store, mode, continueText);
                            } else if (transactionCode === 'transaction') {
                                if (mode === 'buy') {
                                    if (Inventory.items.coralShard.count >= selectedItem.price) {
                                        Inventory.add(selectedItem.itemKey as InventoryKey, 1);
                                        Inventory.add('coralShard', -selectedItem.price);
                                        return resultRoom(transactionRoom, `You buy the ${selectedItem.item.name}.`, undefined, Mood.menu);
                                    }
                                } else {
                                    const toSell = Inventory.get(selectedItem.itemKey as InventoryKey);
                                    if (toSell.count > 0) {
                                        Inventory.add(selectedItem.itemKey as InventoryKey, -1);
                                        Inventory.add('coralShard', selectedItem.price);
                                        return resultRoom(transactionRoom, `You sell the ${selectedItem.item.name}.`, undefined, Mood.menu);
                                    }
                                }
                            }

                            return transactionRoom;
                        }
                    ).withColor(Mood.menu);
                }
            }

            return rm;
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

    return new Room(
        null,
        () => {
            return getItems().length
                ? `You rummage through your pouch and find the following items:`
                : filter
                  ? 'Nothing in your pouch is useful at this time.'
                  : 'Your pouch is empty.';
        },
        (rm) => {
            return {
                options: [
                    ...getItems().map(({ key, item }) => {
                        return {
                            text: `${action} ${item.name}${item.equipped ? ' (Equipped)' : ''} ${item.count > 1 ? `(x${item.count})` : ''}`,
                            code: key,
                        };
                    }),
                    {
                        code: 'back',
                        text: continueText,
                    },
                ],
                select: (code) => onSelect(code as InventoryKey | 'back', rm),
            };
        }
    ).withColor(Mood.menu);
}

function getItemDescription(item: InventoryItemMeta) {
    return [
        `${item.name}\n${item.description}`,
        item.category === 'armor' ? `Armor for your ${item.equippable?.subCategory ?? 'body'}.` : null,
        item.equippable?.requirement
            ? `Requires ${item.equippable.requirement.type === 'has' ? 'you have atleast one' : 'equipped'} ${item.equippable.requirement.subCategory ? `${item.equippable.requirement.subCategory}` : ''} ${item.equippable.requirement.category}.`
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
