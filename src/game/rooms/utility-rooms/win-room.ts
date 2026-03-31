import { Inventory } from '../../inventory/inventory';
import type { Item } from '../../inventory/types/item';
import { Stats } from '../../stats';
import { Room } from '../../engine/room';
import { resultRoom } from './result-room';

export function winRoom(backTo: Room) {
    return resultRoom(backTo, [
        'You have defeated the Sorcerer Warlord.  The village is now safe as the enemies that roam around it begin to dwindle with every swipe of your sword and shot from your bow.',
        'You have won the game.',
        `You slept ${Stats.nightsSlept ?? 0} night${Stats.nightsSlept === 1 ? '' : 's'}.`,
        `You caused ${Stats.damageInflicted ?? 0} damage and took ${Stats.healthLost ?? 0} damage.`,
        `The highest damage you caused was ${Stats.highestDamage ?? ''}.`,
        `You used ${Stats.staminaLost ?? ''} stamina points.`,
        `You blocked ${Stats.attacksBlocked ?? 0} attack${Stats.attacksBlocked === 1 ? '' : 's'} and dodged ${Stats.attacksDogged ?? 0} attack${Stats.attacksDogged === 1 ? '' : 's'}.`,
        `Your highest defense was ${Stats.highestDefense ?? 0}.`,
        `Your highest amount of luck used in combat was ${Stats.highestLuck ?? 0}.`,
        `You restored ${Stats.healthRestored ?? 0} health points and ${Stats.staminaRestored ?? 0} stamina points.`,
        `You caught ${Stats.fishCaught ?? 0} fish.`,
        `You foraged ${Stats.herbsForaged ?? 0} medicinal herb${Stats.herbsForaged === 1 ? '' : 's'}.`,
        `You earned ${Stats.goldFromFarming ?? 0} gold from farming.`,
        `You earned a total of ${Stats.goldEarned ?? 0} gold and spent ${Stats.goldSpent}.`,
        `You consumed:\n\n${
            Object.entries(Stats.consumedItems)
                .map(([item, count]) => `${count} ${item}${count === 1 ? '' : (Inventory[item as Item].plural ?? 's')}`)
                .join('\n') || 'Nothing at all.'
        }`,
        `The defeated:\n\n${
            Object.entries(Stats.enemiesDefeated)
                .map(([item, count]) => `${count} ${item}`)
                .join('\n') || 'Nothing at all.'
        }`,
    ]);
}
