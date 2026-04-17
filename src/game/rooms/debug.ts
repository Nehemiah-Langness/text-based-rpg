import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { Skills } from '../skills';
import { Apartment } from './mermaid-city/apartment';

export default () => {
    Skills.levelSkill('tailKick', 2);
    return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(Apartment);
};
