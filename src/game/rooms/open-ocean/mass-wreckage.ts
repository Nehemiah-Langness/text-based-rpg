import { DialogueTree } from '../../engine/dialogue-tree';
import { Room, type RoomLike } from '../../engine/room';
import type { InputOption } from '../../input-option';
import { Quests } from '../../quests';
import { RoomNames } from '../names';
import { resultRoom } from '../utility-rooms/result-room';
import { OpenOceanMap } from './map';
import { startSearchRoom } from '../../search/start-search-room';
import { Mood } from '../moods/mood';
import type { Enemy } from '../../combat/enemy';
import { startCombatEncounter } from '../../combat/start-combat-encounter';
import { Player } from '../../player';
import { Inventory } from '../../inventory';

function createBloodfin(level: number): Enemy {
    return {
        level,
        defense: 1,
        speed: 10,
        effects: [],
        genericName: 'a Bloodfin Clan shark',
        specificName: 'The Bloodfin shark',
        health: 20,
        stamina: 50,
        strength: 0,
        moves: [
            {
                name: 'Savage Bite',
                actionDescription: 'does a direct, brutal bite',
                attack: 4,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 20,
                xp: -100000,
            },
            {
                name: 'Rending Charge',
                actionDescription: 'surges forward in a straight-line attack',
                attack: 3,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 16,
                xp: -100000,
            },
            {
                name: 'Fin Slash',
                actionDescription: 'quickly swipes his sharpened fins',
                attack: 2,
                coolDown: 0,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                stamina: 8,
                xp: -100000,
            },
            {
                name: 'Disorienting Feint',
                actionDescription: 'makes a fake-out movement, followed by a quick strike',
                attack: 1,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'distract',
                    },
                ],
                stamina: 10,
                xp: -100000,
            },
            {
                name: 'Tail Whip',
                actionDescription: 'sweeps his tail',
                attack: 1,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'distract',
                    },
                ],
                stamina: 10,
                xp: -100000,
            },
            {
                name: 'Crushing Lunge',
                actionDescription: 'lunges into a heavy-bodied slam',
                attack: 2,
                coolDown: 2,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 14,
                xp: -100000,
            },
            {
                name: 'Jaw Clamp',
                actionDescription: 'locks his teeth into you and throws you away',
                attack: 4,
                coolDown: 4,
                coolDownCompleteText: '',
                inCoolDown: 0,
                level,
                modifiers: [
                    {
                        duration: 1,
                        effect: 'stun',
                    },
                ],
                stamina: 19,
                xp: -100000,
            },
        ],
    };
}

function withValueInRange(range: { min: number; max: number }) {
    return ({ item }: ReturnType<typeof Inventory.getCategory>[number]) =>
        (item.vendor?.value ?? 0) >= range.min && (item.vendor?.value ?? 0) <= range.max;
}

const bloodFinLootTable = Inventory.createLootTable([
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: 10,
                max: 50,
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 3,
        })),
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: 30,
                max: 99,
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 2,
        })),
    Inventory.getCategory('trinket')
        .filter(
            withValueInRange({
                min: 100,
                max: 200,
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        })),
    Inventory.getCategory('food')
        .filter(
            withValueInRange({
                min: 15,
                max: 50,
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        })),
    Inventory.getCategory('food')
        .filter(
            withValueInRange({
                min: 15,
                max: 50,
            })
        )
        .map(({ key }) => ({
            chance: 1,
            item: key,
            number: 1,
        })),
]);

export const MassWreckage = new Room(
    {
        piecesFound: 0,
    },
    () => [
        ...VisitedDescription,
        ['follow-compass-to-crown', 'find-crown-piece-1', 'find-crown-piece-2', 'find-crown-piece-3', 'fight-for-crown'].includes(
            Quests.getStage('mainQuest') ?? ''
        )
            ? `Your compass just spins in circles here.`
            : null,
        Quests.getStage('mainQuest') === 'fight-for-crown'
            ? `The Bloodfins are still here.  Picking at the remains on the ocean floor, looking for anything of value to bring back to their tribe.`
            : null,
    ],
    (mainWreckage) => {
        const options: InputOption[] = [];

        const mainQuest = Quests.getStage('mainQuest');

        if (['find-crown-piece-1', 'find-crown-piece-2', 'find-crown-piece-3'].includes(mainQuest ?? '')) {
            options.push({
                code: 'search',
                text: 'Search for the Abyssal Crown',
            });
        } else if (mainQuest === 'fight-for-crown') {
            options.push({
                code: 'search',
                text: 'Fight the Bloodfins',
            });
        }

        return {
            options,
            select: (code) => {
                const bloodfinCombat = (backTo: RoomLike) =>
                    startCombatEncounter(backTo, [createBloodfin(3), createBloodfin(3), createBloodfin(3)], {
                        onComplete: (rm) => {
                            const loot = bloodFinLootTable.roll();
                            loot.forEach(({ count, item }) => {
                                Inventory.add(item, count);
                            });

                            return resultRoom(
                                () =>
                                    Quests.progress(
                                        () =>
                                            resultRoom(
                                                rm,
                                                `You rummage through the area and pick up:\n\n${loot.map(({ item, count }) => `${Inventory.get(item).name} (x${count})`).join('\n')}`
                                            ),
                                        'mainQuest',
                                        'fight-for-crown'
                                    ),
                                [
                                    `The last Bloodfin jerks once - then goes still.

The water settles slowly, disturbed currents fading as the echoes of the fight drift into silence. Dark shapes sink toward the seafloor, their presence already beginning to disappear into the vastness around you.`,
                                    `For a moment, there is nothing.

Just you.

And the Crown.`,
                                    `The pieces still hum faintly in your hands.

Carefully, you secure them in your pouch. Even there, you can feel it - an undeniable weight, not of mass, but of consequence.`,
                                    `You glance once more at the battlefield - the broken wreckage, the scattered remains, the silent aftermath of a fight long past... and the one you've just survived.

Then you turn.

The ocean stretches out before you, wide and waiting.

And somewhere beyond it... the path forward.`,
                                ],
                                undefined,
                                Mood.battle
                            );
                        },
                        onFailure: (rm) => {
                            return Player.die(
                                resultRoom(
                                    () => rm,
                                    'The Bloodfins seem to have left your body alone.  For now.  You can see them carrying the Abyssal crown as they circle nearby debris.\n\nNow is probably an opportune time to return home, heal, and regain your strength.',
                                    undefined,
                                    Mood.dead
                                )
                            );
                        },
                    });

                if (code === 'search') {
                    return startSearchRoom(mainWreckage, {
                        gridSize: 7,
                        maxAttempts: 5,
                        onComplete: (rm) => {
                            if (mainWreckage.state.piecesFound === 0) {
                                mainWreckage.state.piecesFound += 1;
                                return resultRoom(
                                    () => Quests.progress(rm, 'mainQuest', 'find-crown-piece-1'),
                                    [
                                        `You find a fragment of gold, giving off a low, resonant hum.  It looks to be a part of a crown.  There should be more fragments to find in order to have the full crown.`,
                                    ],
                                    undefined,
                                    Mood.miniGame
                                );
                            } else if (mainWreckage.state.piecesFound === 1) {
                                mainWreckage.state.piecesFound += 1;
                                return resultRoom(
                                    () => Quests.progress(rm, 'mainQuest', 'find-crown-piece-2'),
                                    [
                                        `You find a second fragment of gold similar to the first, also giving off a low, resonant hum.  Aligning their jagged sides together, it looks like you have one more fragment left to find.`,
                                    ],
                                    undefined,
                                    Mood.miniGame
                                );
                            } else if (mainWreckage.state.piecesFound === 2) {
                                mainWreckage.state.piecesFound += 1;
                                return resultRoom(
                                    () => Quests.progress(bloodfinCombat(rm), 'mainQuest', 'find-crown-piece-3'),
                                    [
                                        `You find a third fragment and match it up with the other two fragments you found.`,
                                        `A low vibration spreads through the water around you, subtle but undeniable, as though the ocean itself has noticed what you've done. The crown feels heavier now - not in weight, but in presence. Powerful. Dangerous. Important.

You steady it, instinctively drawing it closer, preparing to stow it safely - 

A sharp current snaps through the water behind you.

Too fast.

Too close.

You turn.`,
                                        `Three shapes cut through the haze, circling wide before tightening in. Sleek, scarred bodies. Jagged fins. Eyes locked onto you with unmistakable hunger.

Bloodfins.

One drifts forward slightly, baring rows of teeth in something that almost resembles a grin.

"Well now... look what drifted off the reef."`,
                                        `Another circles behind you, slower, more deliberate.

"Shiny little thing you've got there... and a fresh meal to go with it."`,
                                        `They don't recognize the crown.

They don't need to.

To them, it's just something worth taking.

And you're just something worth eating.`,
                                        `The circle tightens.

Before you can even react, one of the sharks charges past you and swipes the crown fragments.`,
                                    ],
                                    undefined,
                                    Mood.miniGame
                                );
                            }

                            return rm;
                        },
                    });
                }

                return mainWreckage;
            },
        };
    },
    () => {
        return [
            {
                code: 'travel-east',
                text: 'Go east to the shark territory',
            },
            {
                code: 'travel-south',
                text: 'Go south to the shipwreck',
            },
        ];
    }
)
    .atLocation(OpenOceanMap, 'A', 4)
    .withName(RoomNames.openOcean.massWreckage)
    .withInventoryAccess()
    .withOnEnter((rm) => {
        const dialogue = new DialogueTree([
            ...(!rm.visited ? OnEnterDescription : []),
            Quests.getStage('mainQuest') === 'follow-compass-to-crown'
                ? (backTo) => Quests.progress(backTo, 'mainQuest', 'follow-compass-to-crown')
                : null,
        ]);

        rm.visited = true;

        return dialogue.getRoom(rm);
    });

const OnEnterDescription = [
    `The water grows colder as you drift into the remnants of a long-forgotten battlefield.

At first, it looks like scattered debris - until your eyes adjust.`,
    `Broken fragments of a massive surface vessel lie half-buried in the seafloor, its hull splintered into jagged sections, blackened in places as if scorched by something unnatural. Twisted beams jut outward at unnatural angles, and rusted chains coil through the wreckage like the remains of something that once struggled violently to break free.

Between the shattered wood and metal, the ocean floor is scarred.`,
    `Deep gouges carve through the sand and stone, as though something immense tore across it with force. Coral has tried to reclaim the area, but it grows unevenly here - warped, discolored, interrupted by patches of bare, lifeless ground. In some places, faint fragments of smooth, foreign material remain embedded in the earth... remnants of something not meant for this world.

There are other signs, too.`,
    `Bladed weapons, long since dulled and scattered. Fractured constructs of unknown design. And here and there, faint markings etched into stone - symbols of the Silent Order, worn but still visible, as if left behind in haste.

The water feels unsettled, even now. Currents shift strangely, pulling in conflicting directions, carrying a lingering tension that has never fully faded.`,
    `Whatever happened here... it was not clean.

It was not controlled.

It was a desperate fight to ensure something would never reach the surface.

And even in ruin, it feels unfinished.`,
];

const VisitedDescription = [
    `Scattered debris from a long-forgotten battlefield surrounds you.
    
To the east, sharks swim back and forth, patrolling their territory.

To the south an old shipwreck is slowly buried in the shifting sands of the ocean floor.`,
];
