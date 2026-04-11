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

export function shopInventoryRoom(
    inventory: { item: InventoryKey; gold: number; description?: string }[],
    onSelect: (selectedItem: InventoryKey | 'back', currentRoom: RoomLike) => RoomLike,
    continueText = 'Continue'
) {
    return new Room(
        null,
        () => {
            const currency = Inventory.get('coralShard');
            return inventory.length
                ? `You browse the shop and find the following wares available.  You have ${currency.count} ${currency.name}${currency.pluralSuffix ?? 's'} in your pouch.`
                : 'The shop is empty';
        },
        (rm) => {
            return {
                options: [
                    ...inventory.map((item) => {
                        return {
                            text: `Buy ${item.description ?? item.item} for ${item.gold}g`,
                            code: item.item,
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
    );
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
                item.equipped = false;
            } else {
                success = Inventory.equip(code).equipped;
            }

            if (success) {
                return resultRoom(nextScreen, `You ${item.equipped ? 'equip' : 'unequip'} your ${code}`, undefined, Mood.menu);
            }
            return null;
        };

        return choiceRoom(
            [
                `${selectedItem.name}\n${selectedItem.description}`,
                selectedItem.equippable?.defense ? `Adds ${selectedItem.equippable.defense} defense when equipped.` : null,
                selectedItem.consumable?.health
                    ? `Heals ${selectedItem.consumable.health} health point${selectedItem.consumable.health === 1 ? '' : 's'} when consumed.`
                    : null,
                selectedItem.consumable?.stamina
                    ? `Energizes ${selectedItem.consumable.stamina} stamina point${selectedItem.consumable.stamina === 1 ? '' : 's'} when consumed.`
                    : null,
                selectedItem.consumable?.effects
                    ? `Makes you ${oxfordComma(...selectedItem.consumable.effects.map((effect) => `${modifierToPastTenseVerb(effect.effect)} (${effect.duration} turn${effect.duration === 1 ? '' : 's'})`))} when consumed.`
                    : null,
            ]
                .filter((x) => x)
                .join('\n\n'),
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
