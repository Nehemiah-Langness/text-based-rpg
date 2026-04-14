import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { Skills } from '../skills';
import { MassWreckage } from './open-ocean/mass-wreckage';

export default () => {
    Skills.levelSkill('tailKick', 2);
    MassWreckage.visited = true;
    MassWreckage.state.piecesFound = 3;
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'find-crown-piece-3', { shouldStartQuest: true })]).getRoom(
        MassWreckage
    );
};
