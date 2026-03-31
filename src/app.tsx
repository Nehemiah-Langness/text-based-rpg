import { Game } from './game';

function App() {
    return <Game />;
}

export default App;

declare global {
    interface Array<T> {
        groupBy(key: (item: T) => string): {
            key: string;
            values: T[];
        }[];
    }
}

function groupBy<T>(list: T[], key: (item: T) => string): Record<string, T[]> {
    const dictionary: Record<string, T[]> = {};
    return list.reduce((current, next) => {
        (current[key(next)] = current[key(next)] ?? []).push(next);
        return current;
    }, dictionary);
}

function groupByList<T>(list: T[], key: (item: T) => string): { key: string; values: T[] }[] {
    return Object.entries(groupBy(list, key)).map(([key, values]) => {
        return {
            key,
            values,
        };
    });
}

Array.prototype.groupBy = function (key) {
    return groupByList(this, key);
};
