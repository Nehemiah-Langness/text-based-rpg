import { Skills } from './game/skills';
import { Inventory } from './game/inventory';
import { Shops } from './game/rooms/mermaid-city/shops';
import { Player } from './game/player';
import { Quests } from './game/quests';
import { DialogueTree } from './game/engine/dialogue-tree';
import { GuardHall } from './game/rooms/mermaid-city/guard-hall';

export default () => {
    Skills.levelSkill('tailKick', 3);
    Skills.levelSkill('bubbleBlast', 2);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('coralCharm', 10, Player);
    Inventory.add('barnacleCoveredCoin', 2, Player);
    Inventory.add('coralShard', 3000, Player);
    Shops.visited = true;
    GuardHall.visited = true;
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'fix-crown-attempt', { shouldStartQuest: true })]).getRoom(Shops);
};
