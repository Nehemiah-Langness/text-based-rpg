export function oxfordComma(...items: (string | null)[]) {
    const cleaned = items.filter((x) => x !== null).filter((x) => x);

    if (cleaned.length < 2) return cleaned.join(' ');
    if (cleaned.length === 2) return cleaned.join(' and ');
    return cleaned.slice(0, -1).join(', ') + ', and ' + cleaned.slice(-1)[0];
}
