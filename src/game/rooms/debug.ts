import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { Skills } from '../skills';
import { Shops } from './mermaid-city/shops';

export default () => {
    Skills.levelSkill('tailKick', 2);
    Shops.visited = true;
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'find-crown-piece-3', { shouldStartQuest: true })]).getRoom(Shops);
};
