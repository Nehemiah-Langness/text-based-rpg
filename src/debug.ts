import { Skills } from './game/skills';
import { Inventory } from './game/inventory';
import { Shops } from './game/rooms/mermaid-city/shops';
import { Player } from './game/player';
import { Quests } from './game/quests';
import { GuardHall } from './game/rooms/mermaid-city/guard-hall';
import { DeepCoralReef } from './game/rooms/open-ocean/deep-coral-reef';
import { resultRoom } from './game/rooms/utility-rooms/result-room';
import { SealedCavern } from './game/rooms/open-ocean/sealed-cavern';
import { DarkWaters } from './game/rooms/open-ocean/dark-waters';
import { Velrix } from './game/npcs/velrix';

export default () => {
    Skills.levelSkill('tailKick', 4);
    Skills.levelSkill('bubbleBlast', 3);
    Skills.levelSkill('starfishThrow', 2);
    Inventory.add('coralArmsArmor', 1, Player);
    Inventory.equip('coralArmsArmor', Player);
    Inventory.add('coralBreastplateArmor', 1, Player);
    Inventory.equip('coralBreastplateArmor', Player);
    Inventory.add('coralHelmetArmor', 1, Player);
    Inventory.equip('coralHelmetArmor', Player);
    Inventory.add('ringOfLongevity', 1, Player);
    Inventory.equip('ringOfLongevity', Player);
    Inventory.add('healthBreastplateEnchantment', 1, Player);
    Inventory.equip('healthBreastplateEnchantment', Player);
    Inventory.add('healthArmsEnchantment', 1, Player);
    Inventory.equip('healthArmsEnchantment', Player);
    Inventory.add('healthHelmetEnchantment', 1, Player);
    Inventory.equip('healthHelmetEnchantment', Player);
    Inventory.add('bloomTonic', 2, Player);
    Shops.visited = true;
    GuardHall.visited = true;
    DeepCoralReef.visited = true;
    DarkWaters.visited = true;
    DarkWaters.state.velrixDiscovered = true;
    Velrix.move(DarkWaters)
    SealedCavern.visited = true;
    SealedCavern.state.cavernSealed = false
    Quests.progress('mainQuest', 'jewel-1-quest', { shouldStartQuest: true });
    return resultRoom(DarkWaters, []);
};
