import { Skills } from './game/skills';
import { Inventory } from './game/inventory';
import { Shops } from './game/rooms/mermaid-city/shops';
import { Player } from './game/player';

export default () => {
    Skills.levelSkill('tailKick', 3);
    Skills.levelSkill('bubbleBlast', 2);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('sharkskinArmsEnchantment', 1, Player);
    Inventory.add('sharkskinBreastplateEnchantment', 1, Player);
    Inventory.add('sharkskinHelmetEnchantment', 1, Player);
    Inventory.items.sharkskinArmsEnchantment.equipped = true;
    Inventory.items.sharkskinBreastplateEnchantment.equipped = true;
    Inventory.items.sharkskinHelmetEnchantment.equipped = true;
    Inventory.add('coralCharm', 10, Player);
    Inventory.add('barnacleCoveredCoin', 2, Player);
    Shops.visited = true;
    return Shops;
    //return new DialogueTree([(rm) => Quests.progress(rm, 'seaCucumber', 'find-sea-cucumber', { shouldStartQuest: true })]).getRoom(FredsFish);
};
