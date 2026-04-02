export function healthToDescription(healthPercent: number) {
    if (healthPercent === 1) {
        return 'in perfect health';
    }
    if (healthPercent >= 0.8) {
        return 'in great health';
    }
    if (healthPercent >= 0.6) {
        return 'slightly scathed';
    }
    if (healthPercent >= 0.4) {
        return 'quite wounded';
    }
    if (healthPercent >= 0.2) {
        return 'critically wounded';
    }
    if (healthPercent >= 0.1) {
        return 'approaching death';
    }
    if (healthPercent >= 0) {
        return "at death's door";
    }
    return 'dead';
}
