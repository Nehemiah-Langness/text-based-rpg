export function oxfordComma(...items: string[]) {
    if (items.length < 2) return items.join(' ');
    if (items.length === 2) return items.join(' and ');
    return items.slice(0, -1).join(', ') + ', and ' + items.slice(-1)[0];
}
