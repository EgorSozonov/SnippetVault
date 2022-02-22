export function fmtDt(dt: Date): string {
    const month = dt.getMonth() + 1
    return `${dt.getFullYear()}-${prependZero(month)}-${prependZero(dt.getDate())}`
}

function prependZero(i: number): string {
    return i > 9 ? i.toString() : `0${i}`
}

export type DateOnly = {
    year: number,
    /**
     * 1-based month number
     */
    month: number,
    /**
     * 1-based day-of-month
     */
    day: number,
}

export function dateOfTS(ts: Date): DateOnly {
    return { year: ts.getFullYear(), month: ts.getMonth() + 1, day: ts.getDate(), }
}

export function isSameDay(ts: Date, dt: DateOnly): boolean {
    const dtOfTS = dateOfTS(ts)
    return dtOfTS.year === dt.year && dtOfTS.month === dt.month && dtOfTS.day === dt.day
}
