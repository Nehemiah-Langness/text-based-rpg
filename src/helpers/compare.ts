type PropertyType<T> = (t: T) => string | number | Date | boolean;
type OrderType = 'asc' | 'desc';

type Comparer<T> = (a: T, b: T) => -1 | 0 | 1;
type CompareSignature<T> = Comparer<T> & {
    thenBy: (prop: PropertyType<T>, order?: OrderType) => CompareSignature<T>;
};

export function compare<T>(prop: PropertyType<T>, order: OrderType = 'asc', baseSort?: Comparer<T>): CompareSignature<T> {
    const comparer = ((a: T, b: T) => {
        const aVal = prop(a);
        const bVal = prop(b);
        let sortValue = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;

        if (order === 'desc') {
            sortValue = -sortValue;
        }

        return baseSort ? baseSort(a, b) || sortValue : sortValue;
    }) as CompareSignature<T>;

    comparer.thenBy = (nextProp: PropertyType<T>, order: OrderType = 'asc') => {
        return compare(nextProp, order, comparer);
    };

    return comparer;
}
