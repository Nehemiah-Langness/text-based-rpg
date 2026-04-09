import { DialogueTree } from '../engine/dialogue-tree';
import { Skills } from '../knowledge';
import { Quests } from '../quests';
import { Shipwreck } from './open-ocean/shipwreck';

export default () => {
    Skills.levelSkill('tailKick');

    return new DialogueTree([
        (rm) => () => Quests.start(rm, 'fredsSupplyRun'),
        (rm) => () => Quests.progress(rm, 'fredsSupplyRun', 'talk-to-fred'),
    ]).getRoom(Shipwreck);
};
