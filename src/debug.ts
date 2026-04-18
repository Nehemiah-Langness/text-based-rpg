import { Skills } from './game/skills';
import { Inventory } from './game/inventory';
import { GuardHall } from './game/rooms/mermaid-city/guard-hall';

export default () => {
    Skills.levelSkill('tailKick', 3);
    Skills.levelSkill('bubbleBlast', 2);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('sharkskinArmsEnchantment', 1);
    Inventory.add('sharkskinBreastplateEnchantment', 1);
    Inventory.add('sharkskinHelmetEnchantment', 1);
    return GuardHall;
    //return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(FredsFish);
};
