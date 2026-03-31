export function rollDice(side: number, times = 1) {
    let total = 0;
    for (let x = 0; x < times; x++) {
        total += rollDie(side);
    }
    return total;
}

function rollDie(sides: number) {
    return Math.round(0.5 + Math.random() * sides);
}
