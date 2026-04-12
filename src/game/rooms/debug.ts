// import { DialogueTree } from '../engine/dialogue-tree';
// import { Player } from '../player';
import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { MermaidPlaza } from './mermaid-city/mermaid-plaza';
//import { Quests } from '../quests';
// import { KelpForest } from './open-ocean/kelp-forest';
// import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'find-hermit-home', { shouldStartQuest: true })]).getRoom(
        MermaidPlaza
    );
};
