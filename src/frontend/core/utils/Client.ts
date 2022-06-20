export function deserializeJSON(v: any) {
    if (!v) return {}
    const parsed = JSON.parse(v)
    const stack = [parsed]
    while (stack.length > 0) {
        const obj = stack.pop()
        for (let k in obj) {
            const val = obj[k]
            if (k.startsWith("ts")) {
                obj[k] = new Date(val)
            } else if (Array.isArray(val)) {
                for (let arrItem of val) {
                    stack.push(arrItem)
                }
            } else if (val instanceof Object) {
                stack.push(val)
            }
        }
    }
    return parsed
}
