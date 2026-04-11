import { Inventory } from './inventory';
import { NpcList } from './npcs/npc-list';
import { MapList } from './rooms/map-list';
import { Player } from './player';
import { Quests } from './quests';
import { Map } from './engine/map';
import { Room } from './engine/room';
import { Stats } from './stats';

export function saveGame(currentRoom: Room) {
    localStorage.setItem(
        'saved-game',
        JSON.stringify({
            player: Player.save(),
            inventory: Inventory.save(),
            maps: MapList.map((map) => map.saveMap()),
            location: {
                map: currentRoom.map?.id,
                coordinates: currentRoom.coordinates,
            },
            quests: Quests.save(),
            npcs: NpcList.map((x) => x.save()),
            stats: Stats,
        })
    );
}

export function loadGame() {
    try {
        const savedState = localStorage.getItem('saved-game');
        if (!savedState) return false;

        const { inventory, maps, player, location, quests, npcs, stats } = JSON.parse(savedState) as {
            player?: ReturnType<typeof Player.save>;
            inventory?: ReturnType<typeof Inventory.save>;
            maps?: ReturnType<Map['saveMap']>[];
            location?: {
                map: Map['id'];
                coordinates: Room['coordinates'];
            };
            quests?: ReturnType<(typeof Quests)['save']>;
            npcs?: { id: string; met: boolean; currentRemark: number }[];
            stats?: typeof Stats;
        };

        Object.assign(Stats, stats);
        if (player) {
            Player.load(player);
        }
        if (quests) {
            Quests.load(quests);
        }
        if (inventory) {
            Inventory.load(inventory);
        }

        maps?.forEach(({ data, id }) => {
            const map = MapList.find((x) => x.id === id);
            if (map) {
                map.loadMap(data);
            }
        });

        NpcList.forEach((npc) => {
            const saveData = npcs?.find((x) => x.id === npc.id);
            if (saveData) {
                npc.load(saveData);
            }
        });

        const savedMap = MapList.find((m) => m.id === location?.map);
        if (savedMap && location?.coordinates) {
            return savedMap.cells[location.coordinates.y][location.coordinates.x] ?? null;
        }

        return null;
    } catch (error) {
        console.error(error);
        return false;
    }
}
