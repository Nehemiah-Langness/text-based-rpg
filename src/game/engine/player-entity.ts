import type { RoomLike } from './room';
import type { Skill, SkillSet } from './skill-set';
import { Entity } from './entity';
import { resultRoom } from '../rooms/utility-rooms/result-room';
import { Inventory } from '../inventory';
import { Mood } from '../rooms/moods/mood';
import { resolveAttackRoll } from '../combat/resolve-attack';
import { AverageDamagePerLevel } from '../leveling';
import { compare } from '../../helpers/compare';

export class PlayerEntity<
    T extends {
        [key in keyof T]: Skill;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = any,
> extends Entity<T> {
    valor: number;
    truthfulness: number;

    readonly specificName = 'You';
    readonly genericName = 'You';

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

    save() {
        return {
            health: this.health,
            stamina: this.stamina,
            valor: this.valor,
            truthfulness: this.truthfulness,
            speed: this.speed,
            strength: this.strength,
            modifiers: this.modifiers,
            skills: this.skillSet.save(),
        };
    }

    load(data: Partial<ReturnType<typeof this.save>>) {
        this.health = data.health ?? this.health;
        this.stamina = data.stamina ?? this.stamina;
        this.valor = data.valor ?? this.valor;
        this.truthfulness = data.truthfulness ?? this.truthfulness;
        this.speed = data.speed ?? this.speed;
        this.strength = data.strength ?? this.strength;
        this.modifiers = data.modifiers ?? this.modifiers;

        this.skillSet.load(data.skills ?? {});
    }

    addValor(amount: number) {
        this.valor += amount;
        return `You have ${amount >= 0 ? 'gained' : 'lost'} ${Math.abs(amount)} valor.`;
    }

    addTruth(amount: number) {
        this.truthfulness += amount;
        return `You have ${amount >= 0 ? 'gained' : 'lost'} ${Math.abs(amount)} honesty.`;
    }

    getDefense() {
        return Math.floor(
            Inventory.list((x) => !!x.equippable?.defense && x.count > 0 && x.equipped).reduce(
                (c, n) => c + (n.item.equippable?.defense ?? 0),
                0
            ) * (this.modifiers.find((m) => m.effect === 'defense') ? 1.5 : 1)
        );
    }

    die(room: RoomLike) {
        this.stamina.current = 1;
        this.health.current = 1;

        return resultRoom(
            room,
            [
                `You drift into unconsciousness - barely holding onto your life.`,
                `You don't know how long you have been out, but you eventually awaken - still alive, but barely so.`,
            ],
            undefined,
            Mood.dead
        );
    }

    getLevel() {
        const skills = this.skillSet
            .getSkills()
            .map(({ skill }) => ({
                attack: resolveAttackRoll({
                    level: skill.level,
                    strength: skill.attack + this.strength,
                    penalty: 0,
                }).maxAttack,
                coolDown: skill.coolDown,
                inCoolDown: 0,
            }))
            .sort(compare((x) => x.attack, 'desc'));

        const maxTurnsForFullUse = (skills[0]?.coolDown ?? 0) + 1;

        let damageDone = 0;

        for (let turn = 0; turn < maxTurnsForFullUse; turn++) {
            const chosenSkill = skills.filter((x) => x.inCoolDown === 0).sort(compare((x) => x.attack, 'desc'))[0];
            if (chosenSkill) {
                console.log(chosenSkill)
                damageDone += chosenSkill.attack;
                chosenSkill.inCoolDown = chosenSkill.coolDown + 1;
            }
            skills.forEach((skill) => {
                if (skill.inCoolDown > 0) {
                    skill.inCoolDown -= 1;
                }
            });
        }

        const totalDamage = damageDone / maxTurnsForFullUse;
        return {
            attack: totalDamage < AverageDamagePerLevel ? 1 : Math.round(totalDamage / AverageDamagePerLevel),
            defense: Math.ceil(this.getDefense() / AverageDamagePerLevel),
        };
    }
}
