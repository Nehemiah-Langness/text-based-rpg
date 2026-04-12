import type { RoomLike } from '../../engine/room';
import { Mood } from '../moods/mood';
import { resultRoom } from '../utility-rooms/result-room';

export const VelmoraJournalEntryOne = (backTo: RoomLike) =>
    resultRoom(
        backTo,
        [
            `The ink is faded in places, the script flowing but uneven - written by many arms, each line pressed with quiet urgency.

"I record this not in hope... but in duty.

The Silent Order has failed."`,
            `"For centuries, we kept the balance. We watched. We guarded. We ensured that no single will could claim dominion over the tides. The Trident of the Deep remained hidden, its resting place sealed beyond reach - protected not only by distance, but by design."`,
            `"The Abyssal Crown was the key.

Not a weapon, as some believed - but a conduit. A focus of immense energy, capable of unraveling the seal that shields the Trident's chamber. It was never meant to be used lightly. Only in unity. Only in absolute necessity."`,
            `"Humans... fragile, fleeting, and yet endlessly ambitious. They learned of the Trident through whispers carried where they should not have been. Legends twisted into hunger.

They came for it.

We intercepted their vessel before it could make landfall, far from the safety of their shores. Their ship was crude, but their intent was not. They would not have stopped."`,
            `"So we made the only choice left to us.

We destroyed it.

The battle was... chaotic. Fire beneath water. Sound without direction. In the struggle, the Crown was struck - fractured by forces it was never meant to endure.

It shattered.

Pieces scattered into the depths, lost among currents and ruin."`,
            `"The survivors of our Order made a vow that day: the Crown would never be whole again.

I was given the compass.

A simple object, by appearance. But it does not point north. It does not serve the sea.

It points to power.

To the remnants of the Abyssal Crown."`,
            `"I have hidden myself within this reef, far from the eyes of those who still search. If the pieces are ever gathered again, it must be by one who understands the cost... not the reward.

If you hold this now, then I have failed in my final duty.

Or perhaps... I have succeeded."`,
            `"The Crown can break the seal.

The Trident can be reached."`,
            `"But know this - 

The Order did not fear the Trident itself.

We feared the one who would wield it.

 - Velmora, Ink-Seer of the Silent Order"`,
        ],
        undefined,
        Mood.ominous
    );
