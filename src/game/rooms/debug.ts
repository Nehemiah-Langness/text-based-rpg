import { DialogueTree } from '../engine/dialogue-tree';
import { Player } from '../player';
import { Quests } from '../quests';
import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    Player.skillSet.levelSkill('tailKick');

    return new DialogueTree([
        (rm) => () => Quests.start(rm, 'fredsSupplyRun'),
        (rm) => () => Quests.progress(rm, 'fredsSupplyRun', 'talk-to-fred'),
    ]).getRoom(Shipwreck);
};
