import type { RoomLike } from './room';
import type { Skill, SkillSet } from './skill-set';
import { Entity } from './entity';
import { resultRoom } from '../rooms/utility-rooms/result-room';

export class PlayerEntity<
    T extends {
        [key in keyof T]: Skill;
    },
> extends Entity<T> {
    valor: number;
    truthfulness: number;
    constructor({
        truthfulness,
        valor,
        ...parent
    }: {
        health: number;
        stamina: number;
        moves: SkillSet<T>;
        valor?: number;
        truthfulness?: number;
        speed?: number;
        strength?: number;
    }) {
        super(parent);
        this.valor = valor ?? 0;
        this.truthfulness = truthfulness ?? 50;
    }

    getDefense() {
        return 0;
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
