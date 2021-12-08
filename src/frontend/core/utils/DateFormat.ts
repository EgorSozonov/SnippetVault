export function fmtDt(dt: Date): string {
    const month = dt.getMonth() + 1
    return `${dt.getFullYear()}-${prependZero(month)}-${prependZero(dt.getDate())}`
}

function prependZero(i: number): string {
    return i > 9 ? i.toString() : `0${i}`
}