import { compare } from '../helpers/compare';
import type { Room } from './engine/room';
import { Names } from './npcs/npc-names';
import { Thalor } from './npcs/thalor';
import { Mood } from './rooms/moods/mood';
import { resultRoom } from './rooms/utility-rooms/result-room';

type QuestType<TStages> = ReturnType<(typeof QuestsLog.createQuest<TStages>)>;

class QuestsLog<TQuests extends { [key in keyof TQuests]: QuestType<TQuests[key]['stages'][number]['id']> }> {
    quests: TQuests;

    constructor(quests: TQuests) {
        this.quests = quests;
    }

    static createQuest<T>(name: string, stages: { stage: string; id: T }[], radiant = false) {
        return {
            active: false,
            completed: false,
            progress: 0,
            name,
            stages,
            radiant,
        };
    }

    private getQuest<T extends keyof TQuests>(quest: T) {
        return this.quests[quest];
    }

    getStage<T extends keyof TQuests>(quest: T) {
        const questLog = this.getQuest(quest);
        if (!questLog.active) return null;

        return questLog.stages[questLog.progress].id as TQuests[T]['stages'][number]['id']
    }

    progress<T extends keyof TQuests>(
        backTo: Room | (() => Room),
        quest: T,
        stage: number,
        { requiredStage = 0, shouldStartQuest = false }: { requiredStage?: number; shouldStartQuest: boolean }
    ) {
        const questLog = this.getQuest(quest);

        if (questLog.completed) return backTo;

        const questStarted = shouldStartQuest ? this.start(backTo, quest) : null;

        if (typeof requiredStage !== 'undefined') {
            if (!questLog.active) return questStarted ?? backTo;
        }

        if (questLog.progress < stage && questLog.progress >= requiredStage) {
            questLog.progress = stage;

            return questStarted ?? (questLog.active ? resultRoom(backTo, `You have progressed the quest "${questLog.name}".`) : backTo);
        }
        return questStarted ?? backTo;
    }

    start<T extends keyof TQuests>(backTo: Room | (() => Room), quest: T) {
        const questLog = this.getQuest(quest);

        if (!questLog.active && !questLog.completed) {
            questLog.active = true;
            return resultRoom(backTo, `You have started the quest "${questLog.name}".`);
        }
        return backTo;
    }

    finish<T extends keyof TQuests>(backTo: Room | (() => Room), quest: T) {
        const questLog = this.getQuest(quest);

        if (questLog.radiant && !questLog.active) return backTo;

        questLog.active = false;
        if (!questLog.completed) {
            if (questLog.radiant) {
                questLog.progress = 0;
            } else {
                questLog.completed = true;
                questLog.progress = questLog.stages.length;
            }

            return resultRoom(backTo, `You have completed the quest "${questLog.name}".`).withColor(Mood.questComplete);
        }
        return backTo;
    }

    getActiveQuests() {
        return (Object.values(this.quests) as QuestType<string>[])
            .filter((x) => x.active || x.completed)
            .sort(compare<{ completed: boolean; name: string }>((x) => x.completed).thenBy((x) => x.name));
    }

    save() {
        return this.quests;
    }

    load(quests: TQuests) {
        Object.assign(this.quests, quests);
    }
}

export const Quests = new QuestsLog({
    mainQuest: QuestsLog.createQuest('The Trident of the Deep', [{
        id: 'go-to-training' as const,
        stage: `Meet ${Thalor.getName()[Names.FullName]} at the Guild Hall`
    }]),
    sideQuest: QuestsLog.createQuest('The Trident of the Deep', [{
        id: 'go-to-somewhere' as const,
        stage: `Meet ${Thalor.getName()} at the Guild Hall`
    }]),
});
