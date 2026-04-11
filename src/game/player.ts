import { PlayerEntity } from './engine/player-entity';
import { Skills } from './skills';

export const Player = new PlayerEntity({
    health: 20,
    stamina: 100,
    truthfulness: 50,
    valor: 0,
    speed: 5,
    moves: Skills,
});
