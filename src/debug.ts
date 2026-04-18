import { Skills } from './game/skills';
import { BloodfinTerritory } from './game/rooms/open-ocean/bloodfin-territory';
import { Inventory } from './game/inventory';

export default () => {
    Skills.levelSkill('tailKick', 3);
    Skills.levelSkill('bubbleBlast', 2);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('sharkskinArmsEnchantment', 1);
    Inventory.add('sharkskinBreastplateEnchantment', 1);
    Inventory.add('sharkskinHelmetEnchantment', 1);
    return BloodfinTerritory;
    //return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(FredsFish);
};
