export function rollDice(sides: number, times = 1) {
    let total = 0;
    for (let x = 0; x < times; x++) {
        total += rollDie(sides);
    }
    return total;
}

export function multipleDiceRoll(sides: number, times: number) {
    return new Array(times).fill(0).map(() => rollDice(sides));
}

function rollDie(sides: number) {
    return Math.round(0.5 + Math.random() * sides);
}
