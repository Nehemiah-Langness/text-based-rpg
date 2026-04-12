import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { startSearchRoom } from '../../search/start-search-room';
import { Mood } from '../moods/mood';
import { RoomNames } from '../names';
import { VelmoraJournalEntryOne } from '../story/velmora-journal-entry-one';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const CoralReef = new Room(
    {},
    () => {
        const mainQuestProgress = Quests.getStage('mainQuest');

        return [
            VisitedDescription,
            mainQuestProgress === 'find-hermit-home' ? `Ruins of an old coral-brick home lay crumbled nearby.` : null,
        ];
    },
    (rm) => {
        const options: InputOption[] = [];

        const mainQuestProgress = Quests.getStage('mainQuest');
        if (mainQuestProgress === 'find-hermit-home') {
            options.push({ code: 'search-hermit-home', text: 'Search the ruined home' });
        }

        return {
            options,
            select: (code) => {
                if (code === 'search-hermit-home') {
                    return startSearchRoom(rm, {
                        gridSize: 7,
                        playerStart: { x: 4, y: 4 },
                        maxAttempts: 10,
                        onComplete: (nxtRm) =>
                            resultRoom(
                                () => VelmoraJournalEntryOne(() => Quests.progress(nxtRm, 'mainQuest', 'find-hermit-home')),
                                'You found an old compass in a tattered pouch alongside a journal.',
                                'Read journal',
                                Mood.miniGame
                            ),
                    });
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-north',
                text: 'Go north towards the sacred garden',
            },
            {
                code: 'travel-east',
                text: 'Go east deeper into the coral reef',
            },
            {
                code: 'travel-west',
                text: 'Go west towards the city',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'D', 5)
    .withName(RoomNames.openOcean.coralReef)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `Color returns to the ocean in a sudden, breathtaking sweep as you enter the coral reef.

Towering formations of coral rise from the seafloor in layered arches and spirals, their surfaces alive with shifting hues - crimson, gold, violet, and soft blues that glow faintly in the filtered light. Schools of fish weave through narrow passages, and delicate tendrils of sea life drift lazily in the current, brushing against the reef like living silk.`,
    `But beneath the beauty, something feels... fractured.

Sections of the reef are jagged, unnaturally collapsed, as though the ocean itself once clenched and crushed everything here. Massive coral structures lie broken and twisted, half-buried in sand and stone. In places, the formations don't flow naturally - they jut and overlap, reshaped by violent force rather than slow growth.`,
    `Long ago, tectonic shifts tore through this region, triggering deep implosions that shattered whatever once stood here. The reef grew back over it... but not cleanly. Not completely.

Fragments of something older remain, hidden beneath the coral.

Here, life thrives.

But it has grown over ruin.`,
];

const VisitedDescription = `Breathtaking color sweeps around you as you float around the coral reef.

To the north, the vibrant colors fade into a pale, lifeless stretch of wasteland, and beyond that, a distant glow hints at the Sacred Gardens.

To the west, the water clears toward the familiar safety of the city outskirts.

To the east, the reef thickens and deepens, its colors darkening as it descends - beautiful, but increasingly difficult to navigate.`;
