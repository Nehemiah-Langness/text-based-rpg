export class PriceTable<T extends string> {
    table: Record<T, number>;

    constructor(table: Record<T, number>) {
        this.table = table;
    }

    get(category: T, amount: number) {
        return Math.ceil(this.table[category] * amount);
    }
    getCombination(items: ({ category: T; amount: number } | null)[]) {
        return items.filter((x) => x !== null).reduce((c, n) => c + this.get(n.category, n.amount), 0);
    }
}
