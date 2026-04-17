import { Skills } from '../skills';
import { BloodfinTerritory } from './open-ocean/bloodfin-territory';

export default () => {
    Skills.levelSkill('tailKick', 2);
    Skills.levelSkill('bubbleBlast', 1);
    Skills.levelSkill('starfishThrow', 1);
    return BloodfinTerritory
    //return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(FredsFish);
};
