import { healthToDescription, staminaToDescription } from './descriptions';
import { emptyFromInventory } from './inventory/empty-from-inventory';
import { Inventory } from './inventory/inventory';
import { Categories } from './inventory/lists/categories';
import { Room } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Stats } from './stats';

export const Player = {
    maxHealth: 100,
    health: 100,
    maxStamina: 100,
    stamina: 100,
    criticalChance: 0,
};

export function criticalChance() {
    const playerLuck = (Player.stamina >= 60 ? 2 : 0) + Player.criticalChance + Inventory['Luck Aura'].count;
    if (playerLuck > (Stats.highestLuck ?? 0)) {
        Stats.highestLuck = playerLuck;
    }
    return 5 + playerLuck;
}

export function heal(room: Room | (() => Room), healthRecovery: number) {
    const actualHealthRecovered = Math.min(Player.maxHealth - Player.health, healthRecovery);
    Player.health += actualHealthRecovered;

    Stats.healthRestored = (Stats.healthRestored ?? 0) + actualHealthRecovered;

    return resultRoom(
        room,
        `You gain ${Math.round(actualHealthRecovered)} health points.  You are ${healthToDescription(Player.health / Player.maxHealth)}.`
    );
}

export function energize(room: Room | (() => Room), staminaRecovery: number, criticalChanceBonus: number) {
    const actualStaminaRecovered = Math.min(Player.maxStamina - Player.stamina, staminaRecovery);
    Player.stamina += actualStaminaRecovered;
    Player.criticalChance += criticalChanceBonus;

    Stats.staminaRestored = (Stats.staminaRestored ?? 0) + actualStaminaRecovered;

    return resultRoom(room, [
        `You gain ${Math.round(actualStaminaRecovered)} stamina points.  You are ${staminaToDescription(Player.stamina / Player.maxStamina)}.`,
        criticalChanceBonus ? `You gain ${criticalChanceBonus} luck point${criticalChanceBonus === 1 ? '' : 's'}.` : '',
    ]);
}

export function die(room: Room) {
    Player.criticalChance = 0;
    Player.stamina = 1;
    Player.health = 1;

    emptyFromInventory(...Categories.meleeWeapons.filter((x) => x !== 'Large Stick'));
    emptyFromInventory(...Categories.rangeWeapons.filter((x) => x !== 'Rock'));
    emptyFromInventory(...Categories.chestArmor.filter((x) => x !== 'Cloth Shirt'));
    emptyFromInventory(...Categories.legArmor.filter((x) => x !== 'Cloth Pants'));
    emptyFromInventory(...Categories.headArmor.filter((x) => x !== 'Straw Hat'));
    Stats.goldSpent = (Stats.goldSpent ?? 0) + Inventory['Gold Coin'].count;
    emptyFromInventory('Gold Coin', ...Categories.loot);
    emptyFromInventory(...Categories.ammo.filter((x) => x !== 'Rock'));
    emptyFromInventory(...Categories.consumables);
    emptyFromInventory(...Categories.food);

    return resultRoom(
        room,
        `You manage to hang on to your life, but barely so, as you drift into unconsciousness.\n\nYou wake, too wounded and exhausted to even open your eyes, as someone or something rummages through your pack and removes everything of value.\n\nYou drift out of consciousness again.\n\nYou wake up, but you don't know how long you have been asleep.  You manage to crawl back to where you started.`
    );
}
