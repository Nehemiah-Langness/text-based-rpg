export function staminaToDescription(staminaPercent: number) {
    if (staminaPercent === 1) {
        return 'fully energized';
    }
    if (staminaPercent >= 0.8) {
        return 'feeling energetic';
    }
    if (staminaPercent >= 0.6) {
        return 'getting winded';
    }
    if (staminaPercent >= 0.4) {
        return 'feeling worn down';
    }
    if (staminaPercent >= 0.2) {
        return 'exhausted';
    }
    if (staminaPercent >= 0.1) {
        return 'about to collapse from exhaustion';
    }
    if (staminaPercent >= 0) {
        return 'faint and about to lose consciousness';
    }
    return 'unconscious';
}
