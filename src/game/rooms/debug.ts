// import { DialogueTree } from '../engine/dialogue-tree';
// import { Player } from '../player';
import { Quests } from '../quests';
import { MermaidPlaza } from './mermaid-city/mermaid-plaza';
// import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    MermaidPlaza.visited = true;
    return Quests.start(MermaidPlaza, 'mainQuest');
    // Player.skillSet.levelSkill('tailKick');

    // return new DialogueTree([
    //     (rm) => () => Quests.start(rm, 'fredsSupplyRun'),
    //     (rm) => () => Quests.progress(rm, 'fredsSupplyRun', 'talk-to-fred'),
    // ]).getRoom(Shipwreck);
};
