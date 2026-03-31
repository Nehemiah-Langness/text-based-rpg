import { Inventory } from './inventory/inventory';
import { Knowledge } from './knowledge';
import { NpcList } from './npcs/npc-list';
import { Player } from './player';
import { Quests } from './quests';
import { loadMap, Map, saveMap } from './engine/map';
import { Room } from './engine/room';
import { Stats } from './stats';

export function saveGame(currentRoom: Room) {
    localStorage.setItem(
        'saved-game',
        JSON.stringify({
            player: Player,
            inventory: Inventory,
            map: saveMap(),
            location: currentRoom.coordinates,
            knowledge: Knowledge,
            quests: Quests,
            npcs: NpcList.map((x) => x.save()),
            stats: Stats,
        })
    );
}

export function loadGame() {
    try {
        const savedState = localStorage.getItem('saved-game');
        if (!savedState) return false;

        const { inventory, map, player, location, knowledge, quests, npcs, stats } = JSON.parse(savedState) as {
            player?: typeof Player;
            inventory?: typeof Inventory;
            map?: ReturnType<typeof saveMap>;
            location?: Room['coordinates'];
            knowledge?: typeof Knowledge;
            quests?: typeof Quests;
            npcs?: { id: string; met: boolean; currentRemark: number }[];
            stats?: typeof Stats;
        };

        Object.assign(Player, player);
        Object.assign(Inventory, inventory);
        Object.assign(Knowledge, knowledge);
        Object.assign(Quests, quests);
        Object.assign(Stats, stats);

        if (map) loadMap(map);

        NpcList.forEach((npc) => {
            const saveData = npcs?.find((x) => x.id === npc.id);
            if (saveData) {
                npc.load(saveData);
            }
        });

        return location ? Map[location.y][location.x] : null;
    } catch (error) {
        console.error(error);
        return false;
    }
}
