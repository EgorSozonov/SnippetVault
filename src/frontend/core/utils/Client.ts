import EitherMsg from "../types/EitherMsg";

export async function fetchFromClient<T>(response: Promise<EitherMsg<T>>, actionOK: (v: T) => void) {
    const result = await response
    console.log("result")
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