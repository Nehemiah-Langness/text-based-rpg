import { compare } from '../helpers/compare';

function createQuest(name: string, stages: string[], radiant = false) {
    return {
        active: false,
        completed: false,
        progress: 0,
        name,
        stages,
        radiant,
    };
}

export const Quests = {
    guildIntroduction: createQuest('Fair Coin for Fair Work', [
        'Go to the guild hall.',
        'Talk to the guild master.',
        'Complete work for gold.',
    ]),
    lootIntroduction: createQuest('Gold has More Value Than Teeth', ['Obtain loot.', 'Sell loot to the general store.']),
    farmingIntroduction: createQuest('Farming for Gold', ['Find the farm.', 'Talk to the farmer.', 'Work in the fields.']),
    killTierOneEnemy: createQuest('Cleanse the Forest', ['Kill a weak enemy.', 'Turn in proof of your kill.']),
    killTierTwoEnemy: createQuest('Make the Village a Little Safer', ['Kill a strong enemy.', 'Turn in proof of your kill.']),
    killTierThreeEnemy: createQuest('Fighting Guys a Lot Bigger than You', ['Kill a dangerous enemy.', 'Turn in proof of your kill.']),
    killTierFourEnemy: createQuest('Fight the Problem at the Source', ['Kill a legendary enemy.', 'Turn in proof of your kill.']),
    stayAtInn: createQuest('Get a Restful Night Sleep', ['Find the inn.', 'Rent a room for the night.']),
    findWayToPond: createQuest('Westward to the Wastelands', [
        'Find a way through the thick forest southwest of the village.',
        'Reach the pond.',
    ]),
    fish: createQuest('Teach a Man to Fish', [
        'Obtain a fishing pole.',
        'Find a good fishing location.',
        'Catch a fish.',
        'Cook your fish.',
    ]),
    forage: createQuest(`Be Mindful of the Mushrooms`, [
        'Find the woodlands',
        'Forage for some medicinal herbs.',
        'Mix up some herbal medicine.',
    ]),
    defeatBoss: createQuest('Defeat the Sorcerer Warlord', ['Defeat the Sorcerer Warlord.']),
    talkToGuildMaster: createQuest('Talk to the Guild Master', ['Get a quest from the guild master.'], true),
};

export function progressQuest<T extends keyof typeof Quests>(quest: T, stage: number, requiredStage = 0, shouldStartQuest = false) {
    if (Quests[quest].completed) return null;

    const questStarted = shouldStartQuest ? startQuest(quest) : null;

    if (typeof requiredStage !== 'undefined') {
        if (!Quests[quest].active) return questStarted;
    }

    if (Quests[quest].progress < stage && Quests[quest].progress >= requiredStage) {
        Quests[quest].progress = stage;

        return questStarted ?? (Quests[quest].active ? `You have progressed the quest "${Quests[quest].name}".` : null);
    }
    return questStarted;
}

export function startQuest<T extends keyof typeof Quests>(quest: T) {
    if (!Quests[quest].active && !Quests[quest].completed) {
        Quests[quest].active = true;
        return `You have started the quest "${Quests[quest].name}".`;
    }
    return null;
}

export function finishQuest<T extends keyof typeof Quests>(quest: T) {
    if (Quests[quest].radiant && !Quests[quest].active) return null;

    Quests[quest].active = false;
    if (!Quests[quest].completed) {
        if (Quests[quest].radiant) {
            Quests[quest].progress = 0;
        } else {
            Quests[quest].completed = true;
            Quests[quest].progress = Quests[quest].stages.length;
        }

        return `You have completed the quest "${Quests[quest].name}".`;
    }
    return null;
}

export function getActiveQuests() {
    return Object.values(Quests)
        .filter((x) => x.active || x.completed)
        .sort(compare<{ completed: boolean; name: string }>((x) => x.completed).thenBy((x) => x.name));
}
