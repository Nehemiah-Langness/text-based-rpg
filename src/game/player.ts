import { staminaToDescription } from './utility-functions/stamina-to-description';
import { healthToDescription } from './utility-functions/health-to-description';
import { type RoomLike } from './engine/room';
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

    valor: number;
    truthfulness: number;
    speed: number;
    strength: number;

    modifiers: NonNullable<Skill['modifiers']> = [];

    constructor({
        health,
        stamina,
        speed,
        strength,
        truthfulness,
        valor,
    }: {
        health: number;
        stamina: number;
        valor: number;
        truthfulness: number;
        speed: number;
        strength: number;
    }) {
        this.health = {
            current: health,
            max: health,
        };
        this.stamina = {
            current: stamina,
            max: stamina,
        };
        this.valor = valor;
        this.strength = strength;
        this.speed = speed;
        this.truthfulness = truthfulness;
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

    die(room: RoomLike) {
        this.criticalChance = 0;
        this.stamina.current = 1;
        this.health.current = 1;

        return resultRoom(
            room,
            [
                `You drift into unconsciousness - barely holding onto your life.`,
                `You don't know how long you have been out, but you awaken - still alive, but barely so.`,
            ],
            undefined,
            {
                primary: '#000',
                secondary: '#000',
            }
        );
    }
}

export const Player = new PlayerObject({
    health: 20,
    stamina: 100,
    speed: 10,
    strength: 10,
    truthfulness: 50,
    valor: 0,
});

export function criticalChance() {
    const playerLuck = (Player.stamina.current >= 60 ? 2 : 0) + Player.criticalChance;
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
        `You gain ${Math.round(actualHealthRecovered)} health points.  You are ${healthToDescription(
            Player.health.current / Player.health.max
        )}.`
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
