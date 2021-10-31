import { match } from "ts-pattern";
import EitherMsg from "../types/EitherMsg";

function fetchFromClientGeneral<T>(response: EitherMsg<T>, actionOK: (v: T) => void, action: (m: string) => void) {
    match<EitherMsg<T>, void>(response)
        .with({isOK: false}, (res) => action(res.errMsg))
        .with({isOK: true}, (res) => actionOK(res.value))
}

export async function fetchFromClient<T>(response: Promise<EitherMsg<T>>, actionOK: (v: T) => void) {
    const result = await response
    console.log("response in fetchFromClient:")
    console.log(result)
    match<EitherMsg<T>, void>(result)
        .with({isOK: false}, (res) => console.log(res.errMsg))
        .with({isOK: true}, (res) => actionOK(res.value))
}