import { rollDice } from './dice';
import { saveGame } from './game';
import { Player } from './player';
import { AbandonedFortification } from './rooms/abandoned-fortification';
import { Cave } from './rooms/cave';
import { DarkForest } from './rooms/dark-forest';
import { Farmland } from './rooms/farmland';
import { Lake } from './rooms/lake';
import { Pond } from './rooms/pond';
import { Room } from './engine/room';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Wasteland } from './rooms/wasteland';
import { Woodlands } from './rooms/woodlands';
import { Stats } from './stats';

export function fullRest(room: Room) {
    if (Player.stamina === Player.maxStamina) {
        Player.criticalChance += 3;
    }
    Farmland.state.workLeft = Math.min(100, Farmland.state.workLeft + rollDice(2, 50));
    Lake.state.timesFished = 0;
    Pond.state.timesFished = 0;
    Woodlands.state.timesForaged = 0;
    DarkForest.state.encountered = false;
    Cave.state.encountered = false;
    Wasteland.state.encountered = false;
    AbandonedFortification.state.encountered = false;
    Stats.nightsSlept = (Stats.nightsSlept ?? 0) + 1;
    saveGame(room);
    return resultRoom(
        room,
        [
            Player.stamina === Player.maxStamina ? 'You have received a well-rested bonus (+3 luck points).' : null,
            'Your progress has been saved.',
        ].filter((x) => x !== null && typeof x !== 'undefined')
    );
}
