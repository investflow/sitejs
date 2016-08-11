export function percentBetweenPercents(startPercent: number, entPercent: number): number {
    if (startPercent <= -100) {
        return 0;
    }
    return 100 * (entPercent - startPercent) / (startPercent + 100);
}

export function percentBetweenEquity(startEquity: number, endEquity: number): number {
    return percentBetweenPercents(startEquity - 100, endEquity - 100)
}
