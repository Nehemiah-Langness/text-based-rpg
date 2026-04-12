import { DialogueTree } from '../engine/dialogue-tree';
import { Quests } from '../quests';
import { CoralReef } from './open-ocean/coral-reef';

export default () => {
    return new DialogueTree([(rm) => Quests.progress(rm, 'mainQuest', 'learn-first-clue-location', { shouldStartQuest: true })]).getRoom(
        CoralReef
    );
};
