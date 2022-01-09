import EitherMsg from "../types/EitherMsg";

export async function fetchFromClient<T>(response: Promise<EitherMsg<T>>, actionOK: (v: T) => void) {
    const result = await response
    console.log("response")
    console.log(result)
    if (result.isOK === true) {
        actionOK(result.value)
    } else {
        console.log(result.errMsg)
    }
}

export async function fetchFromClientTransform<T, U>(response: Promise<EitherMsg<T>>, transform: (a: T) => U, actionOK: (v: U) => void) {
    const result = await response
    if (result.isOK === true) {
        actionOK(transform(result.value))
    } else {
        console.log(result.errMsg)
    }
}

export function deserializeJSON(v: any) {
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