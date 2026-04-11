import { compare } from '../helpers/compare';
import type { RoomLike } from './engine/room';
import { Mood } from './rooms/moods/mood';
import { resultRoom } from './rooms/utility-rooms/result-room';
import { Skills } from './skills';

type QuestType<TStages> = ReturnType<typeof QuestsLog.createQuest<TStages>>;

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
        if (questLog.completed) return 'completed' as const;
        if (!questLog.active) return null;

        return questLog.stages[questLog.progress].id as TQuests[T]['stages'][number]['id'];
    }

    progress<T extends keyof TQuests>(
        backTo: RoomLike,
        quest: T,
        stage: number | TQuests[T]['stages'][number]['id'],
        restrictions?: { requiredStage?: number; shouldStartQuest: boolean }
    ): RoomLike {
        const { requiredStage = 0, shouldStartQuest = false } = restrictions ?? {};

        const questLog = this.getQuest(quest);

        if (questLog.completed) return backTo;

        const questStarted = shouldStartQuest ? this.start(backTo, quest, stage) : null;

        const progress =
            typeof stage === 'number'
                ? stage
                : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]) + 1;

        if (questLog.progress < progress && questLog.progress >= requiredStage) {
            questLog.progress = progress;

            return (
                questStarted ??
                (questLog.active
                    ? resultRoom(backTo, [
                          `You have progressed the quest "${questLog.name}".`,
                          `Your next task is ${questLog.stages[questLog.progress].stage}`,
                      ])
                    : backTo)
            );
        }
        return questStarted ?? backTo;
    }

    start<T extends keyof TQuests>(backTo: RoomLike, quest: T, stage?: number | TQuests[T]['stages'][number]['id']) {
        const questLog = this.getQuest(quest);

        const progress =
            typeof stage === 'undefined'
                ? 0
                : typeof stage === 'number'
                  ? stage
                  : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]) + 1;

        if (!questLog.active && !questLog.completed) {
            questLog.active = true;
            return resultRoom(backTo, [
                `You have started the quest "${questLog.name}".`,
                `Your next task is ${questLog.stages[progress].stage}`,
            ]);
        }
        return backTo;
    }

    finish<T extends keyof TQuests>(backTo: RoomLike, quest: T) {
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

            return resultRoom(backTo, `You have completed the quest "${questLog.name}".`, undefined, Mood.questComplete);
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
    mainQuest: QuestsLog.createQuest('The Trident of the Deep', [
        {
            id: 'go-to-training' as const,
            stage: `Meet Commander Thalor at the Guild Hall.`,
        },
        {
            id: 'train-tail-kick' as const,
            stage: `Learn ${Skills.skills.tailKick.name} from Commander Thalor.`,
        },
        {
            id: 'learn-first-clue-location' as const,
            stage: `Talk to Commander Thalor.`,
        },
        {
            id: 'find-hermit-home' as const,
            stage: `Locate the destroyed home of Velmora the Ink-Seer in the Coral Reef southeast of the city.`,
        },
    ]),
    fredsSupplyRun: QuestsLog.createQuest('Supply Run Gone Wrong', [
        {
            id: 'talk-to-fred' as const,
            stage: 'Talk to Fred and see what is wrong.',
        },
        {
            id: 'travel-shipwreck' as const,
            stage: 'Go to the Old Shipwreck north of the city.',
        },
        {
            id: 'fight-or-sneak' as const,
            stage: 'Get the supply crate.',
        },
        {
            id: 'return-crate' as const,
            stage: 'Return the crate to Fred.',
        },
    ]),
});
