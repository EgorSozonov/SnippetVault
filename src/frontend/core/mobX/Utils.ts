import ServerResponse from "../types/ServerResponse"


export async function fetchFromClient<T>(response: Promise<ServerResponse<T>>, actionOK: (v: T) => void) {
    const result = await response
    if (result.isOK === true) {
        actionOK(result.value)
    } else {
        console.log(result.errMsg)
    }
}


export async function fetchFromClientTransform<T, U>(response: Promise<ServerResponse<T>>, transform: (a: T) => U, actionOK: (v: U) => void) {
    const result = await response
    if (result.isOK === true) {
        actionOK(transform(result.value))
    } else {
        console.log(result.errMsg)
    }
}
