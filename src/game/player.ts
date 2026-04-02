import { staminaToDescription } from './utility-functions/stamina-to-description';
import { healthToDescription } from './utility-functions/health-to-description';
import { emptyFromInventory } from './inventory/empty-from-inventory';
import { Inventory } from './inventory/inventory';
import { Categories } from './inventory/lists/categories';
import { Room, type RoomLike } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Stats } from './stats';
import type { Skill } from './knowledge';

export class PlayerObject {
    health: {
        current: number;
        max: number;
    };
    stamina: {
        current: number;
        max: number;
    };
    criticalChance = 0;

    modifiers: NonNullable<Skill['modifiers']> = [];

    constructor(health: number, stamina: number) {
        this.health = {
            current: health,
            max: health,
        };
        this.stamina = {
            current: stamina,
            max: stamina,
        };
    }

    coolDown(all = false) {
        const complete = this.modifiers.filter((x) => (all ? x.duration > 0 : x.duration === 1));
        this.modifiers = this.modifiers
            .map((x) => ({
                ...x,
                duration: all ? 0 : x.duration - 1,
            }))
            .filter((x) => x.duration > 0);

        return complete.map((x) => x.effect);
    }

    addModifier(modifier: NonNullable<Skill['modifiers']>[number]) {
        const existing = this.modifiers.find((x) => x.effect === modifier.effect);
        if (existing) {
            existing.duration += modifier.duration;
        } else {
            this.modifiers.push(modifier);
        }
    }
}

export const Player = new PlayerObject(100, 100);

export function criticalChance() {
    const playerLuck = (Player.stamina.current >= 60 ? 2 : 0) + Player.criticalChance + Inventory['Luck Aura'].count;
    if (playerLuck > (Stats.highestLuck ?? 0)) {
        Stats.highestLuck = playerLuck;
    }
    return 5 + playerLuck;
}

export function heal(room: RoomLike, healthRecovery: number) {
    const actualHealthRecovered = Math.min(Player.health.max - Player.health.current, healthRecovery);
    Player.health.current += actualHealthRecovered;

    Stats.healthRestored = (Stats.healthRestored ?? 0) + actualHealthRecovered;

    return resultRoom(
        room,
        `You gain ${Math.round(actualHealthRecovered)} health points.  You are ${healthToDescription(Player.health.current / Player.health.max)}.`
    );
}

export function energize(room: RoomLike, staminaRecovery: number, criticalChanceBonus: number) {
    const actualStaminaRecovered = Math.min(Player.stamina.max - Player.stamina.current, staminaRecovery);
    Player.stamina.current += actualStaminaRecovered;
    Player.criticalChance += criticalChanceBonus;

    Stats.staminaRestored = (Stats.staminaRestored ?? 0) + actualStaminaRecovered;

    return resultRoom(room, [
        `You gain ${Math.round(actualStaminaRecovered)} stamina points.  You are ${staminaToDescription(
            Player.stamina.current / Player.stamina.max
        )}.`,
        criticalChanceBonus ? `You gain ${criticalChanceBonus} luck point${criticalChanceBonus === 1 ? '' : 's'}.` : '',
    ]);
}

export function die(room: Room) {
    Player.criticalChance = 0;
    Player.stamina.current = 1;
    Player.health.current = 1;

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
