export function checkNonempty(strs: (string | null)[]): string[] {
    const result: string[] = []
    for (let s of strs) {
        if (s !== null && s.length > 0) {
            result.push(s)
        } else {
            return []
        }
    }
    return result;
}