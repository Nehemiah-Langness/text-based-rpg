import { Skills } from './game/skills';
import { Inventory } from './game/inventory';
import { Shops } from './game/rooms/mermaid-city/shops';
import { Player } from './game/player';
import { Quests } from './game/quests';
import { GuardHall } from './game/rooms/mermaid-city/guard-hall';
import { DarkWaters } from './game/rooms/open-ocean/dark-waters';

export default () => {
    Skills.levelSkill('tailKick', 3);
    Skills.levelSkill('bubbleBlast', 2);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('coralCharm', 10, Player);
    Inventory.add('barnacleCoveredCoin', 2, Player);
    Inventory.add('coralShard', 3000, Player);
    Shops.visited = true;
    GuardHall.visited = true;
    Quests.progress('mainQuest', 'fix-crown', { shouldStartQuest: true })
    return DarkWaters;
};
