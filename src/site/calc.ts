export function percentBetween(startValue:number, endValue:number):number {
    if (startValue <= -100) {
        return 0;
    }
    return 100 * (endValue - startValue) / (startValue + 100);
}

export function percentBetweenEquity(startValue:number, endValue:number):number {
    return percentBetween(startValue - 100, endValue - 100)
}
