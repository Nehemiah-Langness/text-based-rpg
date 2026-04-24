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

    checkStage<T extends keyof TQuests>(quest: T, stage: number | TQuests[T]['stages'][number]['id']) {
        const questLog = this.getQuest(quest);
        if (questLog.completed) return true;
        if (!questLog.active) return false;

        const progress =
            typeof stage === 'number' ? stage : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]);

        return questLog.progress >= progress;
    }

    progress<T extends keyof TQuests>(
        quest: T,
        stage: number | TQuests[T]['stages'][number]['id'],
        restrictions?: { requiredStage?: number; shouldStartQuest: boolean }
    ): string[] | null {
        const { requiredStage = 0, shouldStartQuest = false } = restrictions ?? {};

        const questLog = this.getQuest(quest);

        if (questLog.completed) return null;

        const questStarted = shouldStartQuest ? this.start(quest, stage) : null;

        const progress =
            typeof stage === 'number'
                ? stage
                : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]) + 1;

        if (questLog.progress < progress && questLog.progress >= requiredStage) {
            questLog.progress = progress;

            const progressedLanguage = questLog.active
                ? [`You have progressed the quest "${questLog.name}".`, `Your next task is ${questLog.stages[questLog.progress].stage}`]
                : null;

            return questStarted ?? progressedLanguage;
        }
        return questStarted;
    }

    revertTo<T extends keyof TQuests>(quest: T, stage: number | TQuests[T]['stages'][number]['id']): string[] | null {
        const questLog = this.getQuest(quest);

        if (questLog.completed) return null;

        const progress =
            typeof stage === 'number' ? stage : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]);

        if (questLog.progress > progress) {
            questLog.progress = progress;

            const progressedLanguage = questLog.active
                ? [`You have fallen back in the quest "${questLog.name}".`, `Your next task is ${questLog.stages[questLog.progress].stage}`]
                : null;

            return progressedLanguage;
        }
        return null;
    }

    start<T extends keyof TQuests>(quest: T, stage?: number | TQuests[T]['stages'][number]['id']): string[] | null {
        const questLog = this.getQuest(quest);

        const progress =
            typeof stage === 'undefined'
                ? 0
                : typeof stage === 'number'
                  ? stage
                  : questLog.stages.indexOf(questLog.stages.find((s) => s.id === stage) ?? questLog.stages[0]) + 1;

        if (!questLog.active && !questLog.completed) {
            questLog.active = true;
            return [`You have started the quest "${questLog.name}".`, `Your next task is ${questLog.stages[progress].stage}`];
        }
        return null;
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
        return (Object.entries(this.quests) as [keyof TQuests, QuestType<TQuests[keyof TQuests]['stages'][number]['id']>][]).reduce(
            (current, next) => {
                return Object.assign(current, {
                    [next[0]]: {
                        active: next[1].active,
                        completed: next[1].completed,
                        progress: next[1].progress,
                    },
                });
            },
            {} as Record<keyof TQuests, { active: boolean; completed: boolean; progress: number }>
        );
    }

    load(data: Partial<ReturnType<typeof this.save>>) {
        (Object.entries(data) as [keyof TQuests, { active: boolean; completed: boolean; progress: number }][]).forEach(([item, value]) => {
            if (this.quests[item]) {
                this.quests[item].active = value.active ?? this.quests[item].active;
                this.quests[item].completed = value.completed ?? this.quests[item].completed;
                this.quests[item].progress = value.progress ?? this.quests[item].progress;
            }
        });
    }
}

export const Quests = new QuestsLog({
    mainQuest: QuestsLog.createQuest('The Trident of the Deep', [
        {
            id: 'go-to-training' as const,
            stage: `Meet Commander Thalor at the Guard Hall.`,
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
        {
            id: 'follow-compass-to-crown' as const,
            stage: `Follow the compass to the Abyssal Crown.`,
        },
        {
            id: 'find-crown-piece-1' as const,
            stage: `Locate a piece of the Abyssal Crown.`,
        },
        {
            id: 'find-crown-piece-2' as const,
            stage: `Locate a second piece of the Abyssal Crown.`,
        },
        {
            id: 'find-crown-piece-3' as const,
            stage: `Locate the third piece of the Abyssal Crown.`,
        },
        {
            id: 'fight-for-crown' as const,
            stage: `Fight the Bloodfins for the crown.`,
        },
        {
            id: 'learn-how-to-fix-crown' as const,
            stage: `Talk to Commander Thalor.`,
        },
        {
            id: 'fix-crown-attempt' as const,
            stage: `Talk to Garron.`,
        },
        {
            id: 'get-requirement-to-fix-crown' as const,
            stage: `Obtain a Ring of Protection.`,
        },
        {
            id: 'fix-crown' as const,
            stage: `Bring Garron the Ring of Protection.`,
        },
        {
            id: 'find-jewel-1' as const,
            stage: `Follow the compass.`,
        },
        {
            id: 'jewel-1-quest' as const,
            stage: `Get the Sealed Relic Orb.`,
        },
        {
            id: 'jewel-1-turn-in' as const,
            stage: `Return to Velrix.`,
        },
        {
            id: 'find-jewel-2' as const,
            stage: `Follow the compass.`,
        },
        {
            id: 'get-jewel-2' as const,
            stage: `Get the jewel.`,
        },
        {
            id: 'find-jewel-3' as const,
            stage: `Follow the compass.`,
        },
        {
            id: 'get-jewel-3' as const,
            stage: `Get the jewel.`,
        },
        {
            id: 'find-jewel-4' as const,
            stage: `Follow the compass.`,
        },
        {
            id: 'get-jewel-4' as const,
            stage: `Get the jewel.`,
        },
        {
            id: 'find-jewel-5' as const,
            stage: `Follow the compass.`,
        },
        {
            id: 'get-jewel-5' as const,
            stage: `Meet the Dolphin Patrol in the trench south of the city.`,
        },
        {
            id: 'go-to-trident-cave' as const,
            stage: `Follow the Abyssal Descent to the Trident Cave.`,
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
    freeWiggles: QuestsLog.createQuest('Wiggling Free', [
        {
            id: 'free-wiggles' as const,
            stage: 'Free the starfish from the kelp strands.',
        },
    ]),
    seaCucumber: QuestsLog.createQuest('Soft Skin, Strong Scales', [
        {
            id: 'find-sea-cucumber' as const,
            stage: 'Locate a special striped reef variant of sea-cucumber.',
        },
        {
            id: 'return-sea-cucumber' as const,
            stage: 'Return the sea cucumber to Nerissa.',
        },
    ]),
    sirensSong: QuestsLog.createQuest("Siren's Song", [
        {
            id: 'find-resonant-pearl' as const,
            stage: 'Find the Resonant Pearl in the Tidecaller Collective territory.',
        },
        {
            id: 'return-pearl' as const,
            stage: 'Return the Resonant Pearl to the Siren.',
        },
    ]),
});
