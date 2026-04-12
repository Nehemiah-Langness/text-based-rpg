// import { DialogueTree } from '../engine/dialogue-tree';
// import { Player } from '../player';
import { Compass } from '../compass';
import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { MermaidPlaza } from './mermaid-city/mermaid-plaza';
import { CoralReef } from './open-ocean/coral-reef';
import { Shipwreck } from './open-ocean/shipwreck';
//import { Quests } from '../quests';
// import { KelpForest } from './open-ocean/kelp-forest';
// import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    Compass.destination = Shipwreck;
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'find-hermit-home', { shouldStartQuest: true })]).getRoom(
        MermaidPlaza
    );
};
