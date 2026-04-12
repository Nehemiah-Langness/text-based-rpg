// import { DialogueTree } from '../engine/dialogue-tree';
// import { Player } from '../player';
import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { DeepCoralReef } from './open-ocean/deep-coral-reef';
//import { Quests } from '../quests';
// import { KelpForest } from './open-ocean/kelp-forest';
// import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    return new DialogueTree([(rm)=>Quests.start(rm, 'seaCucumber')]).getRoom(DeepCoralReef);
};
