import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { MassWreckage } from './open-ocean/mass-wreckage';

export default () => {
    MassWreckage.visited = true;
    MassWreckage.state.piecesFound = 2;
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'find-crown-piece-2', { shouldStartQuest: true })]).getRoom(
        MassWreckage
    );
};
