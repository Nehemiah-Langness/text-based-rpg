import { staminaToDescription } from './utility-functions/stamina-to-description';
import { healthToDescription } from './utility-functions/health-to-description';
import { type RoomLike } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Stats } from './stats';
import { PlayerEntity } from './engine/player-entity';
import { Skills } from './skills';

export const Player = new PlayerEntity({
    health: 20,
    stamina: 100,
    truthfulness: 50,
    valor: 0,
    moves: Skills,
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
