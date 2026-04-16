import type { RoomLike } from './room';

export type Dialogue = string | (string | null | ((rm: RoomLike) => RoomLike))[];
