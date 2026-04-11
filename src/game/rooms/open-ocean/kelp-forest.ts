import { DialogueTree } from '../../engine/dialogue-tree';
import { Room } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Player } from '../../player';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { choiceRoom } from '../utility-rooms/choice-room';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';

export const KelpForest = new Room(
    {},
    (rm) => {
        const wigglesProgress = Quests.getStage('freeWiggles');

        return [
            VisitedDescription,
            wigglesProgress === null || !rm.investigated
                ? `You notice movement among the kelp strands.

Something small... stuck.`
                : rm.investigated && wigglesProgress !== 'completed'
                  ? `A starfish struggles in the kelp strands close by.`
                  : '',
        ];
    },
    (rm) => {
        const options: InputOption[] = [];

        if (!rm.investigated) {
            options.push({
                code: 'investigate',
                text: 'Investigate the movement',
            });
        } else {
            const wigglesProgress = Quests.getStage('freeWiggles');

            if (wigglesProgress === 'free-wiggles') {
                options.push({
                    code: 'help',
                    text: 'Help the starfish',
                });
            }
        }

        return {
            options,
            select: (option) => {
                const helpWiggles = () =>
                    Quests.start(
                        () =>
                            choiceRoom(
                                `The small starfish struggles in the kelp strands close by.`,
                                [
                                    {
                                        code: 'careful',
                                        text: 'Carefully free the starfish',
                                    },
                                    {
                                        code: 'quickly',
                                        text: 'Break the starfish free from the kelp (Valor)',
                                    },
                                    {
                                        code: 'ignore',
                                        text: 'Ignore the starfish',
                                    },
                                ],
                                (investigateChoice, investigateRoom) => {
                                    if (investigateChoice === 'ignore') {
                                        return rm;
                                    }

                                    const finishQuest = () =>
                                        resultRoom(() => Quests.finish(rm, 'freeWiggles'), Player.skillSet.levelSkill('starfishThrow'));

                                    if (investigateChoice === 'careful') {
                                        return resultRoom(
                                            finishQuest,
                                            `You free the small starfish who wiggles quickly to your side.  He is apparently very grateful as he latches to your side.\n\nYou decide to name him "Wiggles".`
                                        );
                                    } else if (investigateChoice === 'quickly') {
                                        Player.skillSet.skills.starfishThrow.attack -= 2;
                                        return resultRoom(finishQuest, [
                                            `You forcefully tear the kelp apart around the small starfish, but in doing so, you hurt one of the arms of the starfish.\n\nThough injured, the small starfish wiggles quickly to your side.  He is apparently very grateful as he latches to your side.\n\nYou decide to name him "Wiggles".`,
                                            Player.addValor(1),
                                        ]);
                                    }

                                    return investigateRoom;
                                }
                            ),
                        'freeWiggles'
                    );

                if (option === 'investigate') {
                    rm.investigated = true;
                    return resultRoom(helpWiggles, `You spot a small starfish struggling in the kelp strands close by.`);
                } else if (option === 'help') {
                    return helpWiggles;
                }
                return rm;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-east',
                text: 'Go east to the old shipwreck',
            },
            {
                code: 'travel-west',
                text: 'Go west to the dolphin city',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'B', 3)
    .withName(RoomNames.openOcean.kelpForest)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([...(!rm.visited ? OnEnterDescription : [])]);
        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The water darkens as you cross into the kelp forest, the open ocean giving way to towering walls of green.

Massive strands of kelp rise from the seafloor to heights that vanish into the dim light above, their long, ribbon-like leaves swaying slowly with the current. They crowd close together, forming narrow passages that twist and shift as the water moves, turning the forest into a living maze.`,
    `Light filters through in scattered beams, breaking apart against the dense growth and casting shifting shadows that dance across the sand below. Every movement feels watched—shapes flicker just beyond sight, vanishing as quickly as they appear.

The sounds of the ocean feel muted here, replaced by the soft rustle of kelp brushing against itself and the occasional distant snap of something moving deeper within.`,
];

const VisitedDescription = `You are inside the kelp forest.

To the east, an old shipwreck rests partially buried in the sand.

To the west, a colorful city rises from the ocean floor.`;
