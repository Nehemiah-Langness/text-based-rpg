import { Skills } from '../skills';
import { Shops } from './mermaid-city/shops';

export default () => {
    Skills.levelSkill('tailKick', 2);
    Skills.levelSkill('bubbleBlast', 1);
    Skills.levelSkill('starfishThrow', 1);
    return Shops
    //return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(FredsFish);
};
