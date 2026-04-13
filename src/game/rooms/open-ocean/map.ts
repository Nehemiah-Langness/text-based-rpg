import { Map } from '../../engine/map';
import { MapNames } from '../names';

/* MAP
      N
    W * E
      S
| A1 -------| A2 -------| A3 -------| A4 -------| A5 -------| A6 -------|
|           |           |           |           |           |           |
|           |           |           |   Mass        Sharks  |           |
|           |           |           |  Wreckage |(Bloodfins)|           |
|-----------|-----------|-----------|-----  ----|-----  ----|-----  ----|
| B1 -------| B2 -------| B3 -------| B4 -  ----| B5 -  ----| B6 -  ----|
|           |           |           |           |           |           |
|           |  Dolphin      Kelp         Old       Sacred   |           |
|           |   City    |   Forest  | Shipwreck |  Gardens  |           |
|-----------|-----  ----|-----------|-----------|-----  ----|-----------|
| C1 -------| C2 -  ----| C3 -------| C4 -------| C5 -  ----| C6 -------|
|           |           |           |           |           |           |
|           |   Crab         Dark   |  Mermaid  | Wasteland |   Sharks  |
|           | Work yard |   Waters  |    City   |           |   (Tide)  |
|-----------|-----  ----|-----  ----|-----  ----|-----  ----|-----  ----|
| D1 -------| D2 -  ----| D3 -  ----| D4 -  ----| D5 -  ----| D6 -  ----|
|           |           |           |           |           |           |
|           |  Sealed     Forgotten   Outskirts     Coral       Deep    |
|           |  Cavern   |  Shrine   |           |    Reef   | Coral Reef|
|-----------|-----------|-----  ----|-----------|-----------|-----------|
| E1 -------| E2 -------| E3 -  ----| E4 -------| E5 -------| E6 -------|
|           |           |           |           |           |           |
|           |           |  Sharks       Tench      Dolphin     Abyssal  |
|           |           | (Stonejaw)|           |  Patrols  |  Descent  |
|-----------|-----------|-----------|-----------|-----------|-----  ----|
| F1 -------| F2 -------| F3 -------| F4 -------| F5 -------| F6 -  ----|
|           |           |           |           |           |           |
|           |           |           |           |           |  Trident  |
|           |           |           |           |           |   Cave    |
|-----------|-----------|-----------|-----------|-----------|-----------|
*/

export const OpenOceanMap = new Map(MapNames.openOcean, 6, 'F');
